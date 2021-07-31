import { Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { DeviceService } from 'src/app/device/device.service';
import { DeathState } from 'src/app/overwatch/death-state.type';
import { GameService } from 'src/app/overwatch/game.service';
import { OverwatchScreenName } from 'src/app/overwatch/screen-names';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    @ViewChild('videoTest')
    public videoTestElement: ElementRef<HTMLVideoElement>;

    public videoReady = false;
    public isPlaying = false;
    public gameServiceResponse: Observable<{intensity: number, screen: OverwatchScreenName, deathState: DeathState, onFireValue: number}>;

    public constructor(
        private readonly injector: Injector,
        public readonly deviceService: DeviceService,
    ) {
    }

    public ngOnInit(): void {
    }

    public onVideoReady(videoReady: boolean): void {
        this.videoReady = videoReady;

        if (!videoReady) {
            this.onStopGame();
        }
    }

    public onStartGame(): void {
        const gameService = this.injector.get<GameService>(GameService) as GameService;
        this.gameServiceResponse = gameService.start().pipe(share());
        this.isPlaying = true;
    }

    public onStopGame(): void {
        this.gameServiceResponse = undefined;
        const gameService = this.injector.get<GameService>(GameService) as GameService;
        gameService.stop();
        this.isPlaying = false;
    }
}
