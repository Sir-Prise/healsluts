export class ArrayUtils {
    public static average(input: number[]): number {
        return input.reduce((prev, curr) => prev + curr, 0) / input.length;
    }
}
