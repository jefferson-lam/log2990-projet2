import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { ResizerCommand } from '@app/components/resizer/resizer-command';
import { DrawingService } from './drawing.service';

describe('DrawingService', () => {
    let command: ResizerCommand;
    let service: DrawingService;
    let canvasTestHelper: CanvasTestHelper;
    let width: number;
    let height: number;

    const WIDTH_VALUE = 100;
    const HEIGHT_VALUE = 100;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DrawingService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        service.canvas = canvasTestHelper.canvas;
        service.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        service.previewCtx = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        width = WIDTH_VALUE;
        height = HEIGHT_VALUE;
        command = new ResizerCommand(width, height);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should clear the whole canvas', () => {
        service.clearCanvas(service.baseCtx);
        const pixelBuffer = new Uint32Array(service.baseCtx.getImageData(0, 0, service.canvas.width, service.canvas.height).data.buffer);
        const hasColoredPixels = pixelBuffer.some((color) => color !== 0);
        expect(hasColoredPixels).toEqual(false);
    });

    // it('should paste drawing on canvas', () => {
    //     const dataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAADElEQVQImWNgoBMAAABpAAFEI8ARAAAAAElFTkSuQmCC';
    //     const image = new Image();
    //     image.src = dataUrl;

    //     const executeSpy = spyOn(command, 'execute');
    //     const drawImageSpy = spyOn(service.baseCtx, 'drawImage');

    //     service.drawSavedImage(dataUrl);

    //     expect(executeSpy).toHaveBeenCalled();
    //     expect(drawImageSpy).toHaveBeenCalled();
    // });
});
