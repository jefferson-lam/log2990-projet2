import { TestBed } from '@angular/core/testing';
import * as CanvasConstants from '@app/constants/canvas-constants';
import { CanvasGridService } from '@app/services/canvas-grid/canvas-grid.service';
import { ResizerCommand } from './resizer-command';

describe('ResizerCommand', () => {
    let service: ResizerCommand;
    let canvasGridServiceSpy: jasmine.SpyObj<CanvasGridService>;
    const numberValue: number = CanvasConstants.DEFAULT_WIDTH;
    let baseCanvas: HTMLCanvasElement;
    let previewLayer: HTMLCanvasElement;
    let sideResizer: HTMLElement;
    let cornerResizer: HTMLElement;
    let bottomResizer: HTMLElement;
    let baseCtxDrawImageSpy: jasmine.Spy;
    let previewCtxDrawImageSpy: jasmine.Spy;

    beforeEach(() => {
        sideResizer = document.createElement('div');
        sideResizer.id = 'sideResizer';
        bottomResizer = document.createElement('div');
        bottomResizer.id = 'bottomResizer';
        cornerResizer = document.createElement('div');
        cornerResizer.id = 'cornerResizer';
        baseCanvas = document.createElement('canvas');
        baseCanvas.id = 'canvas';
        previewLayer = document.createElement('canvas');
        previewLayer.id = 'previewLayer';

        document.body.append(baseCanvas);
        document.body.append(previewLayer);
        document.body.append(sideResizer);
        document.body.append(bottomResizer);
        document.body.append(cornerResizer);

        canvasGridServiceSpy = jasmine.createSpyObj('CanvasGridService', ['resize']);

        TestBed.configureTestingModule({
            providers: [
                { provide: Number, useValue: numberValue },
                { provide: CanvasGridService, useValue: canvasGridServiceSpy },
            ],
        });
        service = TestBed.inject(ResizerCommand);

        previewCtxDrawImageSpy = spyOn(service.previewCtx, 'drawImage').and.callThrough();
        baseCtxDrawImageSpy = spyOn(service.baseCtx, 'drawImage').and.callThrough();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('constructor can be without arguments', () => {
        service = new ResizerCommand(canvasGridServiceSpy);
        expect(service).toBeTruthy();
    });

    it('constructor can be with arguments', () => {
        service = new ResizerCommand(canvasGridServiceSpy, CanvasConstants.DEFAULT_WIDTH, CanvasConstants.DEFAULT_HEIGHT);
        expect(service).toBeTruthy();
    });

    it('execute should call resizeCanvas', () => {
        const resizeCanvasSpy = spyOn(service, 'resizeCanvas');

        service.execute();

        expect(resizeCanvasSpy).toHaveBeenCalled();
    });

    it('resizeCanvas should call drawImage 2 times (once for preview, once for base)', () => {
        service.resizeCanvas();

        expect(previewCtxDrawImageSpy).toHaveBeenCalled();
        expect(baseCtxDrawImageSpy).toHaveBeenCalled();

        expect(canvasGridServiceSpy.resize).toHaveBeenCalled();
    });

    it('resizeCanvas should set new values', () => {
        service.previewWidth = CanvasConstants.MIN_LENGTH_CANVAS;
        service.previewHeight = CanvasConstants.MIN_HEIGHT_CANVAS;

        service.resizeCanvas();

        expect(service.previewCtx.canvas.width).toBe(service.previewWidth);
        expect(service.baseCtx.canvas.width).toBe(service.previewWidth);
        expect(service.previewCtx.canvas.height).toBe(service.previewHeight);
        expect(service.baseCtx.canvas.height).toBe(service.previewHeight);
        expect(service.sideResizer.style.left).toBe(service.previewWidth + 'px');
        expect(service.sideResizer.style.top).toBe(service.previewHeight / 2 + 'px');
        expect(service.cornerResizer.style.left).toBe(service.previewWidth + 'px');
        expect(service.cornerResizer.style.top).toBe(service.previewHeight + 'px');
        expect(service.bottomResizer.style.left).toBe(service.previewWidth / 2 + 'px');
        expect(service.bottomResizer.style.top).toBe(service.previewHeight + 'px');
        expect(canvasGridServiceSpy.resize).toHaveBeenCalledWith(service.previewWidth, service.previewHeight);
    });
});
