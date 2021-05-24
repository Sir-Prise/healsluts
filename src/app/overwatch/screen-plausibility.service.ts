import { Injectable } from '@angular/core';
import { MonoTypeOperatorFunction, Observable, pipe } from 'rxjs';
import { bufferCount, map } from 'rxjs/operators';
import { OverwatchScreenName } from './screen-names';
import { ScreenSettingsService } from './screen-settings.service';

@Injectable({
    providedIn: 'root'
})
export class ScreenPlausibilityService {

    private lastScreen: OverwatchScreenName = 'undefined';
    private forgivenCount = 0;
    private screenChangedTime = 0;
    private blockedScreen?: OverwatchScreenName;
    private validityHistory: boolean[] = [];

    constructor(
        private readonly screenSettingsService: ScreenSettingsService<OverwatchScreenName>,
    ) {
    }

    /**
     * Replaces not plausible screens.
     *
     * When the detected screen is not a possible next screen of the previous:
     * - Stay with the previous screen for up to three emits.
     *
     * When the screen was longer active than possible:
     * - Switch to "undefined".
     *
     * When there have been many issues recently:
     * - It's probably an undefined screen so switch to that.
     */
    public clean<T extends {screen: OverwatchScreenName}>(): MonoTypeOperatorFunction<T> {
        return (source: Observable<T>) => source.pipe(
            map((detection) => {
                let screen = detection.screen;

                // Use previous screen when current screen is not possible
                if (this.lastScreen !== screen && !this.isPossibleNextScreen(this.lastScreen, screen) && this.forgivenCount < 3) {
                    screen = this.lastScreen;
                    // console.log('NOT PLAUSIBLE', 'no possible next screen', this.lastScreen, screen);
                    this.forgivenCount++;
                } else {
                    this.forgivenCount = 0;
                }

                // Switch to "undefined" when screen longer than possible
                if (screen === this.lastScreen || screen === this.blockedScreen) {
                    const maxDuration = this.screenSettingsService.getScreen(screen).maxDuration;
                    if (!this.screenChangedTime) {
                        // init value
                        this.screenChangedTime = Date.now();
                    }
                    if (maxDuration && Date.now() - this.screenChangedTime > maxDuration + 200) {
                        // console.log('NOT PLAUSIBLE', 'max duration reached');
                        this.blockedScreen = screen;
                        screen = 'undefined';
                    }
                } else {
                    this.screenChangedTime = Date.now();
                    this.blockedScreen = undefined;
                }

                // When too many corrections applied recently, switch to "undefined"
                this.validityHistory.push(detection.screen === screen);
                if (this.validityHistory.length > 20) {
                    this.validityHistory.shift();
                }
                if (this.validityHistory.filter((value) => !value).length > 5) {
                    // console.log('NOT PLAUSIBLE', 'too many corrections');
                    screen = 'undefined';
                }

                if (this.lastScreen !== screen) {
                    this.lastScreen = screen;
                }
                return {...detection, screen};
            })
        );
    }

    private isPossibleNextScreen(previousScreen: OverwatchScreenName, currentScreen: OverwatchScreenName): boolean {
        return Object.keys(this.screenSettingsService.getScreen(previousScreen).nextScreens).includes(currentScreen);
    }
}
