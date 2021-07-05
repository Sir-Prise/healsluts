import { Injectable } from '@angular/core';
import { ButtplugClient, ButtplugClientDevice, ButtplugEmbeddedConnectorOptions, buttplugInit } from 'buttplug';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DeviceService {

    public deviceChanges$ = new Subject<{event: 'connected' | 'disconnected', device: ButtplugClientDevice}>();
    public errors$ = new Subject<Error>();

    private connectedDevices: ButtplugClientDevice[] = [];

    private readonly intensity$ = new Subject<number>();
    private baseIntensity = 0;
    private pushIntensity = 0;

    constructor() {
        this.intensity$.subscribe((intensity) => {
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
        try {
            await buttplugInit();
            const connector = new ButtplugEmbeddedConnectorOptions();
            const client = new ButtplugClient('Healing is fun');

            client.addListener('deviceadded', this.onDeviceAdded.bind(this));
            client.addListener('deviceremoved', this.onDeviceRemoved.bind(this));

            await client.connect(connector);
            await client.startScanning();
        } catch (e) {
            this.errorHandler(e);
        }
    }

    private onDeviceAdded(device: ButtplugClientDevice): void {
        this.connectedDevices.push(device);
        this.deviceChanges$.next({event: 'connected', device});
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
        this.intensity$.next(this.baseIntensity + this.pushIntensity);
    }

    private errorHandler(error: Error): void {
        // tslint:disable-next-line:no-console
        console.trace(error);
        this.errors$.next(error);
    }
}
