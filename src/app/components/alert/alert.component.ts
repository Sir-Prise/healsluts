import { Component, OnInit, Input, HostBinding } from '@angular/core';

@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements OnInit {

    @Input()
    public type: 'error' | 'warning' | 'info';

    @HostBinding('class')
    public class: string;

    public get icon(): string {
        switch (this.type) {
            case 'error':
                return 'delete';
            case 'warning':
                return 'warning';
            default:
                return 'info-large';
        }
    }

    constructor() { }

    ngOnInit(): void {
        this.class = this.type;
    }

}
