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
import { LoopManualService } from './overwatch/loop-manual.service';
import { ColorExtractComponent } from './tools/color-extract/color-extract.component';
import { DevicesComponent } from './device/device-connector/device-connector.component';
import { TypiconComponent } from './components/typicon/typicon.component';
import { AlertComponent } from './components/alert/alert.component';
import { HomeComponent } from './pages/home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { ToolsComponent } from './pages/tools/tools.component';
import { AutoBlurDirective } from './directives/auto-blur.directive';

@NgModule({
    declarations: [
        AppComponent,
        AlphaCalculatorComponent,
        IsColorCalculatorComponent,
        VideoAnnotatorComponent,
        ColorExtractComponent,
        DevicesComponent,
        TypiconComponent,
        AlertComponent,
        HomeComponent,
        ToolsComponent,
        AutoBlurDirective,
    ],
    imports: [
        AppRoutingModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule
    ],
    providers: [
        {provide: IFrameService, useFactory:
            (setupService: SetupService, loopService: LoopService, colorUtilsService: ColorUtilsService) => {
                if (setupService.useImageDisplayService) {
                    return new ImageDisplayService(colorUtilsService);
                }
                return new FrameService(loopService, colorUtilsService);
        }, deps: [SetupService, LoopService, ColorUtilsService]},
        {provide: LoopService, useFactory:
            (setupService: SetupService) => {
                if (setupService.useManualLoop) {
                    return new LoopManualService();
                }
                return new LoopService(setupService);
        }, deps: [SetupService]},
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
