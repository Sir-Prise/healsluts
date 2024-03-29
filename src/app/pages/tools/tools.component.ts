import { Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { IFrameService } from 'src/app/model/frame-service.interface';
import { FrameService } from 'src/app/overwatch/frame.service';
import { GameService } from 'src/app/overwatch/game.service';
import { LoopManualService } from 'src/app/overwatch/loop-manual.service';
import { LoopService } from 'src/app/overwatch/loop.service';
import { ScreenDetectionService } from 'src/app/overwatch/screen-detection.service';
import { SetupService } from 'src/app/overwatch/setup.service';
import { ImageDisplayService } from 'src/app/tools/image-display.service';

const FRAME_RATE = 10;

@Component({
    selector: 'app-tools',
    templateUrl: './tools.component.html',
    styleUrls: ['./tools.component.scss']
})
export class ToolsComponent implements OnInit {

    @ViewChild('expectedScreen')
    private expectedScreenElement: ElementRef<HTMLInputElement>;

    @ViewChild('video')
    public videoElement: ElementRef<HTMLVideoElement>;

    @ViewChild('videoFileInput')
    public videoFileInputElement: ElementRef<HTMLInputElement>;

    @ViewChild('videoTest')
    public videoTestElement: ElementRef<HTMLVideoElement>;

    public gameServiceResponse: Observable<any>;

    private testVideoDescription?: string;

    private frameByFrameInitialized = false;

    public constructor(
        private readonly injector: Injector,
        private readonly setupService: SetupService,
    ) {
    }

    public ngOnInit(): void {
    }

    public async startSourceScreen(): Promise<void> {
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
    }

    public clickVideoInput(): void {
        this.videoFileInputElement.nativeElement.click();
    }

    public changeVideoInput(event: Event): void {
        const files = (event.target as HTMLInputElement).files;
        this.videoElement.nativeElement.src = URL.createObjectURL(files[0]);
    }

    public startAnalyzeNormal(): void {
        this.initFrameService();
        this.initGameService();
    }

    public startAnalyzeFrame(): void {
        if (!this.frameByFrameInitialized) {
            this.setupService.useManualLoop = true;
            this.initFrameService();
            this.initGameService();
            this.frameByFrameInitialized = true;
        }
        const loopManualService = this.injector.get<LoopService>(LoopService) as unknown as LoopManualService;
        loopManualService.tick();
    }

    private initFrameService(): void {
        const frameService = this.injector.get<IFrameService>(IFrameService) as FrameService;
        frameService.setup(this.videoElement.nativeElement);
    }

    private initGameService(): void {
        const gameService = this.injector.get<GameService>(GameService) as GameService;
        this.gameServiceResponse = gameService.start().pipe(share());
    }

    public changeExpectedScreen(event: Event): void {
        this.setupService.expectedScreen = (event.target as HTMLInputElement).value || undefined;
    }


    ////////////

    public onChangeTestVideoDescription(event: Event): void {
        const files = (event.target as HTMLInputElement).files;
        const reader = new FileReader();
        reader.onload = () => {
            this.testVideoDescription = reader.result.toString();
        };
        reader.readAsText(files[0]);
    }

    public onChangeTestVideo(event: Event): void {
        const files = (event.target as HTMLInputElement).files;
        this.setupService.useImageDisplayService = true;
        const imageDisplayService = this.injector.get<IFrameService>(IFrameService) as unknown as ImageDisplayService;
        imageDisplayService.setDescription(this.testVideoDescription);
        imageDisplayService.onChangeTestVideo(this.videoTestElement.nativeElement, files);
        this.setupService.useImageDisplayService = true;
        const screenDetectionService = this.injector.get<ScreenDetectionService>(ScreenDetectionService) as ScreenDetectionService;
        screenDetectionService.getScreen().subscribe({
            next(args): void {
                console.log(args);
            },
            complete(): void {
                screenDetectionService.log();
            }
        });
    }
}
