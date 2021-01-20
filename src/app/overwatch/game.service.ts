import { Injectable } from '@angular/core';
import { combineLatest } from 'rxjs';
import { tap } from 'rxjs/operators';
import { OnFireDetectionService } from './on-fire-detection.service';
import { ScreenDetectionService } from './screen-detection.service';

@Injectable({
    providedIn: 'root'
})
export class GameService {

    constructor(
        private readonly screenDetectionService: ScreenDetectionService,
        private readonly onFireDetectionService: OnFireDetectionService,
    ) {
    }

    public start() {
        combineLatest([
            this.screenDetectionService.getScreen(),
            this.onFireDetectionService.getOnFireLevel()
        ]).pipe(
            tap(([{screen}, onFireValue]) => {
                console.log('RESULT: ', screen, onFireValue);
            })
        ).subscribe();
    }
}
