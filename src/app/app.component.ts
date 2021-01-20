import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ColorUtilsService } from './utils/color-utils.service';
import { ScreenDetectionService } from './overwatch/screen-detection.service';
import { OnFireDetectionService } from './overwatch/on-fire-detection.service';
import { FrameService } from './overwatch/frame.service';
import { GameService } from './overwatch/game.service';

const FRAME_RATE = 10;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    @ViewChild('video')
    private videoElement: ElementRef<HTMLVideoElement>;



    public constructor(
        private readonly colorUtilsService: ColorUtilsService,
        private readonly frameService: FrameService,
        private readonly screenDetectionService: ScreenDetectionService,
        private readonly onFireDetectionService: OnFireDetectionService,
        private readonly gameService: GameService,
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

        this.frameService.setup(this.videoElement.nativeElement);

        this.gameService.start();
    }

    public onAnalyze(): void {
        // this.frameContext.drawImage(this.videoElement.nativeElement, 0, 0);
        // this.colorUtilsService.resetCache();

        // console.log(this.onFireDetectionService.getOnFireLevel(this.frame));

        // @ts-ignore
        // console.log(this.screenDetectionService.getScreenProbability(this.frame, this.screenDetectionService.screens.matchAlive));
        // this.screenDetectionService.getScreen(this.frame);
        // this.colorUtilsService.pixelIsColor(this.frame, {x: 1910, y: 1070}, {r: 215, g: 0, b: 5, a: 0.7});
    }
}
