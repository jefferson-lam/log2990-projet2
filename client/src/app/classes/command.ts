export abstract class Command {
    protected ctx: CanvasRenderingContext2D;

    abstract execute(): void;

    cloneCanvas(selectionCanvas: HTMLCanvasElement): HTMLCanvasElement {
        const newCanvas = document.createElement('canvas');
        const context = newCanvas.getContext('2d') as CanvasRenderingContext2D;
        newCanvas.width = selectionCanvas.width;
        newCanvas.height = selectionCanvas.height;
        // apply the old canvas to the new one
        context.drawImage(selectionCanvas, 0, 0);
        return newCanvas;
    }
}
