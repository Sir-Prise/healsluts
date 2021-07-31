import { Injectable } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { SetupService } from './setup.service';

/**
 * Service which returns an observable which ticks every X milliseconds.
 */
@Injectable()
export class LoopService {

    public isPaused = false;

    private readonly interval: Observable<number>;

    public constructor(
        setupService: SetupService,
    ) {
        this.interval = interval(setupService.loopInterval);
    }

    public getInterval(): Observable<{startTimestamp: number}> {
        return this.interval.pipe(
            filter(() => !this.isPaused),
            map(() => ({startTimestamp: Date.now()}))
        );
    }
}
