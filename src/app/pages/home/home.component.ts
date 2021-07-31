import { Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { GameService } from 'src/app/overwatch/game.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    @ViewChild('videoTest')
    public videoTestElement: ElementRef<HTMLVideoElement>;

    public videoReady = false;
    public gameServiceResponse: Observable<any>;

    public constructor(
        private readonly injector: Injector,
    ) {
    }

    public ngOnInit(): void {
    }

    public onVideoReady(videoReady: boolean): void {
        this.videoReady = videoReady;
    }

    public onStartAnalyze(): void {
        const gameService = this.injector.get<GameService>(GameService) as GameService;
        this.gameServiceResponse = gameService.start().pipe(share());
    }
}
