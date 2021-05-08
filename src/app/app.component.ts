import { Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { ColorUtilsService } from './utils/color-utils.service';
import { ScreenDetectionService } from './overwatch/screen-detection.service';
import { FrameService } from './overwatch/frame.service';
import { GameService } from './overwatch/game.service';
import { ImageDisplayService } from './tools/image-display.service';
import { IFrameService } from './model/frame-service.interface';
import { SetupService } from './overwatch/setup.service';
import { Observable } from 'rxjs';

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
        private readonly colorUtilsService: ColorUtilsService,
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

    public onStartAnalyze(): void {
        const gameService = this.injector.get<GameService>(GameService) as GameService;
        this.gameServiceResponse = gameService.start();
    }

    public onAnalyzeFrame(): void {
        const frame = document.createElement('canvas');
        frame.width = this.videoElement.nativeElement.videoWidth;
        frame.height = this.videoElement.nativeElement.videoHeight;
        const frameContext = frame.getContext('2d');

        frameContext.drawImage(this.videoElement.nativeElement, 0, 0);

        this.colorUtilsService.resetCache();

        const screenDetectionService = this.injector.get<ScreenDetectionService>(ScreenDetectionService) as ScreenDetectionService;
        const result = screenDetectionService.analyzeScreen(frame, this.expectedScreenElement.nativeElement.value as any);
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
        const reliablilty = screenDetectionService.reliability;
        screenDetectionService.getScreen().subscribe({
            complete(): void {
                console.log('FINISHED ANALYZING', reliablilty);
                reliablilty.forEach((results, screen) => {
                    const count = results.correct + results.incorrect;
                    console.log(screen, `${Math.round(100 * results.correct / count)}% correct`, `${count} expected times`);
                });
            }
        });
    }
}
