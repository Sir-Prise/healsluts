import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class LoopManualService {

    private events = new Subject<void>();

    constructor() {
    }

    public getInterval(): Observable<{startTimestamp: number}> {
        return this.events.pipe(
            map(() => ({startTimestamp: Date.now()}))
        );
    }

    public tick(): void {
        this.events.next();
    }
}
