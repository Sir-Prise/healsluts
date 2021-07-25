import { Directive, HostListener } from '@angular/core';

@Directive({
    selector: 'button[appAutoBlur]'
})
export class AutoBlurDirective {

    @HostListener('click', ['$event'])
    public onClick($event): void {
        $event.target.blur();
    }
}
