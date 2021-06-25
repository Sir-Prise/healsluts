import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { DeathDetectionService } from './death-detection.service';
import { OnFireDetectionService } from './on-fire-detection.service';
import { ScreenDetectionService } from './screen-detection.service';

@Injectable({
    providedIn: 'root'
})
export class GameService {

    public intensity = new BehaviorSubject(0);

    private previousIntensity = 0;

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
                let newIntensity: number | undefined;
                if (deathState === 'alive') {
                    newIntensity = onFireValue;
                } else if (deathState === 'dead') {
                    newIntensity = 0;
                } else {
                    newIntensity = Math.max(this.previousIntensity - .02, 0);
                }

                this.previousIntensity = newIntensity;
                this.intensity.next(newIntensity);
                // console.log('gameService', {screen, deathState, onFireValue, newIntensity});
                return {screen, deathState, onFireValue};
            }),
            switchMap(() => this.intensity)
        );
    }
}
