import { Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { ColorUtilsService } from './utils/color-utils.service';
import { ScreenDetectionService } from './overwatch/screen-detection.service';
import { FrameService } from './overwatch/frame.service';
import { GameService } from './overwatch/game.service';
import { ImageDisplayService } from './tools/image-display.service';
import { IFrameService } from './model/frame-service.interface';
import { SetupService } from './overwatch/setup.service';
import { Observable } from 'rxjs';
import { LoopService } from './overwatch/loop.service';
import { LoopManualService } from './overwatch/loop-manual.service';

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

    public gameServiceResponse: Observable<any>;

    private testVideoDescription?: string;

    public constructor(
        private readonly injector: Injector,
        private readonly setupService: SetupService,
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

        const frameService = this.injector.get<IFrameService>(IFrameService) as FrameService;
        frameService.setup(this.videoElement.nativeElement);
    }

    public async onStartManualMode(): Promise<void> {
        this.setupService.useManualLoop = true;

        await this.onStartVideo();

        const gameService = this.injector.get<GameService>(GameService) as GameService;
        this.gameServiceResponse = gameService.start();
    }

    public onStartAnalyze(): void {
        const gameService = this.injector.get<GameService>(GameService) as GameService;
        this.gameServiceResponse = gameService.start();
    }

    public onAnalyzeFrame(): void {
        const loopManualService = this.injector.get<LoopService>(LoopService) as unknown as LoopManualService;
        loopManualService.tick();
    }

    public onChangeTestVideoDescription(files: FileList): void {
        const reader = new FileReader();
        reader.onload = () => {
            this.testVideoDescription = reader.result.toString();
        };
        reader.readAsText(files[0]);
    }

    public onChangeTestVideo(files: FileList): void {
        this.setupService.useImageDisplayService = true;
        const imageDisplayService = this.injector.get<IFrameService>(IFrameService) as ImageDisplayService;
        imageDisplayService.setDescription(this.testVideoDescription);
        imageDisplayService.onChangeTestVideo(this.videoTestElement.nativeElement, files);
        this.setupService.useImageDisplayService = true;
        const screenDetectionService = this.injector.get<ScreenDetectionService>(ScreenDetectionService) as ScreenDetectionService;
        screenDetectionService.getScreen().subscribe({
            complete(): void {
                screenDetectionService.log();
            }
        });
    }
}
