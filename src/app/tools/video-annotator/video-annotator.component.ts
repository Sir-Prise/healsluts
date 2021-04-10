import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
    selector: 'app-video-annotator',
    templateUrl: './video-annotator.component.html',
    styleUrls: ['./video-annotator.component.scss']
})
export class VideoAnnotatorComponent implements OnInit {

    @ViewChild('videoDescribe')
    public videoDescribeElement: ElementRef<HTMLVideoElement>;

    @ViewChild('videoDescription')
    public videoDescriptionElement: ElementRef<HTMLTextAreaElement>;

    constructor() { }

    ngOnInit(): void {
    }

    public onChangeDescribeVideo(files: FileList): void {
        this.videoDescribeElement.nativeElement.src = URL.createObjectURL(files[0]);
    }

    public onDescribeVideoMove(milliseconds: number): void {
        this.videoDescribeElement.nativeElement.currentTime += milliseconds / 1000;
    }

    public onDescribeVideoSpeed(speed: number): void {
        this.videoDescribeElement.nativeElement.playbackRate = speed;
    }

    public onDescribeVideoMark(): void {
        this.videoDescriptionElement.nativeElement.value += `\n${this.videoDescribeElement.nativeElement.currentTime}\t`;
        this.videoDescriptionElement.nativeElement.focus();
    }

}
