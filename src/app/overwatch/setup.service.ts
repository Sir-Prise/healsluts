import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SetupService {

    public useImageDisplayService = false;
    public loopInterval = 200;
    public useManualLoop = false;
    public expectedScreen?: string;

    constructor() { }

}
