import { Component, OnInit } from '@angular/core';
import { ButtplugClientDevice } from 'buttplug';
import { DeviceService } from '../device.service';

@Component({
    selector: 'app-devices',
    templateUrl: './device-connector.component.html',
    styleUrls: ['./device-connector.component.scss']
})
export class DevicesComponent implements OnInit {

    public readonly supportsBluetooth = !!(navigator as any).bluetooth;
    public readonly hasBluetooth$: Promise<boolean> | undefined = (navigator as any).bluetooth?.getAvailability();

    public loading$ = this.deviceService.loading$;
    public devices: Array<{status: 'connected' | 'disconnected', device: ButtplugClientDevice}> = [];
    public get isDeviceConnected(): boolean {
        return this.devices.some((device) => device.status === 'connected');
    }
    public isTesting = false;

    public error?: string;

    constructor(
        private readonly deviceService: DeviceService,
    ) {
        // Using an own list of devices instead of this.deviceService.connectedDevices to be able to list disconnected devices
        this.deviceService.deviceChanges$.subscribe((event) => {
            // Remove existing devices with the same name and old status
            this.devices = this.devices.filter((device) => {
                return device.device.Name !== event.device.Name || device.status === event.event;
            });
            // Add device
            this.devices.push({device: event.device, status: event.event});
        });

        // Display errors caused by DeviceService
        this.deviceService.errors$.subscribe((error: Error) => {
            this.error = error.message;
        });
    }

    ngOnInit(): void {
    }

    public async startScanning(): Promise<void> {
        await this.deviceService.connectDevice();
    }

    public async test(): Promise<void> {
        this.isTesting = true;
        await this.deviceService.setPushIntensity(0.2, 1000);
        setTimeout(async () => {
            this.isTesting = false;
        }, 1000);
    }

}
