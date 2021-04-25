import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { bufferCount, map, pluck } from 'rxjs/operators';
import { ScreenDetectionService } from './screen-detection.service';

@Injectable({
    providedIn: 'root'
})
export class DeathDetectionService {

    private lastState: 'alive' | 'dead' | undefined;

    constructor(
        private readonly screenDetectionService: ScreenDetectionService
    ) { }

    public getDeathState(): Observable<'alive' | 'dead' | undefined> {
        return this.screenDetectionService.getScreen().pipe(
            pluck('screen'),
            bufferCount(7),
            map((lastScreens) => {
                const lastStates = lastScreens
                    // filter scoreBoard as this can mean alive or dead (aka Schrödinger's Score Board)
                    .filter((screen) => screen !== 'scoreBoard')
                    .map((screen) => {
                        if (['matchAlive', 'matchNoPrimary', 'interactionMenu'].includes(screen)) {
                            return 'alive';
                        }
                        if (['matchDead', 'killcam', 'deadSpectating'].includes(screen)) {
                            return 'dead';
                        }
                        return undefined;
                    });

                // Add remembered value when all screens where score board
                if (!lastStates.length) {
                    lastStates.push(this.lastState);
                }

                let totalState: 'alive' | 'dead' | undefined;
                if (!lastStates.some((state) => state !== 'dead')) {
                    // When all where "dead", this is the state
                    totalState = 'dead';

                } else {
                    const countAlive = lastStates.filter((state) => state === 'alive').length;
                    const countUndefined = lastStates.filter((state) => state === undefined).length;
                    if (countAlive >= countUndefined) {
                        totalState = 'alive';
                    }
                }

                this.lastState = totalState;
                return totalState;
            })
        );
    }
}
