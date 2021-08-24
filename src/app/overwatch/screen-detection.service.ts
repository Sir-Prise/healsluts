import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { IFrameService } from '../model/frame-service.interface';
import { ScreenByPixelService } from './screen-by-pixel.service';
import { OverwatchScreenName } from './screen-names';
import { ScreenPlausibilityService } from './screen-plausibility.service';
import { SetupService } from './setup.service';

/**
 * Service to determine the currently visible "screen". A screen is the type of interface of the game, like the menues, the scoreboard, ...
 */
@Injectable({
    providedIn: 'root'
})
export class ScreenDetectionService<TScreenName extends OverwatchScreenName = OverwatchScreenName> {
    public constructor(
        private readonly frameService: IFrameService,
        private readonly screenByPixelService: ScreenByPixelService<TScreenName>,
        private readonly screenPlausibilityService: ScreenPlausibilityService,
        private readonly setupService: SetupService,
    ) {
    }

    /**
     * Returns an observable emiting the detected screen every tick.
     */
    public getScreen(): Observable<{frame: HTMLCanvasElement, screen: TScreenName | 'undefined', startTimestamp: number}> {
        return this.frameService.getFrame().pipe(
            map((frame) => ({...frame, expected: this.setupService.expectedScreen as TScreenName})),
            this.screenByPixelService.getScreen(),
            this.screenPlausibilityService.clean(),
            tap((detection) => {
                if (detection.screen === 'undefined') {
                    this.screenByPixelService.setLastScreenName('undefined');
                }
            }),
        );
    }

    /**
     * Prints logging information in the console.
     */
    public log(): void {
        const reliablilty = this.screenByPixelService.reliability;
        console.log('FINISHED ANALYZING', reliablilty);
        reliablilty.forEach((results, screen) => {
            const count = results.correct + results.incorrect;
            console.log(screen, `${Math.round(100 * results.correct / count)}% correct`, `${count} expected times`);
        });
    }
}
