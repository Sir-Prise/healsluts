import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ColorRGBAPosition } from '../model/color-rgba-position.model';
import { Position } from '../model/position.model';
import { ColorDifferenceService } from '../tools/color-difference.service';
import { ImageDisplayService } from '../tools/image-display.service';
import { ColorUtilsService } from '../utils/color-utils.service';
import { FrameService } from './frame.service';

// Colors
const MENUES_ADD_FRIEND_BTN_BG = {r: 50, g: 159, b: 231, a: 0.92};
const MENUES_FIND_GROUP_BTN_BG = {r: 249, g: 207, b: 43, a: 0.93};
const MENUS_USER_BOX_BG = {r: 40, g: 50, b: 75, a: 0.8};
const MENUES_AVATAR_BAR = {r: 131, g: 255, b: 12, a: 1};
const ALERT_POPUP_BG = {r: 23, g: 23, b: 33, a: 0.85};
const ALERT_POPUP_TEXT_BG = {r: 37, g: 46, b: 66, a: 0.96};
const ALERT_POPUP_ACTIONS_BG = {r: 35, g: 32, b: 36, a: 1};
const LOADING_MAP_OVERWATCH_LOGO = {r: 219, g: 253, b: 294, a: 0.67};
const LOADING_MAP_TIP_BG = {r: 42, g: 51, b: 78, a: 0.9};
const HERO_SELECTION_SKIN_BG = {r: 36, g: 120, b: 184, a: 0.49};
const HERO_SELECTION_SKIN_EXCLAMATION_MARK_BG = {r: 188, g: 247, b: 255, a: 0.76};
const HERO_SELECTION_HORIZONTAL_LINE = {r: 238, g: 234, b: 255, a: 0.44};
const MATCH_HEALTH_BAR_FILLED = {r: 255, g: 255, b: 255, a: 0.84};
const MATCH_HEALTH_BAR_EMPTY = {r: 255, g: 255, b: 255, a: 0.37};
const MATCH_ON_FIRE_EMPTY = {r: 255, g: 255, b: 255, a: 0.25};
const MATCH_DEAD_BLOOD_UL = {r: 215, g: 0, b: 5, a: 0.5};
const MATCH_DEAD_BLOOD_LR = {r: 215, g: 0, b: 5, a: 0.7};
const KILLCAM_WHITE_BORDER_BOTTOM = {r: 255, g: 255, b: 255, a: 0.22};
const KILLCAM_WHITE_BORDER_COUNTDOWN = {r: 255, g: 255, b: 255, a: 0.34};
const KILLCAM_DARK_OVERLAY_BOTTOM = {r: 0, g: 0, b: 0, a: 0.78};
const KILLCAM_DARK_GLBOAL_OVERLAY = {r: 0, g: 0, b: 0, a: 0.14};
const SPECTATE_RESPAWN_COUNTDOWN_BORDER = {r: 255, g: 255, b: 255, a: 1};
const SCORE_BOARD_TOP_BOTTOM_BG = {r: 0, g: 0, b: 0, a: 0.95};
const SCORE_BOARD_GLOBAL_OVERLAY = {r: 0, g: 0, b: 0, a: 0.79};
const SCORE_BOARD_LINES = {r: 255, g: 255, b: 255, a: 0.2};
const SCORE_BOARD_MODE_LINES = {r: 255, g: 255, b: 255, a: 0.27};
const INTERACTION_MENU_OUTER_CIRCLE = {r: 255, g: 255, b: 255, a: 1};
const INTERACTION_MENU_OVERLAY = {r: 0, g: 0, b: 0, a: 0.73};

