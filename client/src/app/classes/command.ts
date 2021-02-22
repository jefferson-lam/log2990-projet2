export abstract class Command {
    protected ctx: CanvasRenderingContext2D;
    constructor(canvasCtx: CanvasRenderingContext2D) {
        this.ctx = canvasCtx;
    }

    abstract execute(): void;
}
