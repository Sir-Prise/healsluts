import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ColorDifferenceService } from '../color-difference.service';

@Component({
    selector: 'app-is-color-calculator',
    templateUrl: './is-color-calculator.component.html',
    styleUrls: ['./is-color-calculator.component.scss']
})
export class IsColorCalculatorComponent implements OnInit {

    public form: FormGroup;
    public result: string;

    constructor(
        private formBuilder: FormBuilder,
        private readonly colorDifferenceService: ColorDifferenceService,
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

        this.result = this.colorDifferenceService.getColorDifference(visibleColor, compareColor);
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
