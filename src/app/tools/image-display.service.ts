import { Injectable } from '@angular/core';
import { interval, Observable, Subject } from 'rxjs';
import { filter, map, takeUntil, throttleTime } from 'rxjs/operators';
import { IFrameService } from '../model/frame-service.interface';
import { ColorUtilsService } from '../utils/color-utils.service';

@Injectable({
    providedIn: 'root'
})
export class ImageDisplayService implements IFrameService {

    private frames$: Observable<{frame: HTMLCanvasElement, expected: string}>;

    /**
     * List of screens visible in video, in reversed order
     */
    private description: Array<{time: number, screen: string}>;

    constructor(
        private readonly colorUtilsService: ColorUtilsService
    ) {
    }

    public setDescription(description: string): void {
        this.description = description.split('\n').map((line) => {
            const lineSplit = line.split('\t');
            return {time: +lineSplit[0], screen: lineSplit[1].trim()};
        }).reverse();
    }

    public onChangeTestVideo(videoElement: HTMLVideoElement, files: FileList): void {
        videoElement.src = URL.createObjectURL(files[0]);

        let isRunning = false;
        const ended$ = new Subject<void>();

        videoElement.addEventListener('loadedmetadata', () => {
            videoElement.playbackRate = 1;
            isRunning = true;
        });
        videoElement.addEventListener('ended', () => {
            ended$.next();
            isRunning = false;
        });

        let lastTime = 0;
        const intervals: number[] = [];

        this.frames$ = interval(200).pipe(
            takeUntil(ended$),
            filter(() => isRunning),
            map(() => {
                const currentTime = videoElement.currentTime;
                intervals.push(currentTime - lastTime);
                lastTime = currentTime;

                const frame = document.createElement('canvas');
                frame.width = videoElement.videoWidth;
                frame.height = videoElement.videoHeight;
                const context = frame.getContext('2d');
                context.drawImage(videoElement, 0, 0);
                this.colorUtilsService.resetCache();

                console.log('progress', `${Math.round(100 * currentTime / videoElement.duration)}%`);

                return {frame, expected: this.getExpectedFrame(currentTime)};
            })
        );
    }

    private getExpectedFrame(time: number): string | undefined {
        for (const event of this.description) {
            if (event.time <= time) {
                return event.screen;
            }
        }
        return undefined;
    }

    public getFrame(): Observable<{frame: HTMLCanvasElement, expected: string, startTimestamp: number}> {
        return this.frames$.pipe(
            map((input) => ({...input, startTimestamp: Date.now()}))
        );
    }
}
