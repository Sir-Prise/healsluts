import { Observable } from 'rxjs';

// Using a class instead of an interface to be able to inject it
export abstract class IFrameService {
    getFrame: () => Observable<{
        frame: HTMLCanvasElement,
        expected?: string
    }>;
}
