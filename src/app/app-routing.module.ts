import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ToolsComponent } from './pages/tools/tools.component';

@NgModule({
    declarations: [

    ],
    imports: [
        RouterModule.forRoot([
            { path: '', component: HomeComponent },
            { path: 'tools', component: ToolsComponent },
            { path: '**', redirectTo: '' }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {
}