const DARK_OVERLAY_TOP_BORDER = {r: 255, g: 255, b: 255, a: 0.2};
const DARK_OVERLAY_TOP_BG = {r: 0, g: 0, b: 0, a: 0.36};
const IN_GAME_RETICLE_BG = {r: 255, g: 255, b: 255, a: 0.79};
const IN_GAME_RETICLE_BORDER = {r: 0, g: 0, b: 0, a: 0.34};
const IN_GAME_ON_FIRE_ICON = {r: 255, g: 255, b: 255, a: 0.85};
const IN_GAME_ON_FIRE_MAX_MARKER = {r: 255, g: 255, b: 255, a: 0.79};

// Common color positions
const DARK_OVERLAY_TOP = [
    {name: 'dark overlay top bg ul', x: 200, y: 115, color: DARK_OVERLAY_TOP_BG, contrast: {x: 200, y: 140}},
    {name: 'dark overlay top border ul', x: 200, y: 126, color: DARK_OVERLAY_TOP_BORDER, contrast: {x: 200, y: 115}},
    {name: 'dark overlay top bg ur', x: 1800, y: 25, color: DARK_OVERLAY_TOP_BG, contrast: {x: 1800, y: 127}},
    {name: 'dark overlay top border ur', x: 1800, y: 127, color: DARK_OVERLAY_TOP_BORDER, contrast: {x: 1800, y: 140}},
];
const IN_GAME_RETICLE = [
    // Currently, browsers always capture the cursor which overlays the reticle, so I picked a visible corner, not the center
    {name: 'reticle bg', x: 957, y: 539, color: IN_GAME_RETICLE_BG},
    {name: 'reticle border', x: 962, y: 537, color: IN_GAME_RETICLE_BORDER},
];
const IN_GAME_ON_FIRE_ICONS = [
    {name: 'on fire icon', x: 257, y: 997, color: IN_GAME_ON_FIRE_ICON},
    {name: 'on fire max marker', x: 432, y: 996, color: IN_GAME_ON_FIRE_MAX_MARKER},
];

type ScreenName = 'menues' | 'alertPopup' | 'loadingMap' | 'heroSelection' | 'matchAlive' | 'matchNoPrimary' | 'matchDead' | 'killcam' | 'deadSpectating' |
    'potgSpectating' | 'scoreBoard' | 'interactionMenu' | 'undefined';
/* TODO Screens:
 * scoreScreen		(e.g. 1:0)
 * matchResult		("e.g. VICTORY")
 * victoryPoses
 * potgIntro
 * cards
 * endorsementSelector
 * stats			(stats shown after the match)
 */

