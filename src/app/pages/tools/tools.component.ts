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
        this.gameServiceResponse = gameService.start().pipe(share());
    }

    public onStartAnalyze(): void {
        const gameService = this.injector.get<GameService>(GameService) as GameService;
        this.gameServiceResponse = gameService.start().pipe(share());
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
