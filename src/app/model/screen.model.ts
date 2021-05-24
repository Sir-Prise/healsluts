import { ScreenPoint } from './screen-point.model';


export interface Screen<T extends string> {
    name: T;
    must?: ScreenPoint[];
    should?: ScreenPoint[];
    might?: ScreenPoint[];
    nextScreens: Partial<Record<T, number>>;
    maxDuration?: number;
}
