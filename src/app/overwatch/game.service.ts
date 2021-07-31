import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { DeviceService } from '../device/device.service';
import { DeathDetectionService } from './death-detection.service';
import { DeathState } from './death-state.type';
import { OnFireDetectionService } from './on-fire-detection.service';
import { ScreenDetectionService } from './screen-detection.service';
import { OverwatchScreenName } from './screen-names';

@Injectable({
    providedIn: 'root'
})
export class GameService {

    private previousIntensity = 0;

    constructor(
        private readonly screenDetectionService: ScreenDetectionService,
        private readonly onFireDetectionService: OnFireDetectionService,
        private readonly deathDetectionService: DeathDetectionService,
        private readonly deviceService: DeviceService,
    ) {
    }

    public start(): Observable<{intensity: number, screen: OverwatchScreenName, deathState: DeathState, onFireValue: number}> {
        // Initial negative push intensity to compensate old values still in detection services
        this.deviceService.setPushIntensity(-1, 2000);

        return this.screenDetectionService.getScreen().pipe(
            this.onFireDetectionService.addOnFireLevel(),
            this.deathDetectionService.addDeathState(),
            map(({screen, onFireValue, deathState}) => {
                let newIntensity: number | undefined;
                if (deathState === 'alive') {
                    newIntensity = onFireValue;
                } else if (deathState === 'dead') {
                    newIntensity = 0;
                    // Set push-intensity to -1 to counter all positive pushs
                    this.deviceService.setPushIntensity(-1, 500);
                } else {
                    newIntensity = Math.max(this.previousIntensity - .02, 0);
                }

                this.previousIntensity = newIntensity;
                this.deviceService.setBaseIntensity(newIntensity);
                return {intensity: newIntensity, screen, deathState, onFireValue};
            }),
        );
    }

    public stop(): void {
        // Canceling the observable subscription is handled by caller

        this.deviceService.setBaseIntensity(-1);
    }
}
