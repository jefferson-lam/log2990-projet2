import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import * as MouseConstants from '@app/constants/mouse-constants';
import * as PencilConstants from '@app/constants/pencil-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { PencilService } from './pencil-service';

// tslint:disable:no-any
describe('PencilService', () => {
    let service: PencilService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    let executeSpy: jasmine.Spy;
    let previewExecuteSpy: jasmine.Spy;
    let setPreviewValuesSpy: jasmine.Spy;
    let undoRedoService: UndoRedoService;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(PencilService);

        undoRedoService = TestBed.inject(UndoRedoService);
        executeSpy = spyOn(undoRedoService, 'executeCommand').and.callThrough();
        previewExecuteSpy = spyOn(service.previewCommand, 'execute');
        setPreviewValuesSpy = spyOn(service.previewCommand, 'setValues');

        // Configuration du spy du service
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('setPrimaryColor should set primary color to wanted color', () => {
        const EXPECTED_COLOR_RANDOM = 'blue';
        service.setPrimaryColor(EXPECTED_COLOR_RANDOM);
        expect(service.primaryColor).toEqual(EXPECTED_COLOR_RANDOM);
    });

    it('setLineWidth should set size to MIN_SIZE_PENCIL if under MIN_SIZE_PENCIL', () => {
        service.setLineWidth(PencilConstants.MIN_SIZE_PENCIL - 1);
        expect(service.lineWidth).toEqual(PencilConstants.MIN_SIZE_PENCIL);
    });

    it('setLineWidth should set size to MAX_SIZE_PENCIL if over MAX_SIZE_PENCIL', () => {
        service.setLineWidth(PencilConstants.MAX_SIZE_PENCIL + 1);
        expect(service.lineWidth).toEqual(PencilConstants.MAX_SIZE_PENCIL);
    });

    it('setLineWidth should set size to value if between MAX and MIN_SIZE_PENCIL', () => {
        const newSize = PencilConstants.MIN_SIZE_PENCIL + (PencilConstants.MAX_SIZE_PENCIL - PencilConstants.MIN_SIZE_PENCIL) / 2;
        service.setLineWidth(newSize);
        expect(service.lineWidth).toEqual(newSize);
    });

    it('mouseDown should set mouseDownCoord to correct position', () => {
        const expectedResult: Vec2 = { x: 25, y: 25 };
        service.onMouseDown(mouseEvent);
        expect(service.mouseDownCoord).toEqual(expectedResult);
    });

    it('mouseDown should set inUse property to true on left click', () => {
        service.onMouseDown(mouseEvent);
        expect(service.inUse).toEqual(true);
    });

    it('mouseDown should set inUse property to false on right click', () => {
        const mouseEventRClick = {
            offsetX: 25,
            offsetY: 25,
            button: MouseConstants.MouseButton.Right,
        } as MouseEvent;
        service.onMouseDown(mouseEventRClick);
        expect(service.inUse).toEqual(false);
    });

    it('onMouseUp should call executeCommand if mouse was already down', () => {
        service.inUse = true;

        service.onMouseUp(mouseEvent);
        expect(executeSpy).toHaveBeenCalled();
    });

    it('onMouseUp should not call executeCommand if mouse was not already down', () => {
        service.inUse = false;

        service.onMouseUp(mouseEvent);
        expect(executeSpy).not.toHaveBeenCalled();
    });

    it('onMouseMove should call setValues and execute of previewCommand if mouse was already down', () => {
        service.inUse = true;

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(setPreviewValuesSpy).toHaveBeenCalled();
        expect(previewExecuteSpy).toHaveBeenCalled();
    });

    it('onMouseMove should not call setValues and execute of previewCommand if mouse was not already down', () => {
        service.inUse = false;

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        expect(setPreviewValuesSpy).not.toHaveBeenCalled();
        expect(previewExecuteSpy).not.toHaveBeenCalled();
    });

    it('onMouseLeave should call executeCommand if mouse was down', () => {
        service.inUse = true;

        service.onMouseLeave(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(executeSpy).toHaveBeenCalled();
    });

    it('onMouseLeave should not call executeCommand if mouse was not down', () => {
        service.inUse = false;

        service.onMouseLeave(mouseEvent);
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        expect(executeSpy).not.toHaveBeenCalled();
    });

    it('onMouseEnter should set inUse to false if mouse is not down', () => {
        service.inUse = true;
        const mouseEventNoClick = {
            buttons: MouseConstants.MouseButton.Left,
        } as MouseEvent;

        service.onMouseEnter(mouseEventNoClick);
        expect(service.inUse).toBeFalse();
    });

    it('onMouseEnter should not set inUse to false if mouse is down', () => {
        service.inUse = true;

        service.onMouseEnter(mouseEvent);
        expect(service.inUse).toBeTrue();
    });

    // Exemple de test d'intégration qui est quand même utile
    it('should change the pixel of the canvas ', () => {
        mouseEvent = { offsetX: 0, offsetY: 0, button: 0 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        mouseEvent = { offsetX: 1, offsetY: 0, button: 0 } as MouseEvent;
        service.onMouseUp(mouseEvent);

        // Premier pixel seulement
        const imageData: ImageData = baseCtxStub.getImageData(0, 0, 1, 1);
        expect(imageData.data[0]).toEqual(0); // R
        expect(imageData.data[1]).toEqual(0); // G
        expect(imageData.data[2]).toEqual(0); // B
        // tslint:disable-next-line:no-magic-numbers
        expect(imageData.data[3]).not.toEqual(0); // A
    });

    it('onKeyboardDown should not call executeCommand if any key is pressed', () => {
        const keyEvent = {
            key: 'e',
        } as KeyboardEvent;

        service.onKeyboardDown(keyEvent);
        expect(executeSpy).not.toHaveBeenCalled();
    });

    it(' onKeyboardUp should not call executeCommand if any key is pressed', () => {
        const keyEvent = {
            key: 'e',
        } as KeyboardEvent;

        service.onKeyboardUp(keyEvent);
        expect(executeSpy).not.toHaveBeenCalled();
    });
});
