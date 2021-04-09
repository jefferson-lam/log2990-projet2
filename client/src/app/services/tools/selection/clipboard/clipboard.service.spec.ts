import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import * as ToolManagerConstants from '@app/constants/tool-manager-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';
import { EllipseSelectionService } from '../ellipse/ellipse-selection-service';
import { RectangleSelectionService } from '../rectangle/rectangle-selection-service';
import { ClipboardService } from './clipboard.service';

describe('ClipboardService', () => {
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

        service.currentTool = rectangleSelectionService;
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].selectionCtx = selectionCtxStub;
        service['drawingService'].selectionCanvas = canvasTestHelper.selectionCanvas;
        service['drawingService'].previewSelectionCanvas = canvasTestHelper.previewSelectionCanvas;
    });

    it('currenttool should change to Rectangle if toolManagers subject changes', () => {
        toolManagerService.currentToolSubject.next(rectangleSelectionService);
        expect(service.currentTool).toBeInstanceOf(RectangleSelectionService);
        expect(service.currentTool).toEqual(rectangleSelectionService);
    });

    it('currenttool should change to Ellipse if toolManagers subject changes', () => {
        toolManagerService.currentToolSubject.next(ellipseSelectionService);
        expect(service.currentTool).toBeInstanceOf(EllipseSelectionService);
        expect(service.currentTool).toEqual(ellipseSelectionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('copySelection should not do anything if selection is empty', () => {
        canvasTestHelper.selectionCanvas.width = 0;
        canvasTestHelper.selectionCanvas.height = 0;
        service.copySelection();
        expect(service.clipboard).toEqual(new ImageData(1, 1));
    });

    it('copySelection should copy selection data to clipboard', () => {
        const selectionCtxgetImageDataSpy = spyOn(selectionCtxStub, 'getImageData').and.callThrough();
        service.copySelection();
        expect(selectionCtxgetImageDataSpy).toHaveBeenCalled();
        expect(selectionCtxgetImageDataSpy).toHaveBeenCalledWith(
            0,
            0,
            canvasTestHelper.selectionCanvas.width,
            canvasTestHelper.selectionCanvas.width,
        );
        expect(service.clipboard).not.toBe(new ImageData(1, 1));
        expect(service.currentTool).toBeInstanceOf(RectangleSelectionService);
    });

    it('pasteSelection annuls selection if active ', () => {
        // to initialize clipboard, or else data is empty
        service.clipboard.data[0] = 255;
        service.clipboard.data[1] = 255;
        service.clipboard.data[2] = 255;
        service.clipboard.data[3] = 255;
        const mouseDownSpy = spyOn(service.currentTool, 'onMouseDown').and.callThrough();
        service.pasteSelection();
        expect(mouseDownSpy).toHaveBeenCalled();
    });

    it('pasteSelection changes to selection tool used during copy', () => {
        service.clipboard.data[0] = 255;
        service.clipboard.data[1] = 255;
        service.clipboard.data[2] = 255;
        service.clipboard.data[3] = 255;
        const selectToolSpy = spyOn(toolManagerService, 'selectTool').and.callThrough();
        service.pasteSelection();
        expect(selectToolSpy).toHaveBeenCalled();
    });

    it('pasteSelection pastes clipboard data to moved selection canvas', () => {
        service.clipboard.data[0] = 255;
        service.clipboard.data[1] = 255;
        service.clipboard.data[2] = 255;
        service.clipboard.data[3] = 255;
        const putImageDataSpy = spyOn(selectionCtxStub, 'putImageData').and.callThrough();
        service.pasteSelection();
        expect(putImageDataSpy).toHaveBeenCalled();
    });

    it('pasteSelection moves selection canvas to corner of drawing canvas', () => {
        service.clipboard.data[0] = 255;
        service.clipboard.data[1] = 255;
        service.clipboard.data[2] = 255;
        service.clipboard.data[3] = 255;
        service.pasteSelection();
        expect(canvasTestHelper.selectionCanvas.height).toEqual(service.clipboard.height);
        expect(canvasTestHelper.selectionCanvas.width).toEqual(service.clipboard.width);
        expect(canvasTestHelper.selectionCanvas.style.left).toEqual('0px');
        expect(canvasTestHelper.selectionCanvas.style.top).toEqual('0px');

        expect(canvasTestHelper.previewSelectionCanvas.height).toEqual(service.clipboard.height);
        expect(canvasTestHelper.previewSelectionCanvas.width).toEqual(service.clipboard.width);
        expect(canvasTestHelper.previewSelectionCanvas.style.left).toEqual('0px');
        expect(canvasTestHelper.previewSelectionCanvas.style.top).toEqual('0px');
    });

    it('pasteSelection does nothing if clipboard is empty ', () => {
        const putImageDataSpy = spyOn(selectionCtxStub, 'putImageData').and.callThrough();
        const someSpy = spyOn(service.clipboard.data, 'some').and.returnValue(false);
        service.pasteSelection();
        expect(someSpy).toHaveBeenCalled();
        expect(putImageDataSpy).not.toHaveBeenCalled();
    });

    it('pasteSelection doesnt undo if theres no active selection', () => {
        service.clipboard.data[0] = 255;
        service.clipboard.data[1] = 255;
        service.clipboard.data[2] = 255;
        service.clipboard.data[3] = 255;
        canvasTestHelper.selectionCanvas.width = 0;
        canvasTestHelper.selectionCanvas.height = 0;
        const mouseDownSpy = spyOn(service.currentTool, 'onMouseDown').and.callThrough();
        service.pasteSelection();
        expect(mouseDownSpy).not.toHaveBeenCalled();
    });

    it('deleteSelection fills active selection using RectangleSelectionService method ', () => {
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
        service.deleteSelection();
        expect(fillEllipseSpy).toHaveBeenCalled();
        expect(fillRectangleSpy).not.toHaveBeenCalled();
    });

    it('deleteSelection does nothing when there is no active selection ', () => {
        canvasTestHelper.selectionCanvas.width = 0;
        canvasTestHelper.selectionCanvas.height = 0;
        const fillEllipseSpy = spyOn(ellipseSelectionService, 'fillEllipse').and.callFake(() => {
            return;
        });
        const fillRectangleSpy = spyOn(rectangleSelectionService, 'fillRectangle').and.callFake(() => {
            return;
        });
        service.deleteSelection();
        expect(fillEllipseSpy).not.toHaveBeenCalled();
        expect(fillRectangleSpy).not.toHaveBeenCalled();
    });

    it('cutSelection calls copy and delete selection', () => {
        const copySelectionSpy = spyOn(service, 'copySelection');
        const deleteSelectionSpy = spyOn(service, 'deleteSelection');
        service.cutSelection();
        expect(copySelectionSpy).toHaveBeenCalled();
        expect(deleteSelectionSpy).toHaveBeenCalled();
    });

    it('copySelection should save last selection tool (ellipse)', () => {
        service.currentTool = ellipseSelectionService;
        service.copySelection();
        expect(service.lastSelectionTool).toEqual(ToolManagerConstants.ELLIPSE_SELECTION_KEY);
    });

    it('copySelection should save last selection tool (rectangle)', () => {
        service.currentTool = rectangleSelectionService;
        service.copySelection();
        expect(service.lastSelectionTool).toEqual(ToolManagerConstants.RECTANGLE_SELECTION_KEY);
    });
});
