import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ScreenByPixelService } from './screen-by-pixel.service';
import { OverwatchScreenName } from './screen-names';
import { ScreenPlausibilityService } from './screen-plausibility.service';

/**
 * Service to determine the currently visible "screen". A screen is the type of interface of the game, like the menues, the scoreboard, ...
 */
@Injectable({
    providedIn: 'root'
})
export class ScreenDetectionService<TScreenName extends OverwatchScreenName = OverwatchScreenName> {
    public constructor(
        private readonly screenByPixelService: ScreenByPixelService<TScreenName>,
        private readonly screenPlausibilityService: ScreenPlausibilityService,
    ) {
    }

    /**
     * Returns an observable emiting the detected screen every tick.
     */
    public getScreen(): Observable<{frame: HTMLCanvasElement, screen: TScreenName | 'undefined'}> {
        return this.screenByPixelService.getScreen().pipe(
            this.screenPlausibilityService.clean(),
            tap((detection) => {
                if (detection.screen === 'undefined') {
                    this.screenByPixelService.setLastScreenName('undefined');
                }
            })
        );
    }

    /**
     * Analyzes a single frame.
     */
    public analyzeScreen(frame: HTMLCanvasElement, expected?: TScreenName | 'undefined'): {frame: HTMLCanvasElement, screen: TScreenName | 'undefined'} {
        return this.screenByPixelService.analyzeScreen(frame, expected);
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
