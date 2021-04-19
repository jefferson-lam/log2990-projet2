import { TestBed } from '@angular/core/testing';
import * as CanvasConstants from '@app/constants/canvas-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Subject } from 'rxjs';
import { ResizerCommand } from './resizer-command';
import createSpyObj = jasmine.createSpyObj;

// tslint:disable: no-string-literal
// tslint:disable: no-any
describe('ResizerCommand', () => {
    let service: ResizerCommand;
    const numberValue: number = CanvasConstants.DEFAULT_WIDTH;
    let baseCanvas: HTMLCanvasElement;
    let previewLayer: HTMLCanvasElement;
    let sideResizer: HTMLElement;
    let cornerResizer: HTMLElement;
    let bottomResizer: HTMLElement;
    let baseCtxDrawImageSpy: jasmine.Spy;
    let previewCtxDrawImageSpy: jasmine.Spy;
    let canvasSizeSubject: jasmine.Spy;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;

    beforeEach(() => {
        drawingServiceSpy = createSpyObj('DrawingService', ['whiteOut'], ['canvasSizeSubject']);
        (Object.getOwnPropertyDescriptor(drawingServiceSpy, 'canvasSizeSubject')?.get as jasmine.Spy<() => Subject<number[]>>).and.returnValue(
            new Subject<number[]>(),
        );
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

        TestBed.configureTestingModule({
            providers: [
                { provide: Number, useValue: numberValue },
                { provide: DrawingService, useValue: drawingServiceSpy },
            ],
        });
        service = TestBed.inject(ResizerCommand);

        canvasSizeSubject = spyOn(drawingServiceSpy.canvasSizeSubject, 'next');
        previewCtxDrawImageSpy = spyOn(service['previewCtx'], 'drawImage').and.callThrough();
        baseCtxDrawImageSpy = spyOn(service['baseCtx'], 'drawImage').and.callThrough();

        service['previewWidth'] = CanvasConstants.MIN_WIDTH_CANVAS;
        service['previewHeight'] = CanvasConstants.MIN_HEIGHT_CANVAS;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('constructor can be without arguments', () => {
        service = new ResizerCommand(drawingServiceSpy);
        expect(service).toBeTruthy();
    });

    it('constructor can be with arguments', () => {
        service = new ResizerCommand(drawingServiceSpy, CanvasConstants.DEFAULT_WIDTH, CanvasConstants.DEFAULT_HEIGHT);
        expect(service).toBeTruthy();
    });

    it('execute should call resizeCanvas', () => {
        const resizeCanvasSpy = spyOn<any>(service, 'resizeCanvas');

        service.execute();

        expect(resizeCanvasSpy).toHaveBeenCalled();
    });

    it('resizeCanvas should call drawImage 2 times (once for preview, once for base)', () => {
        service['resizeCanvas']();

        expect(previewCtxDrawImageSpy).toHaveBeenCalled();
        expect(baseCtxDrawImageSpy).toHaveBeenCalled();
    });

    it('resizeCanvas should call resizeBaseCanvas', () => {
        const resizeBaseSpy = spyOn<any>(service, 'resizeBaseCanvas');

        service['resizeCanvas']();

        expect(resizeBaseSpy).toHaveBeenCalled();
    });

    it('resizeCanvas should call resizePreviewCanvas', () => {
        const resizePreviewSpy = spyOn<any>(service, 'resizePreviewCanvas');

        service['resizeCanvas']();

        expect(resizePreviewSpy).toHaveBeenCalled();
    });

    it('resizeCanvas should call whiteOut with baseCtx', () => {
        service['resizeCanvas']();

        expect(drawingServiceSpy.whiteOut).toHaveBeenCalled();
        expect(drawingServiceSpy.whiteOut).toHaveBeenCalledWith(service['baseCtx']);
    });

    it('resizeCanvas should call placeResizers', () => {
        const placeResizersSpy = spyOn<any>(service, 'placeResizers');

        service['resizeCanvas']();

        expect(placeResizersSpy).toHaveBeenCalled();
    });

    it('resizeCanvas should emit new size', () => {
        service['resizeCanvas']();

        expect(canvasSizeSubject).toHaveBeenCalled();
        expect(canvasSizeSubject).toHaveBeenCalledWith([service['previewWidth'], service['previewHeight']]);
    });

    it('placeResizers should set resizers positions', () => {
        service['placeResizers']();

        expect(service['sideResizer'].style.left).toBe(service['baseCtx'].canvas.width + 'px');
        expect(service['sideResizer'].style.top).toBe(service['baseCtx'].canvas.height / 2 + 'px');
        expect(service['cornerResizer'].style.left).toBe(service['baseCtx'].canvas.width + 'px');
        expect(service['cornerResizer'].style.top).toBe(service['baseCtx'].canvas.height + 'px');
        expect(service['bottomResizer'].style.left).toBe(service['baseCtx'].canvas.width / 2 + 'px');
        expect(service['bottomResizer'].style.top).toBe(service['baseCtx'].canvas.height + 'px');
    });

    it('resizeBaseCanvas should set new canvas size', () => {
        service['resizeBaseCanvas']();

        expect(service['baseCtx'].canvas.width).toBe(service['previewWidth']);
        expect(service['baseCtx'].canvas.height).toBe(service['previewHeight']);
    });

    it('resizePreviewCanvas should set new canvas size', () => {
        service['resizePreviewCanvas']();

        expect(service['previewCtx'].canvas.width).toBe(service['previewWidth']);
        expect(service['previewCtx'].canvas.height).toBe(service['previewHeight']);
    });
});
