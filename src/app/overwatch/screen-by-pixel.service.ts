import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IFrameService } from '../model/frame-service.interface';
import { ScreenPoint } from '../model/screen-point.model';
import { Screen } from '../model/screen.model';
import { ColorDifferenceService } from '../tools/color-difference.service';
import { ColorUtilsService } from '../utils/color-utils.service';
import { OverwatchScreenName } from './screen-names';
import { ScreenSettingsService } from './screen-settings.service';

/**
 * Service that tries to determine the screen
 */
@Injectable({
    providedIn: 'root'
})
export class ScreenByPixelService<TScreenName extends OverwatchScreenName = OverwatchScreenName> {
    private readonly screenNames: Array<TScreenName | 'undefined'>;
    private lastScreenName: TScreenName | 'undefined';

    public reliability = new Map<TScreenName | 'undefined', {correct: number, incorrect: number}>();

    public constructor(
        private readonly frameService: IFrameService,
        private readonly screenSettingsService: ScreenSettingsService<TScreenName>,
        private readonly colorUtilsService: ColorUtilsService,
        private readonly colorDifferenceService: ColorDifferenceService,
    ) {
        this.screenNames = Object.keys(this.screenSettingsService.getScreens()) as TScreenName[];
    }

    public getScreen(): Observable<{frame: HTMLCanvasElement, screen: TScreenName | 'undefined'}> {
        return this.frameService.getFrame().pipe(
            map(({frame, expected}) => this.analyzeScreen(frame, expected as TScreenName | 'undefined'))
        );
    }

    public analyzeScreen(frame: HTMLCanvasElement, expected?: TScreenName | 'undefined'): {frame: HTMLCanvasElement, screen: TScreenName | 'undefined'} {
        // Get all screens and their defined probability based on which was the last screen
        const screenBaseProbabilities = this.screenNames.reduce(
            (prev, curr) => ({...prev, [curr]: 0.3}), {} as Record<TScreenName | 'undefined', number>);
        if (this.lastScreenName) {
            const lastScreen = this.screenSettingsService.getScreen(this.lastScreenName);
            for (const nextScreen of Object.entries(lastScreen.nextScreens)) {
                screenBaseProbabilities[nextScreen[0]] = nextScreen[1];
            }
            screenBaseProbabilities[this.lastScreenName] = 1.3;
        }
        // Sort
        const screenCheckOrder = Object.entries<number>(screenBaseProbabilities)
            .map((probabilityEntry) => ({name: probabilityEntry[0] as TScreenName, probability: probabilityEntry[1]}))
            .sort((a, b) => {
                // Randomize order of equal ranked screens
                return b.probability - a.probability || Math.random() - .5;
            })
            .map((screenWithProbability) => screenWithProbability.name);

        // Check the first random n possible screens, as long there's at least one with a high probability
        const screenProbabilities: AnalyzedScreen<TScreenName>[] = [];
        for (const screen of screenCheckOrder) {
            if (screen === 'undefined') {
                // "undefined" screens always have the same probability
                screenProbabilities.push({
                    name: 'undefined',
                    probability: {probability: .6, confidence: .3, matchingPoints: []} as ScreenProbability
                });
            } else {
                screenProbabilities.push({
                    name: screen,
                    probability: this.getScreenProbability(
                        frame,
                        this.screenSettingsService.getScreen(screen),
                        screen === this.lastScreenName
                    )
                });
            }

            if (
                screenProbabilities.some((screenProbability) => screenProbability.probability.probability >= .8) &&
                Math.random() > .8
            ) {
                break;
            }
        }

        // Get the screen with the highest probability
        const sortedScreens = screenProbabilities.sort((a, b) => {
            const aProbability = screenBaseProbabilities[a.name] * .1 + a.probability.probability * .6 + a.probability.confidence * .3;
            const bProbability = screenBaseProbabilities[b.name] * .1 + b.probability.probability * .6 + b.probability.confidence * .3;
            return bProbability - aProbability;
        });
        const probableScreen = sortedScreens[0];

        this.lastScreenName = probableScreen.name;

        this.log(frame, probableScreen, expected, sortedScreens);

        console.log('Detected screen', this.lastScreenName, sortedScreens);

        return {frame, screen: this.lastScreenName};
    }

    public setLastScreenName(screenName: 'undefined' | TScreenName): void {
        this.lastScreenName = screenName;
    }

    private log(
        frame: HTMLCanvasElement,
        actual: AnalyzedScreen<TScreenName | 'undefined'>,
        expectedName: TScreenName | 'undefined',
        sortedScreens: AnalyzedScreen<TScreenName>[]
    ): void {
        if (!this.screenNames.includes(expectedName)) {
            expectedName = 'undefined';
        }
        if (!this.reliability.has(expectedName)) {
            this.reliability.set(expectedName, {correct: 0, incorrect: 0});
        }
        const mapEntry = this.reliability.get(expectedName);
        if (this.lastScreenName === expectedName) {
            mapEntry.correct++;
            return;
        }

        // Incorrect screen
        mapEntry.incorrect++;
        console.groupCollapsed('Didn\'t expect screen. Expected:', expectedName, 'Actual:', actual.name);

        // Analyze expected screen
        let expected = sortedScreens.find((screen) => screen.name === expectedName);
        if (!expected) {
            expected = {
                name: expectedName,
                probability: this.getScreenProbability(frame, this.screenSettingsService.getScreen(expectedName), false)
            };
        }

        const expectedScreenPoints = this.getScreenPoints(expectedName);
        const expectedIncorrectPoints = expectedScreenPoints.filter(
            (point) => !this.colorUtilsService.pixelIsColor(frame, point, point.color));
        const actualScreenPoints = this.getScreenPoints(actual.name);

        if (actualScreenPoints.length === actual.probability.matchingPoints.length &&
             expectedScreenPoints.length === expected.probability.matchingPoints.length
        ) {
            console.log('Actual and expected screen both match all points.');

        } else {
            console.group(
                `${expectedIncorrectPoints.length} of ${expectedScreenPoints.length} points (without forgiveness) DON'T match of expected screen "${expectedName}"`
            );
            for (const point of expectedIncorrectPoints) {
                const actualColor = this.colorUtilsService.getPixelColor(frame, point);
                console.log(`Point "${point.name}" (x: ${point.x}, y: ${point.y}) ${point.importance} be different.`);
                console.log(...this.colorDifferenceService.getColorDifference(actualColor, point.color));
            }
            console.groupEnd();
            // Find out why actual matched better
            console.log(`Detected as ${actual.name} since ${actual.probability.matchingPoints.length} of ${actualScreenPoints.length} points match`);
        }

        console.groupEnd();
    }

