import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith, tap, withLatestFrom } from 'rxjs/operators';
import { OnFireDetectionService } from './on-fire-detection.service';
import { ScreenDetectionService } from './screen-detection.service';

@Injectable({
    providedIn: 'root'
})
export class GameService {

    public screen: string;
    public intensity = 0;

    constructor(
        private readonly screenDetectionService: ScreenDetectionService,
        private readonly onFireDetectionService: OnFireDetectionService,
    ) {
    }

    public start(): void {
        combineLatest([
            this.screenDetectionService.getScreen(),
            this.onFireDetectionService.getOnFireLevel().pipe(startWith(0))
        ]).pipe(
            tap(([{screen}, onFireValue]) => {
                this.screen = screen;
                if (['matchAlive', 'matchNoPrimary', 'interactionMenu'].includes(screen)) {
                    // Good
                    this.intensity = onFireValue;
                } else if (['matchDead', 'killcam', 'deadSpectating'].includes(screen)) {
                    // Bad
                    this.intensity = -1;
                } else {
                    // Don't care
                }
                console.log('RESULT: ', screen, onFireValue);
            })
        ).subscribe();
    }
}
