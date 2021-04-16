import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/constants/mouse-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ResizerHandlerService } from '@app/services/tools/selection/resizer/resizer-handler.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { Subject } from 'rxjs';
import { LassoSelectionService } from './lasso-selection';

// tslint:disable:no-any
// tslint:disable:max-file-line-count
describe('LassoSelectionService', () => {
    let service: LassoSelectionService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let resizerHandlerServiceSpy: jasmine.SpyObj<ResizerHandlerService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let selectionCtxStub: CanvasRenderingContext2D;
    let previewSelectionCtxStub: CanvasRenderingContext2D;
    let borderCtxStub: CanvasRenderingContext2D;

    let executeSpy: jasmine.Spy;
    let undoRedoService: UndoRedoService;
    // let segmentIntersectionService: SegmentIntersectionService;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        resizerHandlerServiceSpy = jasmine.createSpyObj('ResizerHandlerService', ['resetResizers', 'setResizerPositions']);
        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: ResizerHandlerService, useValue: resizerHandlerServiceSpy },
            ],
        });
        service = TestBed.inject(LassoSelectionService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        undoRedoService = TestBed.inject(UndoRedoService);
        // segmentIntersectionService = TestBed.inject(SegmentIntersectionService);

        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        selectionCtxStub = canvasTestHelper.selectionCanvas.getContext('2d') as CanvasRenderingContext2D;
        previewSelectionCtxStub = canvasTestHelper.previewSelectionCanvas.getContext('2d') as CanvasRenderingContext2D;
        borderCtxStub = canvasTestHelper.borderCanvas.getContext('2d') as CanvasRenderingContext2D;

        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].selectionCtx = selectionCtxStub;
        service['drawingService'].previewSelectionCtx = previewSelectionCtxStub;
        service['drawingService'].borderCtx = borderCtxStub;

        service['drawingService'].selectionCanvas = canvasTestHelper.selectionCanvas;
        service['drawingService'].canvas = canvasTestHelper.canvas;
        service['drawingService'].previewSelectionCanvas = canvasTestHelper.previewSelectionCanvas;
        service['drawingService'].borderCanvas = canvasTestHelper.borderCanvas;

        executeSpy = spyOn(undoRedoService, 'executeCommand');

        service.initialPoint = { x: 394, y: 432 };
        service.linePathData = [service.initialPoint, { x: 133, y: 256 }, { x: 257, y: 399 }];
        service.topLeft = {
            x: 25,
            y: 60,
        };

        mouseEvent = {
            offsetX: 25,
            offsetY: 40,
            button: MouseButton.Left,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('onMouseDown should return if not called with Left MouseButton', () => {
        const rightMouseEvent = {
            button: MouseButton.Right,
        } as MouseEvent;
        expect(() => {
            service.onMouseDown(rightMouseEvent);
        }).not.toThrow();
    });

    it('onMouseDown should push from observable', () => {
        const lineMouseDownSpy = spyOn(service.lineService, 'onMouseDown').and.callFake(() => {
            service.lineService.addPointSubject = new Subject<Vec2>();
            service.lineService.addPointSubject.next(service.initialPoint);
        });
        service.onMouseDown(mouseEvent);
        expect(lineMouseDownSpy).toHaveBeenCalled();
        expect(service.linePathData[service.linePathData.length - 1]).toEqual(service.initialPoint);
    });

    it('onMouseDown should return if invalid segment', () => {
        service.isInvalidSegment = true;
        expect(() => {
            service.onMouseDown(mouseEvent);
        }).not.toThrow();
    });

    it('onMouseDown should call confirmSelection if isManipulating', () => {
        const confirmSelectionSpy = spyOn(service, 'confirmSelection');
        service.isManipulating = true;
        service.onMouseDown(mouseEvent);
        expect(confirmSelectionSpy).toHaveBeenCalled();
    });

    it('onMouseDown should start new path if passes initial validation and called first time', () => {
        service.onMouseDown(mouseEvent);
        expect(service.initialPoint).toEqual({ x: mouseEvent.offsetX, y: mouseEvent.offsetY });
        expect(service.linePathData).toEqual([service.initialPoint, service.initialPoint]);
        expect(service.inUse).toBeTruthy();
    });

    it('onMouseDown should set isConnected to true if new point is the same as initial', () => {
        const arePointsEqualSpy = spyOn<any>(service, 'arePointsEqual').and.callThrough();
        const lineMouseDownSpy = spyOn(service.lineService, 'onMouseDown').and.callFake(() => {
            service.linePathData[service.linePathData.length - 1] = service.initialPoint;
        });
        mouseEvent = {
            offsetX: service.initialPoint.x,
            offsetY: service.initialPoint.y,
            button: MouseButton.Left,
        } as MouseEvent;
        service.inUse = true;
        service.lineService.inUse = true;
        service.onMouseDown(mouseEvent);
        expect(lineMouseDownSpy).toHaveBeenCalled();
        expect(arePointsEqualSpy).toHaveBeenCalledWith(service.linePathData[service.linePathData.length - 1], service.initialPoint);
    });

    it('onMouseDown should call initializeSelection if isConnected', () => {
        const initializeSelectionSpy = spyOn(service, 'initializeSelection');
        service.isConnected = true;
        service.onMouseDown(mouseEvent);
        expect(initializeSelectionSpy).toHaveBeenCalled();
    });

    it('onMouseMove should pass if not in use', () => {
        service.inUse = false;
        expect(() => {
            service.onMouseMove(mouseEvent);
        }).not.toThrow();
    });

    it('onMouseMove should call isIntersect and set the cursor to crosshair if valid segment', () => {
        const isIntersectSpy = spyOn(service, 'isIntersect').and.callThrough();
        service.inUse = true;
        service.onMouseMove(mouseEvent);
        expect(isIntersectSpy).toHaveBeenCalled();
        expect(service.isInvalidSegment).toBeFalsy();
        expect(previewCtxStub.canvas.style.cursor).toEqual('crosshair');
    });

    it('onMouseMove should call isIntersect and set the cursor to no-drop if invalid segment', () => {
        const isIntersectSpy = spyOn(service, 'isIntersect').and.callThrough();
        service.inUse = true;
        service.linePathData.push({ x: 133, y: 256 });
        service.onMouseMove(mouseEvent);
        expect(isIntersectSpy).toHaveBeenCalled();
        expect(service.isInvalidSegment).toBeTruthy();
        expect(previewCtxStub.canvas.style.cursor).toEqual('no-drop');
    });

    it('onKeyboardDown with escape should set isEscapeDown to true', () => {
        const escapeKeyboardEvent = {
            key: 'Escape',
        } as KeyboardEvent;
        service.inUse = true;
        service.isEscapeDown = true;
        expect(() => {
            service.onKeyboardDown(escapeKeyboardEvent);
        }).not.toThrow();
    });

    it('onKeyboardDown with escape should set isEscapeDown to true', () => {
        const escapeKeyboardEvent = {
            key: 'Escape',
        } as KeyboardEvent;
        service.inUse = true;
        service.onKeyboardDown(escapeKeyboardEvent);
        expect(service.isEscapeDown).toBeTruthy();
    });

    it('onKeyboardUp should call resetSelection if in use and escape', () => {
        const resetSelectionSpy = spyOn(service, 'resetSelection').and.callThrough();
        const escapeKeyboardEvent = {
            key: 'Escape',
        } as KeyboardEvent;
        service.inUse = true;
        service.onKeyboardUp(escapeKeyboardEvent);
        expect(resetSelectionSpy).toHaveBeenCalled();
    });

    it('onKeyboardUp should call confirmSelection if is manipulating', () => {
        const confirmSelectionSpy = spyOn(service, 'confirmSelection').and.callThrough();
        const escapeKeyboardEvent = {
            key: 'Escape',
        } as KeyboardEvent;
        service.isManipulating = true;
        service.onKeyboardUp(escapeKeyboardEvent);
        expect(confirmSelectionSpy).toHaveBeenCalled();
    });

    it('undoSelection should pass if not manipulating', () => {
        service.isManipulating = false;
        expect(() => {
            service.undoSelection();
        }).not.toThrow();
    });

    it('undoSelection should call procedure if manipulating', () => {
        const drawImageToCtxSpy = spyOn<any>(service, 'drawImageToCtx');
        const resetCanvasStateSpy = spyOn(service, 'resetCanvasState');
        service.isManipulating = true;
        service.undoSelection();
        expect(drawImageToCtxSpy).toHaveBeenCalled();
        expect(resetCanvasStateSpy).toHaveBeenCalled();
        expect(resizerHandlerServiceSpy.resetResizers).toHaveBeenCalled();
    });

    it('confirmSelection should create a command to confirm the selection', () => {
        const resetCanvasStateSpy = spyOn(service, 'resetCanvasState').and.callThrough();
        canvasTestHelper.selectionCanvas.style.top = '25px';
        canvasTestHelper.selectionCanvas.style.left = '50px';
        const expectedTransform = {
            x: 50,
            y: 25,
        };
        service.confirmSelection();
        expect(service.transformValues).toEqual(expectedTransform);
        expect(executeSpy).toHaveBeenCalled();
        expect(resetCanvasStateSpy).toHaveBeenCalledWith(canvasTestHelper.selectionCanvas);
        expect(resetCanvasStateSpy).toHaveBeenCalledWith(canvasTestHelper.previewSelectionCanvas);
    });

    it('initializeSelection should properly set width and height of selectionCanvases', () => {
        const selectLassoSpy = spyOn<any>(service, 'selectLasso');
        const setSelectionCanvasPositionSpy = spyOn<any>(service, 'setSelectionCanvasPosition');
        const expectedWidth = 261;
        const expectedHeight = 176;
        service.initializeSelection();
        expect(selectionCtxStub.canvas.width).toEqual(expectedWidth);
        expect(selectionCtxStub.canvas.height).toEqual(expectedHeight);
        expect(selectLassoSpy).toHaveBeenCalled();
        expect(setSelectionCanvasPositionSpy).toHaveBeenCalled();
    });

    it('selectLasso should call clip and fill procedures', () => {
        const clipLassoSelectionSpy = spyOn<any>(service, 'clipLassoSelection');
        const fillLassoSpy = spyOn<any>(service, 'fillLasso');
        service['selectLasso'](selectionCtxStub, baseCtxStub, service.linePathData);
        expect(clipLassoSelectionSpy).toHaveBeenCalled();
        expect(fillLassoSpy).toHaveBeenCalled();
    });

    it('computeSelectionSize should return correct selectionSize', () => {
        const expectedWidth = 261;
        const expectedHeight = 176;
        const result = service.computeSelectionSize(service.linePathData);
        expect(result[0]).toEqual(expectedWidth);
        expect(result[1]).toEqual(expectedHeight);
    });

    it('fillLasso should fill correct zone using provided path', () => {
        const selectionCtxLineToSpy = spyOn(selectionCtxStub, 'lineTo');
        const selectionCtxMoveToSpy = spyOn(selectionCtxStub, 'moveTo');
        const selectionCtxFill = spyOn(selectionCtxStub, 'fill');
        service['fillLasso'](selectionCtxStub, service.linePathData, 'white');
        expect(selectionCtxMoveToSpy).toHaveBeenCalledWith(service.linePathData[0].x, service.linePathData[0].y);
        for (const point of service.linePathData) {
            expect(selectionCtxLineToSpy).toHaveBeenCalledWith(point.x, point.y);
        }
        expect(selectionCtxStub.fillStyle).toEqual('#000000');
        expect(selectionCtxFill).toHaveBeenCalled();
    });

    it('drawLassoOutline should correctly stroke the outline of the shape', () => {
        const selectionCtxLineToSpy = spyOn(selectionCtxStub, 'lineTo');
        const selectionCtxMoveToSpy = spyOn(selectionCtxStub, 'moveTo');
        const selectionCtxStrokeSpy = spyOn(selectionCtxStub, 'stroke');
        service['drawLassoOutline'](selectionCtxStub, service.linePathData);
        expect(selectionCtxMoveToSpy).toHaveBeenCalledWith(
            service.linePathData[0].x - service.topLeft.x,
            service.linePathData[0].y - service.topLeft.y,
        );
        for (const point of service.linePathData) {
            expect(selectionCtxLineToSpy).toHaveBeenCalledWith(point.x - service.topLeft.x, point.y - service.topLeft.y);
        }
        expect(selectionCtxStrokeSpy).toHaveBeenCalled();
    });

    it('clipLassoSelection should correctly clip path passed as parameter', () => {
        const selectionCtxClipSpy = spyOn(selectionCtxStub, 'clip');
        const selectionCtxLineToSpy = spyOn(selectionCtxStub, 'lineTo');
        const selectionCtxMoveToSpy = spyOn(selectionCtxStub, 'moveTo');
        service['clipLassoSelection'](selectionCtxStub, baseCtxStub, service.linePathData);
        expect(selectionCtxMoveToSpy).toHaveBeenCalledWith(
            service.linePathData[0].x - service.topLeft.x,
            service.linePathData[0].y - service.topLeft.y,
        );
        for (const point of service.linePathData) {
            expect(selectionCtxLineToSpy).toHaveBeenCalledWith(point.x - service.topLeft.x, point.y - service.topLeft.y);
        }
        expect(selectionCtxClipSpy).toHaveBeenCalled();
    });

    it('onToolChange should confirmSelection if manipulating the selection', () => {
        const confirmSelectionSpy = spyOn(service, 'confirmSelection');
        service.isManipulating = true;
        service.onToolChange();
        expect(confirmSelectionSpy).toHaveBeenCalled();
    });

    it('onToolChange should resetSelection if still use', () => {
        const resetSelectionSpy = spyOn(service, 'resetSelection');
        service.inUse = true;
        service.onToolChange();
        expect(resetSelectionSpy).toHaveBeenCalled();
    });

    it('isIntersect should return false if point is initialPoint', () => {
        const result = service.isIntersect(service.initialPoint, service.linePathData);
        expect(result).toBeFalsy();
    });

    it('isIntersect should return false if new line does not intersect with current lines', () => {
        const result = service.isIntersect(service.linePathData[service.linePathData.length - 1], service.linePathData);
        expect(result).toBeFalsy();
    });

    it('isIntersect should return true if new line does intersects with current lines', () => {
        service.linePathData.push({ x: 133, y: 256 });
        const result = service.isIntersect(service.linePathData[service.linePathData.length - 1], service.linePathData);
        expect(result).toBeTruthy();
    });

    it('setSelectionCanvasPosition should correctly set both selectionCanvas to topLeft specified', () => {
        service['setSelectionCanvasPosition'](service.topLeft);
        expect(selectionCtxStub.canvas.style.left).toEqual(service.topLeft.x + 'px');
        expect(selectionCtxStub.canvas.style.top).toEqual(service.topLeft.y + 'px');
        expect(previewSelectionCtxStub.canvas.style.left).toEqual(service.topLeft.x + 'px');
        expect(previewSelectionCtxStub.canvas.style.top).toEqual(service.topLeft.y + 'px');
        expect(resizerHandlerServiceSpy.setResizerPositions).toHaveBeenCalled();
    });

    it('drawImageToCtx should return if is from clipboard', () => {
        service.isFromClipboard = true;
        expect(() => {
            service['drawImageToCtx'](baseCtxStub, selectionCtxStub.canvas);
        }).not.toThrow();
    });

    it('drawImageToCtx should call targetCtx drawImage with appropriate paramters', () => {
        const drawImageSpy = spyOn(baseCtxStub, 'drawImage');
        service['drawImageToCtx'](baseCtxStub, selectionCtxStub.canvas);
        expect(drawImageSpy).toHaveBeenCalled();
        expect(drawImageSpy).toHaveBeenCalledWith(
            selectionCtxStub.canvas,
            0,
            0,
            service.selectionWidth,
            service.selectionHeight,
            service.topLeft.x,
            service.topLeft.y,
            service.selectionWidth,
            service.selectionHeight,
        );
    });

    it('clearPath should clear the service linePathData attribute', () => {
        service['clearPath']();
        expect(service.linePathData).toEqual([]);
    });

    it('arePointsEqual should return true if points are equal', () => {
        const point1 = { x: 25, y: 50 };
        const point2 = { x: 25, y: 50 };
        const result = service['arePointsEqual'](point1, point2);
        expect(result).toBeTruthy();
    });

    it('arePointsEqual should return false if points are not equal', () => {
        const point1 = { x: 25, y: 50 };
        const point2 = { x: 25, y: 64 };
        const result = service['arePointsEqual'](point1, point2);
        expect(result).toBeFalsy();
    });
});
