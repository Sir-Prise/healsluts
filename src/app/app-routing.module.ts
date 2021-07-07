import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

@NgModule({
    declarations: [

    ],
    imports: [
        RouterModule.forRoot([
            { path: '', component: HomeComponent },
            { path: '**', redirectTo: '' }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {
}
