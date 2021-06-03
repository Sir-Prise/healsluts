import { Injectable } from '@angular/core';
import { Observable, OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';
import { FixedLengthArray } from '../utils/fixed-length-array';
import { OverwatchScreenName } from './screen-names';

@Injectable({
    providedIn: 'root'
})
export class DeathDetectionService {

    private previousStates = new FixedLengthArray<DeathState>(9, undefined);

    constructor(
    ) { }

    public addDeathState<T extends {screen: OverwatchScreenName}>(
    ): OperatorFunction<T, T & {deathState: DeathState}> {
        return (source: Observable<T>) => source.pipe(
            map((input) => {
                if (input.screen !== 'scoreBoard') {
                    this.previousStates.push(this.screenToDeathState(input.screen));
                }

                let deathState: DeathState;
                const countAlive = this.previousStates.getValues().filter((state) => state === 'alive').length;
                const countDead = this.previousStates.getValues().filter((state) => state === 'dead').length;
                if (countDead >= 7) {
                    deathState = 'dead';
                } else if (countAlive >= 5) {
                    deathState = 'alive';
                }

                return {...input, deathState};
            })
        );
    }

    private screenToDeathState(screen: OverwatchScreenName): DeathState {
        if (['matchAlive', 'matchNoPrimary', 'interactionMenu'].includes(screen)) {
            return 'alive';
        }
        if (['matchDead', 'killcam', 'deadSpectating', 'black'].includes(screen)) {
            return 'dead';
        }
        return undefined;
    }
}

type DeathState = 'alive' | 'dead' | undefined;
