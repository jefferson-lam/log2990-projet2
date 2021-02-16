import { CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import * as CanvasConstants from '@app/constants/canvas-constants';
import { DrawingService } from '../drawing/drawing.service';
import { CanvasResizerService } from './canvas-resizer-service';

export class MockElementRef extends ElementRef {
    nativeElement = {};
}

describe('CanvasResizerService', () => {
    let service: CanvasResizerService;
    let cdkDragEndEvent: CdkDragEnd;
    let canvasTestHelper: CanvasTestHelper;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let drawingSpy: jasmine.SpyObj<DrawingService>;

    beforeEach(() => {
        drawingSpy = jasmine.createSpyObj('drawingService', ['clearCanvas'], {});
        TestBed.configureTestingModule({
            declarations: [],
            providers: [
                { provide: DrawingService, useValue: drawingSpy },
                { provide: ElementRef, useClass: MockElementRef },
            ],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        service = TestBed.inject(CanvasResizerService);
        service.baseCtx = baseCtxStub;
        service.previewCtx = previewCtxStub;
        service.baseCtx.canvas.width = 20;
        service.baseCtx.canvas.height = 20;
        service.sideResizer = {
            nativeElement: jasmine.createSpyObj('nativeElement', ['style']),
        };
        service.cornerResizer = {
            nativeElement: jasmine.createSpyObj('nativeElement', ['style']),
        };
        service.bottomResizer = {
            nativeElement: jasmine.createSpyObj('nativeElement', ['style']),
        };
        service.previewCanvas = {
            nativeElement: jasmine.createSpyObj('nativeElement', ['style']),
        };
        // Configuration du spy du service
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('lockMinCanvasValue should set canvas height and width to minimum 250px', () => {
        service.previewCanvasSize.x = CanvasConstants.MIN_LENGTH_CANVAS;
        service.previewCanvasSize.y = CanvasConstants.MIN_HEIGHT_CANVAS;
        service.lockMinCanvasValue();
        expect(service.sideResizer.nativeElement.style.left).toEqual(250 + 'px');
        expect(service.cornerResizer.nativeElement.style.left).toEqual(250 + 'px');
        expect(service.cornerResizer.nativeElement.style.top).toEqual(250 + 'px');
        expect(service.bottomResizer.nativeElement.style.top).toEqual(250 + 'px');
    });

    it('lockMinCanvasValue should set canvas width to minimum 250px', () => {
        service.previewCanvasSize.x = CanvasConstants.MIN_LENGTH_CANVAS;
        service.previewCanvasSize.y = 400;
        service.lockMinCanvasValue();
        expect(service.sideResizer.nativeElement.style.left).toEqual(250 + 'px');
        expect(service.cornerResizer.nativeElement.style.left).toEqual(250 + 'px');
        expect(service.bottomResizer.nativeElement.style.left).toEqual(125 + 'px');
    });

    it('lockMinCanvasValue should set canvas height to minimum 250px', () => {
        service.previewCanvasSize.x = 400;
        service.previewCanvasSize.y = CanvasConstants.MIN_HEIGHT_CANVAS;
        service.lockMinCanvasValue();
        expect(service.sideResizer.nativeElement.style.top).toEqual(125 + 'px');
        expect(service.cornerResizer.nativeElement.style.top).toEqual(250 + 'px');
        expect(service.bottomResizer.nativeElement.style.top).toEqual(250 + 'px');
    });

    it('should change canvas height on expandCanvas call', () => {
        service.isSideResizerDown = true;
        service.canvasSize.x = 300;

        const imageData = baseCtxStub.createImageData(34, 34);
        service.newPreviewCanvasRef = imageData;
        const image = baseCtxStub.createImageData(45, 45);
        service.newBaseCanvasRef = image;
        service.baseCtx.putImageData(image, 45, 3);
        service.expandCanvas(cdkDragEndEvent);

        expect(service.sideResizer.nativeElement.style.left).toEqual(250 + 'px');
        expect(service.isSideResizerDown).toEqual(false);
    });

    it('should change canvas width on expandCanvas call', () => {
        service.isBottomResizerDown = true;
        service.canvasSize.y = 300;

        const imageData = baseCtxStub.createImageData(34, 34);
        service.newPreviewCanvasRef = imageData;
        const image = baseCtxStub.createImageData(45, 45);
        service.newBaseCanvasRef = image;
        service.baseCtx.putImageData(image, 45, 3);
        service.expandCanvas(cdkDragEndEvent);

        expect(service.bottomResizer.nativeElement.style.top).toEqual(250 + 'px');
        expect(service.isBottomResizerDown).toEqual(false);
    });

    it('should change canvas height and width on expandCanvas call', () => {
        service.newDrawingSaved = false;
        service.isCornerResizerDown = true;
        service.canvasSize.x = 300;
        service.canvasSize.y = 300;

        const imageData = baseCtxStub.createImageData(34, 34);
        service.newPreviewCanvasRef = imageData;
        const image = baseCtxStub.createImageData(45, 45);
        service.newBaseCanvasRef = image;
        service.baseCtx.putImageData(image, 45, 3);
        service.expandCanvas(cdkDragEndEvent);

        expect(service.cornerResizer.nativeElement.style.left).toEqual(250 + 'px');
        expect(service.cornerResizer.nativeElement.style.top).toEqual(250 + 'px');
        expect(service.isCornerResizerDown).toEqual(false);
        expect(service.newDrawingSaved).toEqual(true);
    });

    it('if cdkDragEnded is triggered, with no resizer button clicked, expandCanvas should not throw', () => {
        service.newDrawingSaved = false;
        service.canvasSize.x = 300;
        service.canvasSize.y = 300;
        const imageData = baseCtxStub.createImageData(34, 34);
        service.newPreviewCanvasRef = imageData;
        const image = baseCtxStub.createImageData(45, 45);
        service.newBaseCanvasRef = image;
        service.baseCtx.putImageData(image, 45, 3);

        expect((): void => {
            service.expandCanvas(cdkDragEndEvent);
        }).not.toThrow();
    });

    it('should call putDrawingOnBaseCanvas if condition is true', () => {
        service.newDrawingSaved = true;
        const imageData = baseCtxStub.createImageData(34, 34);
        service.newPreviewCanvasRef = imageData;
        const image = baseCtxStub.createImageData(45, 45);
        service.newPreviewCanvasRef = image;
        service.putDrawingOnBaseCanvas();
        expect(service.newDrawingSaved).toEqual(false);
    });

    it('should call saveDrawingOnPreviewCanvas if condition is false', () => {
        service.newDrawingSaved = false;
        const imageData = baseCtxStub.createImageData(34, 34);
        service.newPreviewCanvasRef = imageData;
        const image = baseCtxStub.createImageData(45, 45);
        service.newBaseCanvasRef = image;
        service.baseCtx.putImageData(image, 45, 3);
        service.saveDrawingOnPreviewCanvas();
        expect(service.newDrawingSaved).toEqual(true);
    });

    it('saveDrawingOnPreviewCanvas should not do anything if newDrawingSaved is true', () => {
        service.newDrawingSaved = true;
        expect((): void => {
            service.saveDrawingOnPreviewCanvas();
        }).not.toThrow();
    });

    it('should enter if statement on CdkDragMove if isSideResizerDown true', () => {
        service.isSideResizerDown = true;
        const image = baseCtxStub.createImageData(45, 45);
        service.baseCtx.putImageData(image, 45, 3);
        const event = {} as CdkDragMove;
        event.pointerPosition = { x: 25, y: 34 };
        service.drawPreviewOfNewSize(event);
        expect(service.sideResizer.nativeElement.style.transform).toEqual('');
    });

    it('should enter if statement on CdkDragMove if isCornerResizerDown true', () => {
        service.isCornerResizerDown = true;
        const image = baseCtxStub.createImageData(45, 45);
        service.baseCtx.putImageData(image, 45, 3);
        const event = {} as CdkDragMove;
        event.pointerPosition = { x: 0, y: 0 };
        service.drawPreviewOfNewSize(event);
        expect(service.cornerResizer.nativeElement.style.transform).toEqual('');
    });

    it('should enter if statement on CdkDragMove if isBottomResizerDown true', () => {
        service.isBottomResizerDown = true;
        const image = baseCtxStub.createImageData(45, 45);
        service.baseCtx.putImageData(image, 45, 3);
        const event = {} as CdkDragMove;
        event.pointerPosition = { x: 25, y: 34 };
        service.drawPreviewOfNewSize(event);
        expect(service.isBottomResizerDown).toEqual(true);
        expect(service.bottomResizer.nativeElement.style.transform).toEqual('');
    });

    it('if cdkDragMove is triggered, with no resizer button clicked, drawPreviewOfNewSize should do nothing', () => {
        const image = baseCtxStub.createImageData(45, 45);
        service.baseCtx.putImageData(image, 45, 3);
        const event = {} as CdkDragMove;
        event.pointerPosition = { x: 25, y: 45 };
        expect((): void => {
            service.drawPreviewOfNewSize(event);
        }).not.toThrow();
    });

    it('should return true if bottomSlider clicked', () => {
        service.onBottomResizerDown();
        expect(service.isBottomResizerDown).toEqual(true);
    });

    it('should return true if sideSlider clicked', () => {
        service.onSideResizerDown();
        expect(service.isSideResizerDown).toEqual(true);
    });

    it('should return true if cornerSlider clicked', () => {
        service.onCornerResizerDown();
        expect(service.isCornerResizerDown).toEqual(true);
    });
});