@Injectable({
    providedIn: 'root'
})
export class ScreenDetectionService {
    private readonly screens: ScreensModel = {
        menues: {
            name: 'menues',
            must: [
                {name: 'add friend button ul', x: 1454, y: 39, color: MENUES_ADD_FRIEND_BTN_BG},
                {name: 'add friend button lr', x: 1494, y: 80, color: MENUES_ADD_FRIEND_BTN_BG},
                {name: 'find group button ur', x: 1430, y: 40, color: MENUES_FIND_GROUP_BTN_BG},
                {name: 'find group button ll', x: 1390, y: 80, color: MENUES_FIND_GROUP_BTN_BG},
                {name: 'user box bg ul', x: 1590, y: 40, color: MENUS_USER_BOX_BG},
                {name: 'user box bg lr', x: 1850, y: 80, color: MENUS_USER_BOX_BG},
                {name: 'avatar bar', x: 1517, y: 64, color: MENUES_AVATAR_BAR},
            ],
            nextScreens: {
                alertPopup: 1,
                loadingMap: 1,
                undefined: 1,
            }
        },
        alertPopup: {
            name: 'alertPopup',
            must: [
                {name: 'bg ul', x: 300, y: 200, color: ALERT_POPUP_BG},
                {name: 'bg lr', x: 1400, y: 1000, color: ALERT_POPUP_BG},
                {name: 'text bg ul', x: 20, y: 490, color: ALERT_POPUP_TEXT_BG},
                {name: 'text bg lr', x: 1500, y: 530, color: ALERT_POPUP_TEXT_BG},
                {name: 'actions bg ul', x: 40, y: 590, color: ALERT_POPUP_ACTIONS_BG},
                {name: 'actions bg lr', x: 1900, y: 630, color: ALERT_POPUP_ACTIONS_BG},
            ],
            nextScreens: {
                // All equal
            }
        },
        loadingMap: {
            name: 'loadingMap',
            must: [
                {name: 'overwatch logo ul', x: 1750, y: 940, color: LOADING_MAP_OVERWATCH_LOGO},
                {name: 'overwatch logo lr', x: 1800, y: 980, color: LOADING_MAP_OVERWATCH_LOGO},
                {name: 'tip bg ul', x: 20, y: 760, color: LOADING_MAP_TIP_BG},
                {name: 'tip bg lr', x: 570, y: 770, color: LOADING_MAP_TIP_BG},
            ],
            nextScreens: {
                heroSelection: 1
            }
        },
        heroSelection: {
            name: 'heroSelection',
            must: [
                {name: 'skin bg ul', x: 1425, y: 220, color: HERO_SELECTION_SKIN_BG},
                {name: 'skin bg lr', x: 1800, y: 230, color: HERO_SELECTION_SKIN_BG},
                {name: 'exclamation mark bg ul', x: 1815, y: 120, color: HERO_SELECTION_SKIN_EXCLAMATION_MARK_BG},
                {name: 'exclamation mark bg lr', x: 1855, y: 145, color: HERO_SELECTION_SKIN_EXCLAMATION_MARK_BG},
                {name: 'horizontal line l', x: 140, y: 740, color: HERO_SELECTION_HORIZONTAL_LINE},
                {name: 'horizontal line r', x: 1750, y: 740, color: HERO_SELECTION_HORIZONTAL_LINE},
            ],
            nextScreens: {
                matchAlive: 1
            }
        },
        matchAlive: {
            name: 'matchAlive',
            should: [
                ...IN_GAME_RETICLE, // Can't be "must", because the red kill icon overlays the reticle
                {name: 'health bar minimum filled', x: 261, y: 966, color: MATCH_HEALTH_BAR_FILLED},
            ],
            might: [
                {name: 'on fire bar maximum not filled', x: 470, y: 980, color: MATCH_ON_FIRE_EMPTY},
                ...IN_GAME_ON_FIRE_ICONS,
            ],
            nextScreens: {
                matchDead: 1,
                scoreBoard: .7,
                interactionMenu: .5,
                matchNoPrimary: .4,
                alertPopup: .1,
                undefined: .3,
            }
        },
        matchNoPrimary: {
            name: 'matchNoPrimary',
            should: [
                {name: 'health bar minimum filled', x: 261, y: 966, color: MATCH_HEALTH_BAR_FILLED}
            ],
            might: [
                {name: 'on fire bar maximum empty', x: 470, y: 980, color: MATCH_ON_FIRE_EMPTY},
                ...IN_GAME_ON_FIRE_ICONS,
            ],
            nextScreens: {
                matchAlive: 1,
                matchDead: .9
            }
        },
        matchDead: {
            name: 'matchDead',
            must: [
                {name: 'health bar minimum empty', x: 270, y: 966, color: MATCH_HEALTH_BAR_EMPTY},
                ...IN_GAME_ON_FIRE_ICONS,
            ],
            should: [
                {name: 'blood ul', x: 10, y: 10, color: MATCH_DEAD_BLOOD_UL, contrast: {x: 130, y: 130}},
                {name: 'blood lr', x: 1910, y: 1070, color: MATCH_DEAD_BLOOD_LR, contrast: {x: 1790, y: 950}},
            ],
            might: [
                {name: 'on fire bar maximum empty', x: 470, y: 980, color: MATCH_ON_FIRE_EMPTY},
            ],
            nextScreens: {
                killcam: 1,
                scoreBoard: .7,
                deadSpectating: .7,
            }
        },
        killcam: {
            name: 'killcam',
            must: [
                {name: 'white border bottom l', x: 400, y: 828, color: KILLCAM_WHITE_BORDER_BOTTOM},
                {name: 'white border bottom r', x: 1970, y: 827, color: KILLCAM_WHITE_BORDER_BOTTOM},
                {name: 'countdown border ul', x: 1800, y: 40, color: KILLCAM_WHITE_BORDER_COUNTDOWN},
                {name: 'countdown border lr', x: 1860, y: 90, color: KILLCAM_WHITE_BORDER_COUNTDOWN},
                {name: 'dark oberlay bottom ll', x: 200, y: 970, color: KILLCAM_DARK_OVERLAY_BOTTOM},
                {name: 'dark oberlay bottom ur', x: 1800, y: 900, color: KILLCAM_DARK_OVERLAY_BOTTOM},
                {name: 'dark global overlay', x: 300, y: 300, color: KILLCAM_DARK_GLBOAL_OVERLAY},
                // Same as "DARK_OVERLAY" constant but without contrast:
                {name: 'dark overlay top border ul', x: 200, y: 126, color: DARK_OVERLAY_TOP_BORDER},
                {name: 'dark overlay top ur', x: 1800, y: 127, color: DARK_OVERLAY_TOP_BORDER},
                {name: 'dark overlay top bg ul', x: 120, y: 115, color: DARK_OVERLAY_TOP_BG},
                {name: 'dark overlay top bg ur', x: 1700, y: 25, color: DARK_OVERLAY_TOP_BG},
            ],
            nextScreens: {
                deadSpectating: .9,
                matchAlive: .9,
                scoreBoard: .7,
            }
        },
        deadSpectating: {
            name: 'deadSpectating',
            must: [
                {name: 'health bar minimum empty', x: 270, y: 966, color: MATCH_HEALTH_BAR_EMPTY},
                ...IN_GAME_ON_FIRE_ICONS,
                ...DARK_OVERLAY_TOP
            ],
            should: [
                {name: 'respawn countdown border', x: 1836, y: 18, color: SPECTATE_RESPAWN_COUNTDOWN_BORDER},
            ],
            nextScreens: {
                matchAlive: 1,
                scoreBoard: .7,
            }
        },
        potgSpectating: {
            name: 'potgSpectating',
            must: [
                ...DARK_OVERLAY_TOP
            ],
            should: [
                ...IN_GAME_RETICLE,
                {name: 'health bar minimum filled', x : 270, y: 966, color: MATCH_HEALTH_BAR_FILLED},
            ],
            might: [
            ],
            nextScreens: {
                undefined: 1,
            }
        },
        scoreBoard: {
            name: 'scoreBoard',
            must: [
                {name: 'top bg ul', x: 160, y: 15, color: SCORE_BOARD_TOP_BOTTOM_BG},
                {name: 'top bg lr', x: 1500, y: 70, color: SCORE_BOARD_TOP_BOTTOM_BG},
                {name: 'bottom bg', x: 960, y: 1050, color: SCORE_BOARD_TOP_BOTTOM_BG},
                {name: 'global overlay ul', x: 300, y: 300, color: SCORE_BOARD_GLOBAL_OVERLAY},
                {name: 'global overlay lr', x: 1600, y: 600, color: SCORE_BOARD_GLOBAL_OVERLAY},
                {name: 'line center l', x: 500, y: 459, color: SCORE_BOARD_LINES},
                {name: 'line center r', x: 1400, y: 460, color: SCORE_BOARD_LINES},
                {name: 'line bottom', x: 963, y: 1010, color: SCORE_BOARD_LINES},
                {name: 'line top', x: 42, y: 50, color: SCORE_BOARD_MODE_LINES},
            ],
            nextScreens: {
                matchAlive: 1,
                matchDead: 1,
                killcam: .7,
                deadSpectating: .7,
                potgSpectating: .5,
            }
        },
        interactionMenu: {
            name: 'interactionMenu',
            must: [
                {name: 'outer circle ul', x: 885, y: 485, color: INTERACTION_MENU_OUTER_CIRCLE},
                {name: 'outer circle lr', x: 1030, y: 600, color: INTERACTION_MENU_OUTER_CIRCLE},
            ],
            should: [
                {name: 'overlay ul', x: 10, y: 10, color: INTERACTION_MENU_OVERLAY},
                {name: 'overlay lr', x: 1910, y: 1070, color: INTERACTION_MENU_OVERLAY},
                {name: 'overlay ur', x: 1500, y: 70, color: INTERACTION_MENU_OVERLAY},
                {name: 'overlay ll', x: 261, y: 966, color: INTERACTION_MENU_OVERLAY},
            ],
            nextScreens: {
                matchAlive: 1,
                matchNoPrimary: .7
            }
        },
        undefined: {
            name: 'undefined',
            // Default screen for not yet defined screens
            // might: [{x: 10, y: 10, color: {r: 0, g: 0, b: 0, a: 0}}],
            nextScreens: {
                // All equal
            }
        }
    };

