import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ColorUtilsService } from 'src/app/utils/color-utils.service';

@Component({
    selector: 'app-color-extract',
    templateUrl: './color-extract.component.html',
    styleUrls: ['./color-extract.component.scss']
})
export class ColorExtractComponent implements OnInit {

    @Input()
    public video: HTMLVideoElement;

    public form = new FormGroup({
        positions: new FormControl('')
    });

    @ViewChild('colorsOutput')
    public colorsOutputElement: ElementRef<HTMLTextAreaElement>;

    private frame: HTMLCanvasElement;
    private frameContext: CanvasRenderingContext2D;

    constructor(
        private readonly colorUtilsService: ColorUtilsService,
    ) {}

    ngOnInit(): void {
    }

    public onSubmit(): void {
        this.frame = document.createElement('canvas');
        this.frame.width = this.video.videoWidth;
        this.frame.height = this.video.videoHeight;
        this.frameContext = this.frame.getContext('2d');

        // Get positions
        const positions = (this.form.get('positions').value as string).split(',').map((text) => {
            const splitText = text.trim().split(' ');
            return {
                x: +splitText[0],
                y: +splitText[1]
            };
        });

        this.frameContext.drawImage(this.video, 0, 0);

        this.colorUtilsService.resetCache();
        for (const position of positions) {
            const color = this.colorUtilsService.getPixelColorAbsolute(this.frame, position);
            this.colorsOutputElement.nativeElement.value += `\n${color.r}\t${color.g}\t${color.b}`;
        }
    }
}
