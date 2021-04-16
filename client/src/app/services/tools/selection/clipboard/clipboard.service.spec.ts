import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import * as ToolManagerConstants from '@app/constants/tool-manager-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SegmentIntersectionService } from '@app/services/helper/segment-intersection.service';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';
import { EllipseService } from '@app/services/tools/ellipse/ellipse-service';
import { LineService } from '@app/services/tools/line/line-service';
import { RectangleService } from '@app/services/tools/rectangle/rectangle-service';
import { ClipboardService } from '@app/services/tools/selection/clipboard/clipboard.service';
import { EllipseSelectionService } from '@app/services/tools/selection/ellipse/ellipse-selection-service';
import { LassoSelectionService } from '@app/services/tools/selection/lasso/lasso-selection';
import { RectangleSelectionService } from '@app/services/tools/selection/rectangle/rectangle-selection-service';
import { ResizerHandlerService } from '@app/services/tools/selection/resizer/resizer-handler.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

describe('ClipboardService', () => {
    let service: ClipboardService;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let toolManagerService: ToolManagerService;
    let canvasTestHelper: CanvasTestHelper;
    let rectangleSelectionServiceStub: RectangleSelectionService;
    let ellipseSelectionServiceStub: EllipseSelectionService;
    let lassoSelectionServiceStub: LassoSelectionService;
    let undoRedoServiceSpy: jasmine.SpyObj<UndoRedoService>;
    let resizerHandlerServiceSpy: jasmine.SpyObj<ResizerHandlerService>;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj(
            'DrawingService',
            ['clearCanvas'],
            ['baseCtx', 'selectionCtx', 'borderCtx', 'selectionCanvas', 'previewSelectionCanvas', 'borderCanvas'],
        );
        resizerHandlerServiceSpy = jasmine.createSpyObj('ResizerHandlerService', ['setResizerPositions', 'resetResizers']);
        undoRedoServiceSpy = jasmine.createSpyObj('UndoRedoService', ['executeCommand']);

        rectangleSelectionServiceStub = new RectangleSelectionService(
            drawServiceSpy,
            undoRedoServiceSpy,
            resizerHandlerServiceSpy,
            new RectangleService(drawServiceSpy, undoRedoServiceSpy),
        );
        spyOn(rectangleSelectionServiceStub, 'resetSelectedToolSettings');

        ellipseSelectionServiceStub = new EllipseSelectionService(
            drawServiceSpy,
            undoRedoServiceSpy,
            resizerHandlerServiceSpy,
            new EllipseService(drawServiceSpy, undoRedoServiceSpy),
        );
        spyOn(ellipseSelectionServiceStub, 'resetSelectedToolSettings');

        lassoSelectionServiceStub = new LassoSelectionService(
            drawServiceSpy,
            undoRedoServiceSpy,
            resizerHandlerServiceSpy,
            new SegmentIntersectionService(),
            new LineService(drawServiceSpy, undoRedoServiceSpy),
        );
        spyOn(lassoSelectionServiceStub, 'resetSelectedToolSettings');
        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: ResizerHandlerService, useValue: resizerHandlerServiceSpy },
                { provide: RectangleSelectionService, useValue: rectangleSelectionServiceStub },
                { provide: EllipseSelectionService, useValue: ellipseSelectionServiceStub },
                { provide: UndoRedoService, useValue: undoRedoServiceSpy },
            ],
        });

        canvasTestHelper = TestBed.inject(CanvasTestHelper);

        service = TestBed.inject(ClipboardService);
        toolManagerService = TestBed.inject(ToolManagerService);

        service.currentTool = rectangleSelectionServiceStub;
        (Object.getOwnPropertyDescriptor(drawServiceSpy, 'baseCtx')?.get as jasmine.Spy<() => CanvasRenderingContext2D>).and.returnValue(
            canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D,
        );
        (Object.getOwnPropertyDescriptor(drawServiceSpy, 'selectionCtx')?.get as jasmine.Spy<() => CanvasRenderingContext2D>).and.returnValue(
            canvasTestHelper.selectionCanvas.getContext('2d') as CanvasRenderingContext2D,
        );
        (Object.getOwnPropertyDescriptor(drawServiceSpy, 'borderCtx')?.get as jasmine.Spy<() => CanvasRenderingContext2D>).and.returnValue(
            canvasTestHelper.borderCanvas.getContext('2d') as CanvasRenderingContext2D,
        );
        (Object.getOwnPropertyDescriptor(drawServiceSpy, 'selectionCanvas')?.get as jasmine.Spy<() => HTMLCanvasElement>).and.returnValue(
            canvasTestHelper.selectionCanvas as HTMLCanvasElement,
        );
        (Object.getOwnPropertyDescriptor(drawServiceSpy, 'previewSelectionCanvas')?.get as jasmine.Spy<() => HTMLCanvasElement>).and.returnValue(
            canvasTestHelper.previewSelectionCanvas as HTMLCanvasElement,
        );
        (Object.getOwnPropertyDescriptor(drawServiceSpy, 'borderCanvas')?.get as jasmine.Spy<() => HTMLCanvasElement>).and.returnValue(
            canvasTestHelper.borderCanvas as HTMLCanvasElement,
        );
    });

    it('currenttool should change to Rectangle if toolManagers subject changes', () => {
        toolManagerService.currentToolSubject.next(rectangleSelectionServiceStub);
        expect(service.currentTool).toBeInstanceOf(RectangleSelectionService);
        expect(service.currentTool).toEqual(rectangleSelectionServiceStub);
    });

    it('currenttool should change to Ellipse if toolManagers subject changes', () => {
        toolManagerService.currentToolSubject.next(ellipseSelectionServiceStub);
        expect(service.currentTool).toBeInstanceOf(EllipseSelectionService);
        expect(service.currentTool).toEqual(ellipseSelectionServiceStub);
    });

    it('currenttool should change to Lasso if toolManagers subject changes', () => {
        toolManagerService.currentToolSubject.next(lassoSelectionServiceStub);
        expect(service.currentTool).toBeInstanceOf(LassoSelectionService);
        expect(service.currentTool).toEqual(lassoSelectionServiceStub);
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
        const selectionCtxgetImageDataSpy = spyOn(drawServiceSpy.selectionCtx, 'getImageData').and.callThrough();
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
        // initializing clipboard with random values, or else data is empty
        for (let i = 0; i < service.clipboard.data.length; ++i) {
            service.clipboard.data[i] = 1;
        }

        const confirmSelectionSpy = spyOn(service.currentTool, 'confirmSelection').and.callThrough();
        service.pasteSelection();
        expect(confirmSelectionSpy).toHaveBeenCalled();
    });

    it('pasteSelection changes to selection tool used during copy', () => {
        for (let i = 0; i < service.clipboard.data.length; ++i) {
            service.clipboard.data[i] = 1;
        }
        const selectToolSpy = spyOn(toolManagerService, 'selectTool').and.callThrough();
        service.pasteSelection();
        expect(selectToolSpy).toHaveBeenCalled();
    });

    it('pasteSelection pastes clipboard data to moved selection canvas', () => {
        for (let i = 0; i < service.clipboard.data.length; ++i) {
            service.clipboard.data[i] = 1;
        }
        const putImageDataSpy = spyOn(drawServiceSpy.selectionCtx, 'putImageData').and.callThrough();
        service.pasteSelection();
        expect(putImageDataSpy).toHaveBeenCalled();
    });

    it('pasteSelection moves selection canvas to corner of drawing canvas', () => {
        for (let i = 0; i < service.clipboard.data.length; ++i) {
            service.clipboard.data[i] = 1;
        }
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

    it('pasteSelection moves resizers along with selection canvas', () => {
        for (let i = 0; i < service.clipboard.data.length; ++i) {
            service.clipboard.data[i] = 1;
        }
        service.pasteSelection();
        expect(resizerHandlerServiceSpy.setResizerPositions).toHaveBeenCalled();
    });

    it('pasteSelection does nothing if clipboard is empty ', () => {
        const putImageDataSpy = spyOn(drawServiceSpy.selectionCtx, 'putImageData').and.callThrough();
        const someSpy = spyOn(service.clipboard.data, 'some').and.returnValue(false);
        service.pasteSelection();
        expect(someSpy).toHaveBeenCalled();
        expect(putImageDataSpy).not.toHaveBeenCalled();
    });

    it('pasteSelection doesnt undo if theres no active selection', () => {
        for (let i = 0; i < service.clipboard.data.length; ++i) {
            service.clipboard.data[i] = 1;
        }
        canvasTestHelper.selectionCanvas.width = 0;
        canvasTestHelper.selectionCanvas.height = 0;
        const mouseDownSpy = spyOn(service.currentTool, 'onMouseDown').and.callThrough();
        service.pasteSelection();
        expect(mouseDownSpy).not.toHaveBeenCalled();
    });

    it('deleteSelection undoes active selection', () => {
        service.deleteSelection();
        expect(service.currentTool.isManipulating).toBeFalse();
        expect(service.currentTool.isEscapeDown).toBeFalse();
    });

    it('deleteSelection fills active selection using EllipseClipboardCommand ', () => {
        service.currentTool = ellipseSelectionServiceStub;
        canvasTestHelper.selectionCanvas.width = 1;
        canvasTestHelper.selectionCanvas.height = 1;
        service.deleteSelection();
        expect(service.isCircle).toEqual(service.currentTool.isCircle);
        expect(undoRedoServiceSpy.executeCommand).toHaveBeenCalled();
    });

    it('deleteSelection fills active selection using RectangleClipboardCommand', () => {
        canvasTestHelper.selectionCanvas.width = 1;
        canvasTestHelper.selectionCanvas.height = 1;
        service.deleteSelection();
        expect(service.selectionHeight).toEqual(service.currentTool.selectionHeight);
        expect(service.selectionWidth).toEqual(service.currentTool.selectionWidth);
        expect(undoRedoServiceSpy.executeCommand).toHaveBeenCalled();
    });

    it('deleteSelection fills active selection using LassoClipboardCommand', () => {
        service.currentTool = lassoSelectionServiceStub;
        canvasTestHelper.selectionCanvas.width = 1;
        canvasTestHelper.selectionCanvas.height = 1;
        service.deleteSelection();
        expect(service.selectionHeight).toEqual(service.currentTool.selectionHeight);
        expect(service.selectionWidth).toEqual(service.currentTool.selectionWidth);
        expect(undoRedoServiceSpy.executeCommand).toHaveBeenCalled();
    });

    it('deleteSelection does nothing when there is no active selection ', () => {
        canvasTestHelper.selectionCanvas.width = 0;
        canvasTestHelper.selectionCanvas.height = 0;
        service.deleteSelection();
        expect(undoRedoServiceSpy.executeCommand).not.toHaveBeenCalled();
    });

    it('cutSelection calls copy and delete selection', () => {
        const copySelectionSpy = spyOn(service, 'copySelection');
        const deleteSelectionSpy = spyOn(service, 'deleteSelection');
        service.cutSelection();
        expect(copySelectionSpy).toHaveBeenCalled();
        expect(deleteSelectionSpy).toHaveBeenCalled();
    });

    it('copySelection should save last selection tool (ellipse)', () => {
        service.currentTool = ellipseSelectionServiceStub;
        service.copySelection();
        expect(service.lastSelectionTool).toEqual(ToolManagerConstants.ELLIPSE_SELECTION_KEY);
    });

    it('copySelection should save last selection tool (rectangle)', () => {
        service.currentTool = rectangleSelectionServiceStub;
        service.copySelection();
        expect(service.lastSelectionTool).toEqual(ToolManagerConstants.RECTANGLE_SELECTION_KEY);
    });

    it('getCurrentSelectionToolName should return correct name with Lasso', () => {
        service.currentTool = lassoSelectionServiceStub;
        // tslint:disable:no-string-literal
        const result = service['getCurrentSelectionToolName']();
        expect(result).toEqual(ToolManagerConstants.LASSO_SELECTION_KEY);
    });
});
