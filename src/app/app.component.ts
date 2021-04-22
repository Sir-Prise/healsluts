import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ColorUtilsService } from './utils/color-utils.service';
import { ScreenDetectionService } from './overwatch/screen-detection.service';
import { OnFireDetectionService } from './overwatch/on-fire-detection.service';
import { FrameService } from './overwatch/frame.service';
import { GameService } from './overwatch/game.service';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ImageDisplayService } from './tools/image-display.service';

const FRAME_RATE = 10;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    @ViewChild('expectedScreen')
    private expectedScreenElement: ElementRef<HTMLInputElement>;

    @ViewChild('video')
    private videoElement: ElementRef<HTMLVideoElement>;

    @ViewChild('videoTest')
    public videoTestElement: ElementRef<HTMLVideoElement>;

    public constructor(
        private readonly colorUtilsService: ColorUtilsService,
        private readonly frameService: FrameService,
        private readonly screenDetectionService: ScreenDetectionService,
        private readonly onFireDetectionService: OnFireDetectionService,
        public readonly gameService: GameService,
        public readonly imageDisplayService: ImageDisplayService,
    ) {
    }

    public ngOnInit(): void {
    }

    public async onStartVideo(): Promise<void> {
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
    }

    public onStartAnalyze(): void {
        this.gameService.start();
    }

    public onAnalyzeFrame(): void {
        const frame = document.createElement('canvas');
        frame.width = this.videoElement.nativeElement.videoWidth;
        frame.height = this.videoElement.nativeElement.videoHeight;
        const frameContext = frame.getContext('2d');

        frameContext.drawImage(this.videoElement.nativeElement, 0, 0);

        this.colorUtilsService.resetCache();
        const result = this.screenDetectionService.analyzeScreen(frame, this.expectedScreenElement.nativeElement.value as any);
        // console.log('analysis result', result);
    }

    public onChangeTestVideo(files: FileList): void {
        this.imageDisplayService.onChangeTestVideo(this.videoTestElement.nativeElement, files);
        const reliablilty = this.screenDetectionService.reliability;
        this.screenDetectionService.getScreen().subscribe({
            complete(): void {
                console.log('FINISHED ANALYZING', reliablilty);
                reliablilty.forEach((results, screen) => {
                    const count = results.correct + results.incorrect;
                    console.log(screen, `${Math.round(100 * results.correct / count)}% correct`, `${count} expected times`);
                });
            }
        });
    }

    public onChangeTestVideoDescription(files: FileList): void {
        const reader = new FileReader();
        reader.onload = () => {
            this.imageDisplayService.setDescription(reader.result.toString());
        };
        reader.readAsText(files[0]);
    }
}
