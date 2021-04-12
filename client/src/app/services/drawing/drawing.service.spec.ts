import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from './drawing.service';

describe('DrawingService', () => {
    let service: DrawingService;
    let canvasTestHelper: CanvasTestHelper;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DrawingService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        service.canvas = canvasTestHelper.canvas;
        service.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        service.previewCtx = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('clearCanvas should clear the whole canvas', () => {
        service.clearCanvas(service.baseCtx);
        const pixelBuffer = new Uint32Array(service.baseCtx.getImageData(0, 0, service.canvas.width, service.canvas.height).data.buffer);
        const hasColoredPixels = pixelBuffer.some((color) => color !== 0);
        expect(hasColoredPixels).toEqual(false);
    });

    it('newDrawing should fillRect on baseCtx canvas', () => {
        const fillRectSpy = spyOn(service.baseCtx, 'fillRect');
        service.newDrawing();
        expect(service.baseCtx.fillStyle).toBe('#ffffff');
        expect(fillRectSpy).toHaveBeenCalled();
    });

    it("newDrawing should call clear canvas of preview layer of component's drawing service", () => {
        const clearCanvasSpy = spyOn(service, 'clearCanvas');
        service.newDrawing();
        expect(clearCanvasSpy).toHaveBeenCalled();
        expect(clearCanvasSpy).toHaveBeenCalledWith(service.previewCtx);
    });
});
