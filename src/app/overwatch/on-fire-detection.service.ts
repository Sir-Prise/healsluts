import { Injectable } from '@angular/core';
import { Observable, OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';
import { Position } from '../model/position.model';
import { ColorUtilsService } from '../utils/color-utils.service';
import { OverwatchScreenName } from './screen-names';

// Colors
const ON_FIRE_BAR_BLUE = {r: 120, g: 470, b: 470, a: 0.6}; // G and B actually out of range, but high alpha
const ON_FIRE_BAR_WHITE = {r: 255, g: 255, b: 255, a: 0.99};
const ON_FIRE_BAR_GLOW = {r: 30, g: 59, b: 255, a: 0.3}; // color 6px below end of bar

@Injectable({
    providedIn: 'root'
})
export class OnFireDetectionService {
    private previousValues: Array<Value> = [{value: 0, confidence: .5}];

    public constructor(
        private readonly colorUtilsService: ColorUtilsService,
    ) {
    }

    public addOnFireLevel
        <T extends {frame: HTMLCanvasElement, screen: OverwatchScreenName}>(
    ): OperatorFunction<T, T & {onFireValue: number}> {
        return (source: Observable<T>) => source.pipe(
            map((input) => {
                const frame = input.frame;
                const screen = input.screen;
                if (screen === 'matchAlive') {
                    const newLevel = this.getCurrentLevel(frame);

                    if (newLevel) {
                        this.pushValue(newLevel);
                    }
                }

                return {...input, onFireValue: this.getAverageValue()};
            })
        );
    }

    public reset(): void {
        this.previousValues = [{value: 0, confidence: .5}];
    }

    private getCurrentLevel(frame: HTMLCanvasElement): Value | undefined {
        try {
            // Check that on fire icons are visible (because they aren't when overlay is shaking)
            if (
                !this.colorUtilsService.pixelIsColor(frame, {x: 257, y: 997}, {r: 255, g: 255, b: 255, a: 0.85}) ||
                !this.colorUtilsService.pixelIsColor(frame, {x: 432, y: 996}, {r: 255, g: 255, b: 255, a: 0.79})
            ) {
                throw new InvalidDetectionError('Icons not found');
            }

            const barColors = this.getRangeColor(frame);
            const glowColors = this.getRangeColor(frame, true);

            // Find position of the glow effect below the bar
            const countGlowing = glowColors.filter((isGlowing) => isGlowing).length;
            const glowPostion = countGlowing <= 2 && countGlowing ? glowColors.findIndex((isGlowing) => isGlowing) : undefined;

            let value: number;
            let confidence = 1;

            if (barColors[0] === 'blue') {
                // Handle blue bar (=> value < 100%)
                const countBlue = barColors.filter((color) => color === 'blue').length;
                value = this.indexToValue(countBlue - 1);
                // Check for "wrong blue"
                if (barColors.slice(countBlue).some((color) => color === 'blue')) {
                    confidence -= .4;
                }
                // Check for glowing
                if (!glowColors[countBlue - 1]) {
                    confidence -= .1;
                }
                // Check for "too blue"
                if (countBlue > 11) {
                    if (glowPostion) {
                        value = this.indexToValue(glowPostion);
                        confidence = .4;
                    } else {
                        throw new InvalidDetectionError('too blue');
                    }
                }

            } else if (barColors[0] === 'white') {
                // Handle white bar (=> value > 100%)
                value = 1;
                // Check that all positions are white
                if (barColors.slice(0, 11).some((color) => color !== 'white')) {
                    throw new InvalidDetectionError('white but not all');
                }
                // Check glow position
                if (!glowPostion || glowPostion < 10) {
                    confidence -= .5;
                }
                // Check if background is not white aswell
                if (this.isBackgroundWhite(frame)) {
                    throw new InvalidDetectionError('background is white');
                }

            } else {
                // Bar neither blue nor white, probably empty
                value = 0;
                confidence = .8;
            }

            // Check that new value is feasible when looking at the past values
            const oldValue = this.getAverageValue();
            if (value > oldValue + .3 || value < oldValue - .1) {
                confidence *= .5;
            }

            return {value, confidence};

        } catch (e) {
            // When the detection wasn't possible, no new entry is added to the previousValues array.
            if (!(e instanceof InvalidDetectionError)) {
                throw e;
            } else {
                // console.warn(`OnFireDetection failed: ${e.message}`);
            }

            return undefined;
        }
    }

    private getRangeColor(
        frame: HTMLCanvasElement,
        checkGlow = false
    ): Array<'blue' | 'white' | undefined | boolean> {
        const output: Array<'blue' | 'white' | undefined | boolean> = [];
        for (let value = 0; value <= 1.3; value += 0.1) {
            // Make it easier to loop through values (1.29 is maximum)
            const checkPosition = value < 1.3 ? value : 1.29;
            output.push(checkGlow ? this.getValueGlow(frame, checkPosition) : this.getValueColor(frame, checkPosition));
        }
        return output;
    }

    /**
     * Checks if background is white too so bar has no confidence
     */
    private isBackgroundWhite(frame: HTMLCanvasElement): boolean {
        let countWhite = 0;
        for (let value = 0; value <= 1.3; value += 0.1) {
            const checkPosition = value < 1.3 ? value : 1.29;
            if (this.getValueColor(frame, checkPosition) === 'white') {
                countWhite++;
                if (countWhite >= 8) {
                    return true;
                }
            }
        }
        return false;
    }

    private indexToValue(index: number): number {
        return Math.min(index / 10, 1);
    }

    private getValueColor(frame: HTMLCanvasElement, value: number): 'blue' | 'white' | undefined {
        const position = this.getPosition(value);
        const isBlue = this.colorUtilsService.pixelIsColor(frame, position, ON_FIRE_BAR_BLUE);
        const isWhite = this.colorUtilsService.pixelIsColor(frame, position, ON_FIRE_BAR_WHITE);

        if (isBlue && isWhite) {
            throw new InvalidDetectionError('Bar is blue AND white');
        } else if (!isBlue && !isWhite) {
            return undefined;
        }
        return isBlue ? 'blue' : 'white';
    }

    /**
     * Checks if the bar at the given value is glowing (or has a background in the same color)
     */
    private getValueGlow(frame: HTMLCanvasElement, value: number): boolean {
        const barPosition = this.getPosition(value);
        const glowPosition = {x: barPosition.x, y: barPosition.y + 6};
        return this.colorUtilsService.pixelIsColor(frame, glowPosition, ON_FIRE_BAR_GLOW);
    }

    /**
     * Gets the pixel position for a relative "on fire meter" value.
     * @param value Maximum is 1.29 as the bar is longer than 100%.
     */
    private getPosition(value: number): Position {
        const start = {x: 282, y: 993};
        const end = {x: 443, y: 983};
        return {
            x: Math.round(start.x + value * (end.x - start.x)),
            y: Math.round(start.y + value * (end.y - start.y))
        };
    }

    private pushValue(value: Value): void {
        this.previousValues.push(value);
        while (this.previousValues.length > 7) {
            this.previousValues.shift();
        }
    }

    /**
     * Returns the average on-fire-meter value from the last detections.
     *
     * Respects the confidence level and currentness.
     */
    private getAverageValue(): number {
        if (!this.previousValues.length) {
            return 0;
        }
        let factorSum = 0;
        const average = this.previousValues
            .map((value, index) => ({...value, index}))
            .reduce((prev, curr) => {
                // The newer the value, the higher its impact
                const indexFactor = curr.index + 1;
                const factor = curr.confidence * indexFactor;
                factorSum += factor;
                return prev + curr.value * factor;
            }, 0) / this.previousValues.length;
        const factorAvg = factorSum / this.previousValues.length;
        return average / factorAvg;
    }
}

class InvalidDetectionError extends Error {
}

interface Value {
    value: number;
    confidence: number;
}
