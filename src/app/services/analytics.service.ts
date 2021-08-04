import { Injectable } from '@angular/core';

declare function gtag(...args: any): void;

@Injectable({
    providedIn: 'root'
})
export class AnalyticsService {
    /**
     * Tracks an event
     * @param action Name of the activity (e.g. "click download")
     * @param category Event category
     * @param label Value when it's a string
     * @param value Value when it's a number
     */
    public static event(action: string, category?: string, label?: string, value?: number): void {
        // tslint:disable-next-line:no-string-literal
        if (!window['gtag']) {
            return;
        }
        gtag('event', action, {
            event_category: category,
            event_label: label,
            value
        });
    }
}
