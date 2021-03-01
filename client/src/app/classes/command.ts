export abstract class Command {
    protected ctx: CanvasRenderingContext2D;
    abstract execute(): void;
}
