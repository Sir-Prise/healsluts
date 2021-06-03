export class FixedLengthArray<T> {
    private previousValues: T[] = [];

    public constructor(
        private readonly length: number,
        defaultValue = null
    ) {
        if (defaultValue !== null) {
            this.previousValues = new Array(length).fill(defaultValue);
        }
    }

    public push(value: T): void {
        this.previousValues.push(value);

        if (this.previousValues.length > this.length) {
            this.previousValues.shift();
        }
    }

    public getValues<TFallback>(): T[] {
        return this.previousValues;
    }
}
