import { Injectable } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

/**
 * Service which returns an observable which ticks every X milliseconds.
 */
@Injectable({
    providedIn: 'root'
})
export class LoopService {

    public isPaused = false;

    private readonly interval = interval(200);

    public getInterval(): Observable<void> {
        return this.interval.pipe(
            filter(() => !this.isPaused),
            map(() => {})
        );
    }
}
