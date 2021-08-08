import { Injectable } from '@angular/core';
import { ButtplugClient, ButtplugClientDevice, ButtplugEmbeddedConnectorOptions, buttplugInit } from 'buttplug';
import { BehaviorSubject, Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { AnalyticsService } from '../services/analytics.service';

@Injectable({
    providedIn: 'root'
})
export class DeviceService {

    public readonly intensity$ = new Subject<number>();

    public readonly deviceChanges$ = new Subject<{event: 'connected' | 'disconnected', device: ButtplugClientDevice}>();
    public readonly loading$ = new BehaviorSubject<boolean>(false);
    public readonly errors$ = new Subject<Error>();

    private connectedDevices: ButtplugClientDevice[] = [];

    private baseIntensity = 0;
    private pushIntensity = 0;

    constructor() {
        this.intensity$.pipe(
            distinctUntilChanged(),
        ).subscribe((intensity) => {
            try {
                for (const device of this.connectedDevices) {
                    device.vibrate(intensity);
                }
            } catch (e) {
                this.errorHandler(e);
            }
        });
    }

    public async connectDevice(): Promise<void> {
        this.loading$.next(true);
        try {
            await buttplugInit();
            const connector = new ButtplugEmbeddedConnectorOptions();
            const client = new ButtplugClient('Healing is fun');

            client.addListener('deviceadded', this.onDeviceAdded.bind(this));
            client.addListener('deviceremoved', this.onDeviceRemoved.bind(this));

            await client.connect(connector);
            this.loading$.next(false);
            await client.startScanning();
        } catch (e) {
            this.errorHandler(e);
            this.loading$.next(false);
        }
    }

    private onDeviceAdded(device: ButtplugClientDevice): void {
        this.connectedDevices.push(device);
        this.deviceChanges$.next({event: 'connected', device});
        AnalyticsService.event('device added', 'devices', device.Name);
    }
    private onDeviceRemoved(device: ButtplugClientDevice): void {
        const index = this.connectedDevices.indexOf(device);
        this.connectedDevices.splice(index, 1);
        this.deviceChanges$.next({event: 'disconnected', device});
    }

    public setBaseIntensity(intensity: number): void {
        this.baseIntensity = intensity;
        this.updateIntensity();
    }

    public setPushIntensity(addedIntensity: number, duration: number): void {
        this.pushIntensity += addedIntensity;
        this.updateIntensity();
        setTimeout(() => {
            this.pushIntensity -= addedIntensity;
            this.updateIntensity();
        }, duration);
    }

    private updateIntensity(): void {
        this.intensity$.next(Math.min(Math.max(this.baseIntensity + this.pushIntensity, 0), 1));
    }

    private errorHandler(error: Error): void {
        // tslint:disable-next-line:no-console
        console.trace(error);
        this.errors$.next(error);
    }
}
