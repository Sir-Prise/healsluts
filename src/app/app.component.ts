import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ColorUtilsService } from './utils/color-utils.service';
import { ScreenDetectionService } from './overwatch/screen-detection.service';

const FRAME_RATE = 10;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    @ViewChild('video')
    private videoElement: ElementRef<HTMLVideoElement>;

    private frame: HTMLCanvasElement;
    private frameContext: CanvasRenderingContext2D;

    public constructor(
        private readonly colorUtilsService: ColorUtilsService,
        private readonly screenDetectionService: ScreenDetectionService,
    ) {
    }

    public ngOnInit(): void {
    }


    public async onStart(): Promise<void> {
        // Get video stream
        this.videoElement.nativeElement.srcObject = await (navigator.mediaDevices as any).getDisplayMedia({
            video: {
                frameRate: FRAME_RATE,
                displaySurface: 'window',
                cursor: 'never'
            },
            audio: false
        });

        // Wait for video
        await new Promise((resolve) => {
            this.videoElement.nativeElement.onloadedmetadata = resolve;
        });

        // Create canvas for frames to analyze
        this.frame = document.createElement('canvas');
        this.frame.width = this.videoElement.nativeElement.videoWidth;
        this.frame.height = this.videoElement.nativeElement.videoHeight;
        this.frameContext = this.frame.getContext('2d');

        // // Analyze video
        setInterval(() => {
            const start = Date.now();

            this.frameContext.drawImage(this.videoElement.nativeElement, 0, 0);
            
            this.screenDetectionService.getScreen(this.frame);

            // this.colorUtilsService.resetCache();
            // // // @ts-ignore
            // // console.log(this.screenDetectionService.getScreenProbability(this.frame, this.screenDetectionService.screens['matchAlive']));
            // this.colorUtilsService.pixelIsColor(this.frame, {x: 957, y: 539}, {r: 255, g: 255, b: 255, a: 0.79});
            // this.colorUtilsService.pixelIsColor(this.frame, {x: 962, y: 537}, {r: 0, g: 0, b: 0, a: 0.34});


            console.log('took', Date.now() - start);
        }, 1000);
    }

    public onAnalyze(): void {
        this.frameContext.drawImage(this.videoElement.nativeElement, 0, 0);
        this.colorUtilsService.resetCache();
        // @ts-ignore
        console.log(this.screenDetectionService.getScreenProbability(this.frame, this.screenDetectionService.screens.matchAlive));
        // this.screenDetectionService.getScreen(this.frame);
        // this.colorUtilsService.resetCache();
        // this.colorUtilsService.pixelIsColor(this.frame, {x: 1910, y: 1070}, {r: 215, g: 0, b: 5, a: 0.7});
    }
}
