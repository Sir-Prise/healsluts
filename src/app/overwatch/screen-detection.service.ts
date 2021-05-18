import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ColorRGBAPosition } from '../model/color-rgba-position.model';
import { IFrameService } from '../model/frame-service.interface';
import { Position } from '../model/position.model';
import { ScreenPoint } from '../model/screen-point.model';
import { Screen } from '../model/screen.model';
import { ColorDifferenceService } from '../tools/color-difference.service';
import { ImageDisplayService } from '../tools/image-display.service';
import { ColorUtilsService } from '../utils/color-utils.service';
import { ScreenByPixelService } from './screen-by-pixel.service';
import { OverwatchScreenName } from './screen-names';
import { ScreenPlausibilityService } from './screen-plausibility.service';
import { ScreenSettingsService } from './screen-settings.service';

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
        return this.screenByPixelService.getScreen();
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