    private readonly screenNames: ScreenName[];
    private lastScreenName: ScreenName;

    public reliability = new Map<ScreenName, {correct: number, incorrect: number}>();

    public constructor(
        private readonly frameService: FrameService,
        // private readonly frameService: ImageDisplayService,
        private readonly colorUtilsService: ColorUtilsService,
        private readonly colorDifferenceService: ColorDifferenceService,
    ) {
        this.screenNames = Object.keys(this.screens) as ScreenName[];
    }

    public getScreen(): Observable<{frame: HTMLCanvasElement, screen: ScreenName}> {
        return this.frameService.getFrame().pipe(
            map(({frame, expected}) => this.analyzeScreen(frame, expected as ScreenName))
        );
    }

    public analyzeScreen(frame: HTMLCanvasElement, expected?: ScreenName): {frame: HTMLCanvasElement, screen: ScreenName} {
        // Get all screens and their defined probability based on which was the last screen
        const screenBaseProbabilities = this.screenNames.reduce(
            (prev, curr) => ({...prev, [curr]: 0}), {} as Record<ScreenName, number>);
        if (this.lastScreenName) {
            const lastScreen = this.screens[this.lastScreenName];
            for (const nextScreen of Object.entries(lastScreen.nextScreens)) {
                screenBaseProbabilities[nextScreen[0]] = nextScreen[1];
            }
            screenBaseProbabilities[this.lastScreenName] = 1.3;
        }
        // Sort
        const screenCheckOrder = Object.entries(screenBaseProbabilities)
            .map((probabilityEntry) => ({name: probabilityEntry[0] as ScreenName, probability: probabilityEntry[1]}))
            .sort((a, b) => {
                // Randomize order of equal ranked screens
                return b.probability - a.probability || Math.random() - .5;
            })
            .map((screenWithProbability) => screenWithProbability.name);

        // Check the first random n possible screens, as long there's at least one with a high probability
        const screenProbabilities: AnalyzedScreen[] = [];
        for (const screen of screenCheckOrder) {
            if (screen === 'undefined') {
                // "undefined" screens always have the same probability
                screenProbabilities.push({
                    name: 'undefined',
                    probability: {probability: .7, confidence: .5, matchingPoints: []} as ScreenProbability
                });
            } else {
                screenProbabilities.push({
                    name: screen,
                    probability: this.getScreenProbability(frame, this.screens[screen], screen === this.lastScreenName)
                });
            }

            if (
                screenProbabilities.some((screenProbability) => screenProbability.probability.probability >= .8) &&
                Math.random() > .8
            ) {
                break;
            }
        }

        // Get the screen with the highest probability (sort by pixel probability, previous screen probability, confidence)
        const sortedScreens = screenProbabilities.sort((a, b) => {
            return b.probability.probability - a.probability.probability ||
                screenBaseProbabilities[b.name] * b.probability.confidence - screenBaseProbabilities[a.name] * a.probability.confidence;
        });
        const probableScreen = sortedScreens[0];

        this.lastScreenName = probableScreen.name;

        this.log(frame, probableScreen, expected, sortedScreens);

        console.log('Detected screen', this.lastScreenName, sortedScreens);

        return {frame, screen: this.lastScreenName};
    }

