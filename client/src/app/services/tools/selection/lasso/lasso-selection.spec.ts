import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { MouseButton } from '@app/constants/mouse-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { ResizerHandlerService } from '../resizer/resizer-handler.service';
import { LassoSelectionService } from './lasso-selection';

fdescribe('LassoSelectionService', () => {
    let service: LassoSelectionService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let resizerHandlerServiceSpy: jasmine.SpyObj<ResizerHandlerService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let selectionCtxStub: CanvasRenderingContext2D;

    let executeSpy: jasmine.Spy;
    let undoRedoService: UndoRedoService;

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

        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        selectionCtxStub = canvasTestHelper.selectionCanvas.getContext('2d') as CanvasRenderingContext2D;

        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].selectionCtx = selectionCtxStub;
        service['drawingService'].selectionCanvas = canvasTestHelper.selectionCanvas;
        service['drawingService'].canvas = canvasTestHelper.canvas;
        service['drawingService'].previewSelectionCanvas = canvasTestHelper.previewSelectionCanvas;

        executeSpy = spyOn(undoRedoService, 'executeCommand');

        service.initialPoint = { x: 394, y: 432 };
        service.linePathData = [service.initialPoint, { x: 133, y: 256 }, { x: 257, y: 399 }];

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

    it('onMouseDown should call confirmSelection if isManipulatin', () => {
        const confirmSelectionSpy = spyOn(service, 'confirmSelection');
        service.isManipulating = true;
        service.onMouseDown(mouseEvent);
        expect(confirmSelectionSpy).toHaveBeenCalled();
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

    it('computeSelectionSize should return correct selectionSize', () => {
        const expectedWidth = 261;
        const expectedHeight = 176;
        const result = service.computeSelectionSize(service.linePathData);
        expect(result[0]).toEqual(expectedWidth);
        expect(result[1]).toEqual(expectedHeight);
    });
});
