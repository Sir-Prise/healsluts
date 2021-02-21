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

    @ViewChild('video')
    private videoElement: ElementRef<HTMLVideoElement>;

    @ViewChild('videoTest')
    public videoTestElement: ElementRef<HTMLVideoElement>;

    @ViewChild('videoDescribe')
    public videoDescribeElement: ElementRef<HTMLVideoElement>;
    @ViewChild('videoDescription')
    public videoDescriptionElement: ElementRef<HTMLTextAreaElement>;

    public constructor(
        private readonly colorUtilsService: ColorUtilsService,
        private readonly frameService: FrameService,
        private readonly screenDetectionService: ScreenDetectionService,
        private readonly onFireDetectionService: OnFireDetectionService,
        private readonly gameService: GameService,
        public readonly imageDisplayService: ImageDisplayService,
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

    public onChangeDescribeVideo(files: FileList): void {
        this.videoDescribeElement.nativeElement.src = URL.createObjectURL(files[0]);
    }

    public onDescribeVideoMove(milliseconds: number): void {
        this.videoDescribeElement.nativeElement.currentTime += milliseconds / 1000;
    }

    public onDescribeVideoSpeed(speed: number): void {
        this.videoDescribeElement.nativeElement.playbackRate = speed;
    }

    public onDescribeVideoMark(): void {
        this.videoDescriptionElement.nativeElement.value += `\n${this.videoDescribeElement.nativeElement.currentTime}\t`;
        this.videoDescriptionElement.nativeElement.focus();
    }
}
