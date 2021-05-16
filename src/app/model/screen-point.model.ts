import { ColorRGBAPosition } from './color-rgba-position.model';
import { Position } from './position.model';

export type ScreenPoint = ColorRGBAPosition & {name: string} & {contrast?: Position};