    private log(frame: HTMLCanvasElement, actual: AnalyzedScreen, expectedName: ScreenName, sortedScreens: AnalyzedScreen[]): void {
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
                probability: this.getScreenProbability(frame, this.screens[expectedName], false)
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
        screen: Screen,
        isCurrentScreen: boolean
    ): ScreenProbability {
        const points = [
            ...(screen.must || []).map((colorPosition) => ({factor: 1, maxForgivness: 0, colorPosition})),
            ...(screen.should || []).map((colorPosition) => ({factor: 0.7, maxForgivness: 1, colorPosition})),
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
            if (pixelIsColor && curr.colorPosition.contrast) {
                if (this.colorUtilsService.getContrast(frame, curr.colorPosition, curr.colorPosition.contrast) < 0.15) {
                    matchingLowContrastCount++;
                }

            }

            return prev + (pixelIsColor ? curr.factor : 0);
        }, 0);

        const sumMax = points.reduce((prev, curr) => prev + curr.factor, 0);
        const probability = sum / sumMax;

        // Calculate confidence
        // Decrease for forgiven values
        const forgivenValuesFactor = .7 ** (isCurrentScreen ? this.previousForgivenesses.length : 0);
        // Decrease for colors with high transparency
        const transparencyFactor = .8 ** points.filter((point) => point.colorPosition.color.a < .5).length;
        // Decrease for black + white
        const colorFactor = .95 ** points.map((point) => {
            const color = point.colorPosition.color;
            return color.r + color.g + color.b;
        }).filter((color) => color === 0 || color === 255 * 3).length;
        // Decrease for low number of checked points
        const checksFactor = .95 ** (10 - points.length + matchingLowContrastCount);
        // Extra decrease for low contrast
        const lowContrastFactor = .9 ** matchingLowContrastCount;
        const confidence = sumMax * forgivenValuesFactor * transparencyFactor * colorFactor * checksFactor * lowContrastFactor;
        // console.log(`confidence for ${screen.name}:`, `confidence: ${confidence}`, `sumMax: ${sumMax}`, `forgivenValuesFactor: ${forgivenValuesFactor}`,
        // `transparencyFactor: ${transparencyFactor}`, `colorFactor: ${colorFactor}`, `checksFactor: ${checksFactor}`, `matchingLowContrastCount: ${matchingLowContrastCount}`);

        return {probability, confidence, matchingPoints};
    }

    private getScreenPoints(screenName: ScreenName): Array<ScreenPoint & {importance: 'must' | 'should' | 'might'}> {
        const screen = this.screens[screenName];
        return [
            ...(screen.must || []).map((point) => ({...point, importance: 'must' as const})),
            ...(screen.should || []).map((point) => ({...point, importance: 'should' as const})),
            ...(screen.might || []).map((point) => ({...point, importance: 'might' as const})),
        ];
    }
}

type ScreensModel = Record<ScreenName, Screen>;

type ScreenPoint = ColorRGBAPosition & {name: string} & {contrast?: Position};

interface Screen {
    name: ScreenName;
    must?: ScreenPoint[];
    should?: ScreenPoint[];
    might?: ScreenPoint[];
    nextScreens: Partial<Record<ScreenName, number>>;
}

interface AnalyzedScreen {
    name: ScreenName;
    probability: ScreenProbability;
}

interface ScreenProbability {
    probability: number;
    confidence: number;
    matchingPoints: Array<{point: ScreenPoint, forgiven: boolean}>;
}
