import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AlphaCalculatorComponent } from './tools/alpha-calculator/alpha-calculator.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IsColorCalculatorComponent } from './tools/is-color-calculator/is-color-calculator.component';
import { VideoAnnotatorComponent } from './tools/video-annotator/video-annotator.component';
import { IFrameService } from './model/frame-service.interface';
import { SetupService } from './overwatch/setup.service';
import { LoopService } from './overwatch/loop.service';
import { ColorUtilsService } from './utils/color-utils.service';
import { ImageDisplayService } from './tools/image-display.service';
import { FrameService } from './overwatch/frame.service';

@NgModule({
    declarations: [
        AppComponent,
        AlphaCalculatorComponent,
        IsColorCalculatorComponent,
        VideoAnnotatorComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule
    ],
    providers: [
        {provide: IFrameService, useFactory:
            (setupService: SetupService, loopService: LoopService, colorUtilsService: ColorUtilsService) => {
                console.log('frame service factory');
                if (setupService.useImageDisplayService) {
                    return new ImageDisplayService(colorUtilsService);
                }
                return new FrameService(loopService, colorUtilsService);
        }, deps: [SetupService, LoopService, ColorUtilsService]},
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
