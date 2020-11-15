import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
    selector: 'app-alpha-calculator',
    templateUrl: './alpha-calculator.component.html',
    styleUrls: ['./alpha-calculator.component.scss']
})
export class AlphaCalculatorComponent implements OnInit {

    public form;
    public result: string;

    constructor(
        private formBuilder: FormBuilder
    ) {
        this.form = this.formBuilder.group({
            result1: '',
            background1: '',
            result2: '',
            background2: '',
        });
    }

    ngOnInit(): void {
    }

    public onSubmit(formdata): void {
        const result1 = this.hexToRgb(formdata.result1);
        const background1 = this.hexToRgb(formdata.background1);
        const result2 = this.hexToRgb(formdata.result2);
        const background2 = this.hexToRgb(formdata.background2);

        const r = this.calculateColor(result1.r, result2.r, background1.r, background2.r);
        const g = this.calculateColor(result1.g, result2.g, background1.g, background2.g);
        const b = this.calculateColor(result1.b, result2.b, background1.b, background2.b);

        const alpha = Math.round(((r.alpha + g.alpha + b.alpha) / 3) * 100) / 100;

        const output = `{r: ${Math.round(r.foreground)}, g: ${Math.round(g.foreground)}, b: ${Math.round(b.foreground)}, a: ${alpha}}`;
        this.result = output;
        navigator.clipboard.writeText(output);
    }

    private calculateColor(
        result1: number,
        result2: number,
        background1: number,
        background2: number
    ): {foreground: number, alpha: number} {
        const alpha = (result2 - result1 + background1 - background2) / (background1 - background2);
        const foreground = (result1 - background1 * (1 - alpha)) / alpha;
        return {foreground, alpha};
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
