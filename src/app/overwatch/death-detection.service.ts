import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { bufferCount, map, pluck } from 'rxjs/operators';
import { ScreenDetectionService } from './screen-detection.service';

@Injectable({
    providedIn: 'root'
})
export class DeathDetectionService {

    constructor(
        private readonly screenDetectionService: ScreenDetectionService
    ) { }

    public getDeathState(): Observable<'alive' | 'dead' | undefined> {
        return this.screenDetectionService.getScreen().pipe(
            pluck('screen'),
            bufferCount(5),
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
                // Count which state was most common
                const countAlive = lastStates.filter((state) => state === 'alive').length;
                const countDead = lastStates.filter((state) => state === 'dead').length;
                const countUndefined = lastStates.filter((state) => state === undefined).length;
                if (countDead > countAlive && countDead > countUndefined) {
                    return 'dead';
                }
                if (countAlive >= countUndefined) {
                    return 'alive';
                }
                return undefined;
            })
        );
    }
}
