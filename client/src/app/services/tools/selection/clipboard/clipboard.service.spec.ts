import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Tool } from '@app/classes/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';
import { Subject } from 'rxjs';
import { EllipseSelectionService } from '../ellipse/ellipse-selection-service';
import { RectangleSelectionService } from '../rectangle/rectangle-selection-service';
import { ClipboardService } from './clipboard.service';

fdescribe('ClipboardService', () => {
    let service: ClipboardService;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let toolManagerService: ToolManagerService;
    let canvasTestHelper: CanvasTestHelper;
    let baseCtxStub: CanvasRenderingContext2D;
    let selectionCtxStub: CanvasRenderingContext2D;
    let rectangleSelectionService: RectangleSelectionService;
    let ellipseSelectionService: EllipseSelectionService;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });

        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        selectionCtxStub = canvasTestHelper.selectionCanvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(ClipboardService);
        toolManagerService = TestBed.inject(ToolManagerService);
        rectangleSelectionService = TestBed.inject(RectangleSelectionService);
        ellipseSelectionService = TestBed.inject(EllipseSelectionService);

        toolManagerService.currentToolSubject = new Subject<Tool>();

        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].selectionCtx = selectionCtxStub;
        service['drawingService'].selectionCanvas = canvasTestHelper.selectionCanvas;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    // it('currentTool should change to rectangle selection tool if toolManager subject changes', () => {
    //     toolManagerService.currentToolSubject.next(rectangleSelectionService);
    //     expect(service.currentTool).toBeInstanceOf(RectangleSelectionService);
    // });

    it('copySelection should not do anything if selection is empty', () => {
        service.currentTool = rectangleSelectionService;
        canvasTestHelper.selectionCanvas.width = 0;
        canvasTestHelper.selectionCanvas.height = 0;
        service.copySelection();
        expect(service.clipboard).toEqual(new ImageData(1, 1));
    });

    it('copySelection should copy selection data to clipboard', () => {
        service.currentTool = rectangleSelectionService;
        canvasTestHelper.selectionCanvas.width = 1;
        canvasTestHelper.selectionCanvas.height = 1;
        const selectionCtxgetImageDataSpy = spyOn(selectionCtxStub, 'getImageData').and.callThrough();
        service.copySelection();
        expect(selectionCtxgetImageDataSpy).toHaveBeenCalled();
        expect(selectionCtxgetImageDataSpy).toHaveBeenCalledWith(
            0,
            0,
            canvasTestHelper.selectionCanvas.width,
            canvasTestHelper.selectionCanvas.width,
        );
        // const clipboardIsEmpty = service.clipboard.data.some((pixel) => pixel === 0);
        // expect(clipboardIsEmpty).toBeFalse();
        expect(service.clipboard).not.toBe(new ImageData(1, 1));
    });

    it('pasteSelection annuls selection if active ', () => {
        service.currentTool = rectangleSelectionService;
        const onKeyboardUpSpy = spyOn(service.currentTool, 'onKeyboardUp').and.callThrough();
        canvasTestHelper.selectionCanvas.width = 1;
        canvasTestHelper.selectionCanvas.height = 1;
        service.copySelection();
        service.pasteSelection();
        expect(onKeyboardUpSpy).toHaveBeenCalled();
        expect(canvasTestHelper.selectionCanvas.height).toEqual(service.clipboard.height);
    });

    it('deleteSelection fills active selection using RectangleSelectionService method ', () => {
        service.currentTool = rectangleSelectionService;
        const fillEllipseSpy = spyOn(ellipseSelectionService, 'fillEllipse').and.callFake(() => {
            return;
        });
        const fillRectangleSpy = spyOn(rectangleSelectionService, 'fillRectangle').and.callFake(() => {
            return;
        });
        canvasTestHelper.selectionCanvas.width = 1;
        canvasTestHelper.selectionCanvas.height = 1;
        service.deleteSelection();
        expect(fillEllipseSpy).not.toHaveBeenCalled();
        expect(fillRectangleSpy).toHaveBeenCalled();
    });

    it('deleteSelection fills active selection using EllipseSelectionService method ', () => {
        service.currentTool = ellipseSelectionService;
        const fillEllipseSpy = spyOn(ellipseSelectionService, 'fillEllipse').and.callFake(() => {
            return;
        });
        const fillRectangleSpy = spyOn(rectangleSelectionService, 'fillRectangle').and.callFake(() => {
            return;
        });
        // canvasTestHelper.selectionCanvas.width = 1;
        // canvasTestHelper.selectionCanvas.height = 1;
        service.deleteSelection();
        expect(fillEllipseSpy).toHaveBeenCalled();
        expect(fillRectangleSpy).not.toHaveBeenCalled();
    });
});