    private previousForgivenesses: Array<{x: number, y: number, timesForgiven: number}> = [];

    /**
     * Calculates how many percent of ColorPosition match.
     *
     * This returns two numbers: The probability tells how many pixels have the expected color, the confidence how reliable this information
     * is (e.g. only "might" fields may have a high probability, but low confidence)
     */
    private getScreenProbability(
        frame: HTMLCanvasElement,
        screen: Screen<TScreenName>,
        isCurrentScreen: boolean
    ): ScreenProbability {
        const points = [
            ...(screen.must || []).map((colorPosition) => ({factor: 1, maxForgivness: 0, colorPosition})),
            ...(screen.should || []).map((colorPosition) => ({factor: 0.8, maxForgivness: 1, colorPosition})),
            ...(screen.might || []).map((colorPosition) => ({factor: 0.3, maxForgivness: 2, colorPosition}))
        ];

        const previousForgiveness = this.previousForgivenesses;
        if (isCurrentScreen) {
            this.previousForgivenesses = [];
        }

        const matchingPoints: Array<{point: ScreenPoint, forgiven: boolean}> = [];
        let matchingLowContrastCount = 0;

        const sum = points.reduce((prev, curr) => {
            let pixelIsColor = this.colorUtilsService.pixelIsColor(frame, curr.colorPosition, curr.colorPosition.color);

            if (pixelIsColor) {
                matchingPoints.push({point: curr.colorPosition, forgiven: false});
            }

            // "should" and "might" values are allowed to not be the correct color for 1 or 2 detections
            if (!pixelIsColor && isCurrentScreen && curr.maxForgivness > 0) {
                const previousForgivenessForPixel = previousForgiveness.find(
                    (forgivness) => forgivness.x === curr.colorPosition.x && forgivness.y === curr.colorPosition.y
                );
                const newTimesForgiven = previousForgivenessForPixel?.timesForgiven + 1 || 1;
                if (newTimesForgiven <= curr.maxForgivness) {
                    pixelIsColor = true;
                    matchingPoints.push({point: curr.colorPosition, forgiven: true});
                    this.previousForgivenesses.push({x: curr.colorPosition.x, y: curr.colorPosition.y, timesForgiven: newTimesForgiven});
                }
            }

            // Check for matching points if contrast to neighboring points is high enough
            let factor = curr.factor;
            if (pixelIsColor && curr.colorPosition.contrast) {
                if (this.colorUtilsService.getContrast(frame, curr.colorPosition, curr.colorPosition.contrast) < 0.15) {
                    matchingLowContrastCount++;
                    factor *= .9;
                }

            }

            return prev + (pixelIsColor ? factor : 0);
        }, 0);

        const sumMax = points.reduce((prev, curr) => prev + curr.factor, 0);
        const probability = sum / sumMax;

        // Calculate confidence
        // Decrease on unsure points
        const averageFactorFactor = sumMax / points.length;
        // Decrease for forgiven values
        const forgivenValuesFactor = .7 ** (isCurrentScreen ? this.previousForgivenesses.length : 0);
        // Decrease for colors with high transparency
        const transparencyFactor = .8 ** points.filter((point) => point.colorPosition.color.a <= .5).length;
        // Decrease for black + white
        const colorFactor = .95 ** points.map((point) => {
            const color = point.colorPosition.color;
            return color.r + color.g + color.b;
        }).filter((color) => color === 0 || color === 255 * 3).length;
        // Decrease for low number of checked points
        const checksFactor = .9 ** (10 - points.length);
        // Extra decrease for low contrast
        const lowContrastFactor = .8 ** matchingLowContrastCount;
        const confidence = averageFactorFactor * forgivenValuesFactor * transparencyFactor * colorFactor * checksFactor * lowContrastFactor;
        // console.log('confidence', {
        //     screen: screen.name,
        //     confidence, averageFactorFactor, forgivenValuesFactor, transparencyFactor, colorFactor, checksFactor, lowContrastFactor
        // });

        return {probability, confidence, matchingPoints};
    }

    private getScreenPoints(screenName: TScreenName | 'undefined'): Array<ScreenPoint & {importance: 'must' | 'should' | 'might'}> {
        const screen = this.screenSettingsService.getScreen(screenName);
        return [
            ...(screen.must || []).map((point) => ({...point, importance: 'must' as const})),
            ...(screen.should || []).map((point) => ({...point, importance: 'should' as const})),
            ...(screen.might || []).map((point) => ({...point, importance: 'might' as const})),
        ];
    }
}

interface AnalyzedScreen<TScreenName> {
    name: TScreenName | 'undefined';
    probability: ScreenProbability;
}

interface ScreenProbability {
    probability: number;
    confidence: number;
    matchingPoints: Array<{point: ScreenPoint, forgiven: boolean}>;
}
