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
    let baseCtxDrawImageSpy: jasmine.Spy<any>;
    let previewCtxDrawImageSpy: jasmine.Spy<any>;

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
        baseCtxDrawImageSpy = spyOn<any>(service['drawingService'].baseCtx, 'drawImage').and.callThrough();
        previewCtxDrawImageSpy = spyOn<any>(service['drawingService'].previewCtx, 'drawImage').and.callThrough();
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

    // Test: expandCanvas() with sideResizer
    // Cases:
    // 1. Resize left
    // 2. Resize right

    it('should change canvas width bigger on expandCanvas call', () => {
        const oldCanvasWidth = 300;
        const newCanvasWidth = 400;
        service.isSideResizerDown = true;
        service.baseCtx.canvas.width = oldCanvasWidth;
        service.previewCanvasSize.x = newCanvasWidth;

        service.expandCanvas(cdkDragEndEvent);

        expect(service.baseCtx.canvas.width).toEqual(newCanvasWidth);
        expect(service.sideResizer.nativeElement.style.left).toEqual(newCanvasWidth + 'px');
        expect(service.isSideResizerDown).toEqual(false);
    });

    it('should make canvas width smaller on expandCanvas call', () => {
        const oldCanvasWidth = 400;
        const newCanvasWidth = 250;
        service.isSideResizerDown = true;
        service.baseCtx.canvas.width = oldCanvasWidth;
        service.previewCanvasSize.x = newCanvasWidth;

        service.expandCanvas(cdkDragEndEvent);

        expect(service.baseCtx.canvas.width).toEqual(newCanvasWidth);
        expect(service.sideResizer.nativeElement.style.left).toEqual(newCanvasWidth + 'px');
        expect(service.isSideResizerDown).toBeFalsy();
    });

    // Test: expandCanvas() on height
    // Cases:
    // 1. Making canvas smaller by resizing upwards
    // 2. Making canvas larger by resizing downwards

    it('should make canvas height bigger on expandCanvas call', () => {
        const oldCanvasHeight = 400;
        const newCanvasHeight = 650;
        service.isBottomResizerDown = true;
        service.baseCtx.canvas.height = oldCanvasHeight;
        service.previewCanvasSize.y = newCanvasHeight;

        service.expandCanvas(cdkDragEndEvent);

        expect(service.baseCtx.canvas.height).toEqual(newCanvasHeight);
        expect(service.bottomResizer.nativeElement.style.top).toEqual(newCanvasHeight + 'px');
        expect(service.isBottomResizerDown).toBeFalsy();
    });

    it('should make canvas height smaller on expandCanvas call', () => {
        const oldCanvasHeight = 400;
        const newCanvasHeight = 250;
        service.isBottomResizerDown = true;
        service.baseCtx.canvas.height = oldCanvasHeight;
        service.previewCanvasSize.y = newCanvasHeight;

        service.expandCanvas(cdkDragEndEvent);

        expect(service.baseCtx.canvas.height).toEqual(newCanvasHeight);
        expect(service.bottomResizer.nativeElement.style.top).toEqual(newCanvasHeight + 'px');
        expect(service.isBottomResizerDown).toEqual(false);
    });

    // Test: expandCanvas() on CornerResizer
    // Cases:
    // 1. +dx, +dy
    // 2. +dx, -dy
    // 3. -dx, +dy
    // 4. -dx, -dy

    it('should make canvas height and width bigger on expandCanvas call', () => {
        const oldCanvasWidth = 500;
        const oldCanvasHeight = 500;
        const newCanvasWidth = 750;
        const newCanvasHeight = 800;

        service.isCornerResizerDown = true;
        service.baseCtx.canvas.width = oldCanvasWidth;
        service.baseCtx.canvas.height = oldCanvasHeight;
        service.previewCanvasSize.x = newCanvasWidth;
        service.previewCanvasSize.y = newCanvasHeight;

        service.expandCanvas(cdkDragEndEvent);

        expect(service.cornerResizer.nativeElement.style.left).toEqual(newCanvasWidth + 'px');
        expect(service.cornerResizer.nativeElement.style.top).toEqual(newCanvasHeight + 'px');
        expect(service.baseCtx.canvas.width).toEqual(newCanvasWidth);
        expect(service.baseCtx.canvas.height).toEqual(newCanvasHeight);
        expect(service.isCornerResizerDown).toBeFalsy();
    });

    it('should make canvas height bigger and width smaller on expandCanvas call', () => {
        const oldCanvasWidth = 500;
        const oldCanvasHeight = 500;
        const newCanvasWidth = 750;
        const newCanvasHeight = 350;

        service.isCornerResizerDown = true;
        service.baseCtx.canvas.width = oldCanvasWidth;
        service.baseCtx.canvas.height = oldCanvasHeight;
        service.previewCanvasSize.x = newCanvasWidth;
        service.previewCanvasSize.y = newCanvasHeight;

        service.expandCanvas(cdkDragEndEvent);

        expect(service.cornerResizer.nativeElement.style.left).toEqual(newCanvasWidth + 'px');
        expect(service.cornerResizer.nativeElement.style.top).toEqual(newCanvasHeight + 'px');
        expect(service.baseCtx.canvas.width).toEqual(newCanvasWidth);
        expect(service.baseCtx.canvas.height).toEqual(newCanvasHeight);
        expect(service.isCornerResizerDown).toBeFalsy();
    });

    it('should make canvas height smaller and width bigger on expandCanvas call', () => {
        const oldCanvasWidth = 500;
        const oldCanvasHeight = 500;
        const newCanvasWidth = 350;
        const newCanvasHeight = 850;

        service.isCornerResizerDown = true;
        service.baseCtx.canvas.width = oldCanvasWidth;
        service.baseCtx.canvas.height = oldCanvasHeight;
        service.previewCanvasSize.x = newCanvasWidth;
        service.previewCanvasSize.y = newCanvasHeight;

        service.expandCanvas(cdkDragEndEvent);

        expect(service.cornerResizer.nativeElement.style.left).toEqual(newCanvasWidth + 'px');
        expect(service.cornerResizer.nativeElement.style.top).toEqual(newCanvasHeight + 'px');
        expect(service.baseCtx.canvas.width).toEqual(newCanvasWidth);
        expect(service.baseCtx.canvas.height).toEqual(newCanvasHeight);
        expect(service.isCornerResizerDown).toBeFalsy();
    });

    it('should make canvas height smaller and width smaller on expandCanvas call', () => {
        const oldCanvasWidth = 500;
        const oldCanvasHeight = 500;
        const newCanvasWidth = 350;
        const newCanvasHeight = 280;

        service.isCornerResizerDown = true;
        service.baseCtx.canvas.width = oldCanvasWidth;
        service.baseCtx.canvas.height = oldCanvasHeight;
        service.previewCanvasSize.x = newCanvasWidth;
        service.previewCanvasSize.y = newCanvasHeight;

        service.expandCanvas(cdkDragEndEvent);

        expect(service.cornerResizer.nativeElement.style.left).toEqual(newCanvasWidth + 'px');
        expect(service.cornerResizer.nativeElement.style.top).toEqual(newCanvasHeight + 'px');
        expect(service.baseCtx.canvas.width).toEqual(newCanvasWidth);
        expect(service.baseCtx.canvas.height).toEqual(newCanvasHeight);
        expect(service.isCornerResizerDown).toBeFalsy();
    });

    it('when expanding canvas, full drawing that was on old canvas should be saved', () => {
        const oldCanvasWidth = 500;
        const oldCanvasHeight = 500;
        const newCanvasWidth = 950;
        const newCanvasHeight = 750;

        service.isCornerResizerDown = true;
        service.baseCtx.canvas.width = oldCanvasWidth;
        service.baseCtx.canvas.height = oldCanvasHeight;
        service.previewCanvasSize.x = newCanvasWidth;
        service.previewCanvasSize.y = newCanvasHeight;

        service.expandCanvas(cdkDragEndEvent);

        expect(previewCtxDrawImageSpy).toHaveBeenCalledWith(service.baseCtx.canvas, 0, 0);
        expect(baseCtxDrawImageSpy).toHaveBeenCalledWith(service.previewCtx.canvas, 0, 0);
    });

    it('when making canvas smaller, drawing on old canvas should be saved', () => {
        const oldCanvasWidth = 500;
        const oldCanvasHeight = 500;
        const newCanvasWidth = 350;
        const newCanvasHeight = 350;

        service.isCornerResizerDown = true;
        service.baseCtx.canvas.width = oldCanvasWidth;
        service.baseCtx.canvas.height = oldCanvasHeight;
        service.previewCanvasSize.x = newCanvasWidth;
        service.previewCanvasSize.y = newCanvasHeight;

        service.expandCanvas(cdkDragEndEvent);

        expect(previewCtxDrawImageSpy).toHaveBeenCalledWith(service.baseCtx.canvas, 0, 0);
        expect(baseCtxDrawImageSpy).toHaveBeenCalledWith(service.previewCtx.canvas, 0, 0);
    });

    // Test: drawPreviewOfNewSize()
    // Cases:
    // 1. SideResizer: expanding sizes correctly and adjusts button correctly
    // 2. SideResizer: reducing sizes correctly and adjusts buttons correctly
    // 3. BottomResizer: expanding ...
    // 4. BottomResizer: reducing ...
    // 5. CornerResizer: +dx, +dy
    // 6. CornerResizer: +dx, -dy
    // 7. CornerResizer: -dx, +dy
    // 7. CornerResizer: -dx, -dy

    it('drawPreviewOfNewSize of bigger canvas on sideResizer sets buttons and previewCanvas to correct size', () => {
        service.isSideResizerDown = true;
        const newCanvasWidth = 1500;
        const mousePositionY = 400;
        const event = {
            pointerPosition: {
                x: newCanvasWidth,
                y: mousePositionY,
            },
        } as CdkDragMove;
        service.drawPreviewOfNewSize(event);
        expect(service.previewCanvasSize.x).toEqual(newCanvasWidth);
        expect(service.cornerResizer.nativeElement.style.left).toEqual(newCanvasWidth + 'px');
        expect(service.sideResizer.nativeElement.style.left).toEqual(newCanvasWidth + 'px');
        expect(service.bottomResizer.nativeElement.style.left).toEqual(newCanvasWidth / 2 + 'px');
        expect(service.sideResizer.nativeElement.style.transform).toEqual('');
    });

    it('drawPreviewOfNewSize of smaller canvas on sideResizer sets buttons and previewCanvas to correct size', () => {
        service.isSideResizerDown = true;
        const newCanvasWidth = 600;
        const mousePositionY = 400;
        const event = {
            pointerPosition: {
                x: newCanvasWidth,
                y: mousePositionY,
            },
        } as CdkDragMove;
        service.drawPreviewOfNewSize(event);
        expect(service.previewCanvasSize.x).toEqual(newCanvasWidth);
        expect(service.cornerResizer.nativeElement.style.left).toEqual(newCanvasWidth + 'px');
        expect(service.sideResizer.nativeElement.style.left).toEqual(newCanvasWidth + 'px');
        expect(service.bottomResizer.nativeElement.style.left).toEqual(newCanvasWidth / 2 + 'px');
        expect(service.sideResizer.nativeElement.style.transform).toEqual('');
    });

    it('drawPreviewOfNewSize of bigger canvas on bottomResizer sets buttons and previewCanvas to correct size', () => {
        service.isBottomResizerDown = true;
        const mousePositionX = 500;
        const newCanvasHeight = 1200;
        const event = {
            pointerPosition: {
                x: mousePositionX,
                y: newCanvasHeight,
            },
        } as CdkDragMove;
        service.drawPreviewOfNewSize(event);
        expect(service.previewCanvasSize.y).toEqual(newCanvasHeight);
        expect(service.cornerResizer.nativeElement.style.top).toEqual(newCanvasHeight + 'px');
        expect(service.sideResizer.nativeElement.style.top).toEqual(newCanvasHeight / 2 + 'px');
        expect(service.bottomResizer.nativeElement.style.top).toEqual(newCanvasHeight + 'px');
        expect(service.bottomResizer.nativeElement.style.transform).toEqual('');
    });

    it('drawPreviewOfNewSize of smaller canvas on bottomResizer sets buttons and previewCanvas to correct size', () => {
        service.isBottomResizerDown = true;
        const mousePositionX = 500;
        const newCanvasHeight = 300;
        const event = {
            pointerPosition: {
                x: mousePositionX,
                y: newCanvasHeight,
            },
        } as CdkDragMove;
        service.drawPreviewOfNewSize(event);
        expect(service.previewCanvasSize.y).toEqual(newCanvasHeight);
        expect(service.cornerResizer.nativeElement.style.top).toEqual(newCanvasHeight + 'px');
        expect(service.sideResizer.nativeElement.style.top).toEqual(newCanvasHeight / 2 + 'px');
        expect(service.bottomResizer.nativeElement.style.top).toEqual(newCanvasHeight + 'px');
        expect(service.bottomResizer.nativeElement.style.transform).toEqual('');
    });

    it('drawPreviewOfNewSize of +dx, +dy canvas on cornerResizer sets buttons and previewCanvas to correct size', () => {
        service.isCornerResizerDown = true;
        const newCanvasWidth = 1500;
        const newCanvasHeight = 1050;
        const event = {
            pointerPosition: {
                x: newCanvasWidth,
                y: newCanvasHeight,
            },
        } as CdkDragMove;

        service.drawPreviewOfNewSize(event);

        expect(service.previewCanvasSize.x).toEqual(newCanvasWidth);
        expect(service.previewCanvasSize.y).toEqual(newCanvasHeight);
        expect(service.cornerResizer.nativeElement.style.left).toEqual(newCanvasWidth + 'px');
        expect(service.cornerResizer.nativeElement.style.top).toEqual(newCanvasHeight + 'px');
        expect(service.sideResizer.nativeElement.style.left).toEqual(newCanvasWidth + 'px');
        expect(service.sideResizer.nativeElement.style.top).toEqual(newCanvasHeight / 2 + 'px');
        expect(service.bottomResizer.nativeElement.style.left).toEqual(newCanvasWidth / 2 + 'px');
        expect(service.bottomResizer.nativeElement.style.top).toEqual(newCanvasHeight + 'px');
        expect(service.cornerResizer.nativeElement.style.transform).toEqual('');
    });

    it('drawPreviewOfNewSize of +dx, -dy canvas on cornerResizer sets buttons and previewCanvas to correct size', () => {
        service.isCornerResizerDown = true;
        const newCanvasWidth = 1500;
        const newCanvasHeight = 400;
        const event = {
            pointerPosition: {
                x: newCanvasWidth,
                y: newCanvasHeight,
            },
        } as CdkDragMove;

        service.drawPreviewOfNewSize(event);

        expect(service.previewCanvasSize.x).toEqual(newCanvasWidth);
        expect(service.previewCanvasSize.y).toEqual(newCanvasHeight);
        expect(service.cornerResizer.nativeElement.style.left).toEqual(newCanvasWidth + 'px');
        expect(service.cornerResizer.nativeElement.style.top).toEqual(newCanvasHeight + 'px');
        expect(service.sideResizer.nativeElement.style.left).toEqual(newCanvasWidth + 'px');
        expect(service.sideResizer.nativeElement.style.top).toEqual(newCanvasHeight / 2 + 'px');
        expect(service.bottomResizer.nativeElement.style.left).toEqual(newCanvasWidth / 2 + 'px');
        expect(service.bottomResizer.nativeElement.style.top).toEqual(newCanvasHeight + 'px');
        expect(service.cornerResizer.nativeElement.style.transform).toEqual('');
    });

    it('drawPreviewOfNewSize of -dx, +dy canvas on cornerResizer sets buttons and previewCanvas to correct size', () => {
        service.isCornerResizerDown = true;
        const newCanvasWidth = 500;
        const newCanvasHeight = 1200;
        const event = {
            pointerPosition: {
                x: newCanvasWidth,
                y: newCanvasHeight,
            },
        } as CdkDragMove;

        service.drawPreviewOfNewSize(event);

        expect(service.previewCanvasSize.x).toEqual(newCanvasWidth);
        expect(service.previewCanvasSize.y).toEqual(newCanvasHeight);
        expect(service.cornerResizer.nativeElement.style.left).toEqual(newCanvasWidth + 'px');
        expect(service.cornerResizer.nativeElement.style.top).toEqual(newCanvasHeight + 'px');
        expect(service.sideResizer.nativeElement.style.left).toEqual(newCanvasWidth + 'px');
        expect(service.sideResizer.nativeElement.style.top).toEqual(newCanvasHeight / 2 + 'px');
        expect(service.bottomResizer.nativeElement.style.left).toEqual(newCanvasWidth / 2 + 'px');
        expect(service.bottomResizer.nativeElement.style.top).toEqual(newCanvasHeight + 'px');
        expect(service.cornerResizer.nativeElement.style.transform).toEqual('');
    });

    it('drawPreviewOfNewSize of -dx, -dy canvas on cornerResizer sets buttons and previewCanvas to correct size', () => {
        service.isCornerResizerDown = true;
        const newCanvasWidth = 500;
        const newCanvasHeight = 400;
        const event = {
            pointerPosition: {
                x: newCanvasWidth,
                y: newCanvasHeight,
            },
        } as CdkDragMove;

        service.drawPreviewOfNewSize(event);

        expect(service.previewCanvasSize.x).toEqual(newCanvasWidth);
        expect(service.previewCanvasSize.y).toEqual(newCanvasHeight);
        expect(service.cornerResizer.nativeElement.style.left).toEqual(newCanvasWidth + 'px');
        expect(service.cornerResizer.nativeElement.style.top).toEqual(newCanvasHeight + 'px');
        expect(service.sideResizer.nativeElement.style.left).toEqual(newCanvasWidth + 'px');
        expect(service.sideResizer.nativeElement.style.top).toEqual(newCanvasHeight / 2 + 'px');
        expect(service.bottomResizer.nativeElement.style.left).toEqual(newCanvasWidth / 2 + 'px');
        expect(service.bottomResizer.nativeElement.style.top).toEqual(newCanvasHeight + 'px');
        expect(service.cornerResizer.nativeElement.style.transform).toEqual('');
    });

    it('if cdkDragMove is triggered, with no resizer button clicked, drawPreviewOfNewSize should do nothing', () => {
        const event = {} as CdkDragMove;
        event.pointerPosition = { x: 25, y: 45 };
        expect((): void => {
            service.drawPreviewOfNewSize(event);
        }).not.toThrow();
    });

    it('if expandCanvas is triggered with no buttons, function should not throw', () => {
        expect((): void => {
            service.expandCanvas(cdkDragEndEvent);
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
