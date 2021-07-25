import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class LoopManualService {

    private events = new Subject<void>();

    constructor() {
    }

    public getInterval(): Observable<void> {
        return this.events;
    }

    public tick(): void {
        this.events.next();
    }
}
