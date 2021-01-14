import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
    selector: 'app-is-color-calculator',
    templateUrl: './is-color-calculator.component.html',
    styleUrls: ['./is-color-calculator.component.scss']
})
export class IsColorCalculatorComponent implements OnInit {

    public form;
    public result: string;

    constructor(
        private formBuilder: FormBuilder
    ) {
        this.form = this.formBuilder.group({
            test: '',
            r: '',
            g: '',
            b: '',
            a: ''
        });
    }
    ngOnInit(): void {
    }

    public onSubmit(formdata): void {
        // for details see ColorUtils.isColor
        const visibleColor = this.hexToRgb(formdata.test);
        const {r, g, b, a} = formdata;
        const compareColor = {r, g, b, a: a.replace(',', '.')};

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

        this.result = isColor ? 'is color!' : 'is NOT color!';

        if (!(
            visibleColor.r + tolerance >= compareColor.r * alpha &&
            visibleColor.r - tolerance <= compareColor.r * alpha + 255 * (1 - alpha)
        )) {
            this.result += ` RED wrong (${compareColor.r * alpha} < ${visibleColor.r}±${tolerance} < ${compareColor.r * alpha + 255 * (1 - alpha)})`;
        }
        if (!(
            visibleColor.g + tolerance >= compareColor.g * alpha &&
            visibleColor.g - tolerance <= compareColor.g * alpha + 255 * (1 - alpha)
        )) {
            this.result += ` GREEN wrong (${compareColor.g * alpha} < ${visibleColor.g}±${tolerance} < ${compareColor.g * alpha + 255 * (1 - alpha)})`;
        }
        if (!(
            visibleColor.b + tolerance >= compareColor.b * alpha &&
            visibleColor.b - tolerance <= compareColor.b * alpha + 255 * (1 - alpha)
        )) {
            this.result += ` BLUE wrong (${compareColor.b * alpha} < ${visibleColor.b}±${tolerance} < ${compareColor.b * alpha + 255 * (1 - alpha)})`;
        }
    }

    private hexToRgb(hex: string): {r: number, g: number, b: number} {
        // tslint:disable:no-bitwise
        const bigint = parseInt(hex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;

        return {r, g, b};
    }
}
