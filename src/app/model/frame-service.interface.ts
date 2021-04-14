import { Observable } from 'rxjs';

export interface IFrameService {
    getFrame(): Observable<{
        frame: HTMLCanvasElement,
        expected?: string
    }>;
}
