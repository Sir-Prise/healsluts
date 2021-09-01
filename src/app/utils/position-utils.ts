import { Position } from '../model/position.model';

export class PositionUtils {
    /**
     * Converts a position for a 1920x1080 screen to any other screen dimension.
     *
     * The overwatch window content is always 16:9. There are black bars when the window/screen is not 16:9.
     */
    public static scale(originalPoint: Position, targetWidth: number, targetHeight: number): Position {
        let xOffset = 0;
        let yOffset = 0;
        let width = targetWidth;
        let height = targetHeight;
        if (targetWidth / targetHeight > 1920 / 1080) {
            // Screen wider than 16:9
            width = (height / 1080) * 1920;
            xOffset = (targetWidth - width) / 2;

        } else {
            // Screen higher or equal than 16:9
            height = (width / 1920) * 1080;
            yOffset = (targetHeight - height) / 2;
        }

        return {
            x: xOffset + Math.round(originalPoint.x * width / 1920),
            y: yOffset + Math.round(originalPoint.y * height / 1080)
        };
    }
}
