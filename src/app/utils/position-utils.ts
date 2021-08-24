import { Position } from '../model/position.model';

export class PositionUtils {
    /**
     * Converts a position for a 1920x1080 screen to any other screen dimension.
     */
    public static scale(originalPoint: Position, targetWidth: number, targetHeight: number): Position {
        return {
            x: Math.round(originalPoint.x * targetWidth / 1920),
            y: Math.round(originalPoint.y * targetHeight / 1080)
        };
    }
}
