import { Injectable } from '@angular/core';
import { ColorRGBA } from '../model/color-rgba.model';
import { Color } from '../model/color.model';

@Injectable({
    providedIn: 'root'
})
export class ColorDifferenceService {

    constructor() { }

    public getColorDifference(visibleColor: Color, compareColor: ColorRGBA): string {
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

        let result = isColor ? 'is color!' : 'is NOT color!';

        if (!(
            visibleColor.r + tolerance >= compareColor.r * alpha &&
            visibleColor.r - tolerance <= compareColor.r * alpha + 255 * (1 - alpha)
        )) {
            result += ` RED wrong (${compareColor.r * alpha} < ${visibleColor.r}±${tolerance} < ${compareColor.r * alpha + 255 * (1 - alpha)})`;
        }
        if (!(
            visibleColor.g + tolerance >= compareColor.g * alpha &&
            visibleColor.g - tolerance <= compareColor.g * alpha + 255 * (1 - alpha)
        )) {
            result += ` GREEN wrong (${compareColor.g * alpha} < ${visibleColor.g}±${tolerance} < ${compareColor.g * alpha + 255 * (1 - alpha)})`;
        }
        if (!(
            visibleColor.b + tolerance >= compareColor.b * alpha &&
            visibleColor.b - tolerance <= compareColor.b * alpha + 255 * (1 - alpha)
        )) {
            result += ` BLUE wrong (${compareColor.b * alpha} < ${visibleColor.b}±${tolerance} < ${compareColor.b * alpha + 255 * (1 - alpha)})`;
        }

        return result;
    }
}
