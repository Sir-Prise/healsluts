import { Injectable } from '@angular/core';
import { ColorRGBA } from '../model/color-rgba.model';
import { Color } from '../model/color.model';

@Injectable({
    providedIn: 'root'
})
export class ColorDifferenceService {

    constructor() { }

    public getColorDifference(visibleColor: Color, compareColor: ColorRGBA): string[] {
        const alpha = compareColor.a - 0.1;
        const tolerance = 10;

        const isColor = (
            visibleColor.r + tolerance >= compareColor.r * alpha &&
            visibleColor.r - tolerance <= compareColor.r * alpha + 255 * (1 - alpha) &&
            visibleColor.g + tolerance >= compareColor.g * alpha &&
            visibleColor.g - tolerance <= compareColor.g * alpha + 255 * (1 - alpha) &&
            visibleColor.b + tolerance >= compareColor.b * alpha &&
            visibleColor.b - tolerance <= compareColor.b * alpha + 255 * (1 - alpha)
        );

        const texts: string[] = [];
        const styles: string[] = [];

        const blockCss = 'background: linear-gradient(145deg, #fff, #000); font-size:3em; padding:.1em; line-height:.7em;';
        texts.push(`(${compareColor.r}, ${compareColor.g}, ${compareColor.b}, ${compareColor.a}) %c■%c`);
        styles.push(`color: rgba(${compareColor.r}, ${compareColor.g}, ${compareColor.b}, ${compareColor.a}); ${blockCss}`);
        styles.push('');
        texts.push(`${isColor ? 'is' : 'is NOT'}`);
        texts.push(`(${visibleColor.r}, ${visibleColor.g}, ${visibleColor.b}) %c■%c`);
        styles.push(`color: rgb(${visibleColor.r}, ${visibleColor.g}, ${visibleColor.b}); ${blockCss}`);
        styles.push('');

        if (!(
            visibleColor.r + tolerance >= compareColor.r * alpha &&
            visibleColor.r - tolerance <= compareColor.r * alpha + 255 * (1 - alpha)
        )) {
            texts.push('%cRED');
            styles.push('color: #f00');
            texts.push(`%cwrong (${Math.round(compareColor.r * alpha)} < ${Math.round(visibleColor.r)}±${tolerance} < ${Math.round(compareColor.r * alpha + 255 * (1 - alpha))})`);
            styles.push('');
        }
        if (!(
            visibleColor.g + tolerance >= compareColor.g * alpha &&
            visibleColor.g - tolerance <= compareColor.g * alpha + 255 * (1 - alpha)
        )) {
            texts.push('%cGREEN');
            styles.push('color: #0f0');
            texts.push(`%cwrong (${Math.round(compareColor.g * alpha)} < ${Math.round(visibleColor.g)}±${tolerance} < ${Math.round(compareColor.g * alpha + 255 * (1 - alpha))})`);
            styles.push('');
        }
        if (!(
            visibleColor.b + tolerance >= compareColor.b * alpha &&
            visibleColor.b - tolerance <= compareColor.b * alpha + 255 * (1 - alpha)
        )) {
            texts.push('%cBLUE');
            styles.push('color: #00f');
            texts.push(`%cwrong (${Math.round(compareColor.b * alpha)} < ${Math.round(visibleColor.b)}±${tolerance} < ${Math.round(compareColor.b * alpha + 255 * (1 - alpha))})`);
            styles.push('');
        }

        return [texts.join(' '), ...styles];
    }
}
