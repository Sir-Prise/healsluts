import { Injectable } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ColorUtilsService } from '../utils/color-utils.service';
import { LoopService } from './loop.service';
import { IFrameService } from '../model/frame-service.interface';
import { AppModule } from '../app.module';

@Injectable()
export class FrameService implements IFrameService {
    private videoElement: HTMLVideoElement;
    private frame: HTMLCanvasElement;
    private frameContext: CanvasRenderingContext2D;

    constructor(
        private readonly loopService: LoopService,
        private readonly colorUtilsService: ColorUtilsService,
    ) {
    }

    public setup(videoElement: HTMLVideoElement): void {
        this.videoElement = videoElement;

        // Create canvas for frames to analyze
        this.frame = document.createElement('canvas');
        this.frame.width = videoElement.videoWidth;
        this.frame.height = videoElement.videoHeight;
        this.frameContext = this.frame.getContext('2d');
    }

    public getFrame(): Observable<{frame: HTMLCanvasElement, expected?: never}> {
        return this.loopService.getInterval().pipe(
            map(() => {
                this.colorUtilsService.resetCache();
                this.frameContext.drawImage(this.videoElement, 0, 0);
                return {frame: this.frame};
            })
        );
    }
}
