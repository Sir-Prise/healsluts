import { Injectable } from '@angular/core';
import { Observable, OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class DurationService {

    constructor() { }

    public addDuration<T extends {startTimestamp: number}>(): OperatorFunction<T, T & {analysisDuration: number}> {
        return (source: Observable<T>) => source.pipe(
            map((input) => ({...input, analysisDuration: Date.now() - input.startTimestamp}))
        );
    }
}
