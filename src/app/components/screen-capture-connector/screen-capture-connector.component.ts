import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Injector } from '@angular/core';
import { IFrameService } from 'src/app/model/frame-service.interface';
import { FrameService } from 'src/app/overwatch/frame.service';

@Component({
    selector: 'app-screen-capture-connector',
    templateUrl: './screen-capture-connector.component.html',
    styleUrls: ['./screen-capture-connector.component.scss']
})
export class ScreenCaptureConnectorComponent implements OnInit {

    constructor(
        private readonly injector: Injector,
    ) {
    }

    @Output()
    public videoReady = new EventEmitter<boolean>();

    @ViewChild('video')
    public videoElement: ElementRef<HTMLVideoElement>;

    public videoStarted = false;
    public displayUnknownResolutionWarning = false;

    public ngOnInit(): void {
    }

    public async onStartVideo(): Promise<void> {
        this.videoElement.nativeElement.onsuspend = this.onStopVideo.bind(this);

        // Get video stream
        try {
            this.videoElement.nativeElement.srcObject = await (navigator.mediaDevices as any).getDisplayMedia({
                video: {
                    frameRate: 10,
                    displaySurface: 'window',
                    cursor: 'never'
                },
                audio: false
            });
        } catch (e) {
            // Screen share modal aborted
            return;
        }

        // Wait for video
        await new Promise((resolve) => {
            this.videoElement.nativeElement.onloadedmetadata = resolve;
        });

        // Check video resolution
        const width = this.videoElement.nativeElement.videoWidth;
        const height = this.videoElement.nativeElement.videoHeight;
        if (Math.round(1000 * width / height) !== Math.round(1000 * 16 / 9)) {
            this.displayUnknownResolutionWarning = true;
        } else {
            this.displayUnknownResolutionWarning = false;
        }

        this.videoReady.emit(true);
        this.videoStarted = true;

        const frameService = this.injector.get<IFrameService>(IFrameService) as FrameService;
        frameService.setup(this.videoElement.nativeElement);
    }

    public onStopVideo(): void {
        for (const track of (this.videoElement.nativeElement.srcObject as any).getTracks()) {
            track.stop();
        }
        this.videoElement.nativeElement.srcObject = null;
        this.videoReady.emit(false);
        this.videoStarted = false;
    }
}
