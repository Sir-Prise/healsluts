import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AlphaCalculatorComponent } from './tools/alpha-calculator/alpha-calculator.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IsColorCalculatorComponent } from './tools/is-color-calculator/is-color-calculator.component';
import { VideoAnnotatorComponent } from './tools/video-annotator/video-annotator.component';

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
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
