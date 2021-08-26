import { Injectable } from '@angular/core';
import { ColorPosition } from '../model/color-position.model';
import { ColorRGBA } from '../model/color-rgba.model';
import { Color } from '../model/color.model';
import { Position } from '../model/position.model';
import { PositionUtils } from './position-utils';

const MAX_CONTRAST = 255 * 3;

@Injectable({
    providedIn: 'root'
})
export class ColorUtilsService {
    /**
     * Canvas Context for pixels to be analyzed.
     */
    private pixelContext: CanvasRenderingContext2D;

    private pixelColorCache: ColorPosition[] = [];

    constructor() {
        // Create canvas once as it's much faster when not created every time.
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        this.pixelContext = canvas.getContext('2d');
    }

    public getPixelColorAbsolute(frame: HTMLCanvasElement, position: Position): Color {
        // Check if already analyzed
        const cachedValue = this.pixelColorCache.find((colorPosition) => colorPosition.x === position.x && colorPosition.y === position.y);
        if (cachedValue) {
            return cachedValue.color;
        }

        this.pixelContext.drawImage(frame, position.x, position.y, 1, 1, 0, 0, 1, 1);
        const colorRaw = this.pixelContext.getImageData(0, 0, 1, 1).data;
        const color = {
            r: colorRaw[0],
            g: colorRaw[1],
            b: colorRaw[2]
        };

        this.pixelColorCache.push({...position, color});

        return color;
    }

    /**
     * Checks if it's possible that a pixel might have a specific color (with transparency).
     * @param visibleColor The color of the pixel
     * @param compareColor The color you want to know if the pixel has it
     */
    private isColor(visibleColor: Color, compareColor: ColorRGBA): boolean {
        // Decrease alpha channel to add tolerance
        const alpha = compareColor.a - 0.1;
        // Also set an absolute tolerance as relative tolerance is useless at low values
        const tolerance = 10;

        // Basically checks if it would possible to get the color on a white background and on a black background (but for each channel)
        return (
            visibleColor.r + tolerance >= compareColor.r * alpha &&
            visibleColor.r - tolerance <= compareColor.r * alpha + 255 * (1 - alpha) &&
            visibleColor.g + tolerance >= compareColor.g * alpha &&
            visibleColor.g - tolerance <= compareColor.g * alpha + 255 * (1 - alpha) &&
            visibleColor.b + tolerance >= compareColor.b * alpha &&
            visibleColor.b - tolerance <= compareColor.b * alpha + 255 * (1 - alpha)
        );
    }

    public pixelIsColorRelative(frame: HTMLCanvasElement, position: Position, color: ColorRGBA): boolean {
        return this.pixelIsColorAbsolute(frame, PositionUtils.scale(position, frame.width, frame.height), color);
    }

    public pixelIsColorAbsolute(frame: HTMLCanvasElement, position: Position, color: ColorRGBA): boolean {
        // const pxColor = this.getPixelColor(frame, position);
        // console.log(
        //     'isColor',
        //     this.isColor(pxColor, color),
        //     pxColor,
        //     color
        // );

        return this.isColor(this.getPixelColorAbsolute(frame, position), color);
    }

    /**
     * Gets the difference between to colors.
     *
     * @returns A value between 0 (no difference) and 1 (black + white)
     */
    public getContrastAbsolute(frame: HTMLCanvasElement, positionA: Position, positionB: Position): number {
        const aColor = this.getPixelColorAbsolute(frame, positionA);
        const bColor = this.getPixelColorAbsolute(frame, positionB);
        const diff = Math.abs(aColor.r - bColor.r) + Math.abs(aColor.g - bColor.g) + Math.abs(aColor.b - bColor.b);
        return diff / MAX_CONTRAST;
    }

    public resetCache(): void {
        this.pixelColorCache = [];
    }
}
