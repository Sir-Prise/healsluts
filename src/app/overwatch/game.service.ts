import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith, tap, withLatestFrom } from 'rxjs/operators';
import { DeathDetectionService } from './death-detection.service';
import { OnFireDetectionService } from './on-fire-detection.service';
import { ScreenDetectionService } from './screen-detection.service';

@Injectable({
    providedIn: 'root'
})
export class GameService {

    public screen: string;
    public intensity: any;

    constructor(
        private readonly screenDetectionService: ScreenDetectionService,
        private readonly onFireDetectionService: OnFireDetectionService,
        private readonly deathDetectionService: DeathDetectionService,
    ) {
    }

    public start(): Observable<unknown> {
        return this.screenDetectionService.getScreen().pipe(
            this.onFireDetectionService.addOnFireLevel(),
            this.deathDetectionService.addDeathState(),
            map(({screen, onFireValue, deathState}) => {
                this.screen = screen;
                this.intensity = deathState;
                // console.log('RESULT: ', screen, onFireValue);
                return {screen, deathState, onFireValue};
            })
        );
    }
}
