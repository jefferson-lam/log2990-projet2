import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import * as MouseConstants from '@app/constants/mouse-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { TextService } from './text-service';

fdescribe('TextService', () => {
    let service: TextService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    let executeSpy: jasmine.Spy;
    let drawSpy: jasmine.Spy;
    let clearCornerSpy: jasmine.Spy;
    let selectedTextSpy: jasmine.Spy;

    let undoRedoService: UndoRedoService;

    const TEST_FONT_FAMILY = 'Arial';
    const TEST_FONT_WEIGHT = 'bold';
    const TEST_FONT_SIZE = 50;
    const TEST_TEXT_ALIGN = 'center';
    const TEST_ITALIC = 'italic';

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        service = TestBed.inject(TextService);

        undoRedoService = TestBed.inject(UndoRedoService);
        executeSpy = spyOn(undoRedoService, 'executeCommand').and.callThrough();
        drawSpy = spyOn(service, 'drawTextOnCanvas');
        selectedTextSpy = spyOn(service, 'setSelectedText');

        // tslint:disable-next-line:no-any
        clearCornerSpy = spyOn<any>(service, 'clearCornerCoords');
        service.cornerCoords = [
            { x: 0, y: 0 },
            { x: 0, y: 0 },
        ];

        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;
        service.placeHolderSpan = document.createElement('span');

        mouseEvent = {
            offsetX: 25,
            offsetY: 40,
            button: MouseConstants.MouseButton.Left,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('onMouseDown should set mouseDownCoord to correct position', () => {
        const expectedResult: Vec2 = { x: 25, y: 40 };
        service.inUse = true;
        service.lockKeyboard = false;
        service.onMouseDown(mouseEvent);
        expect(service.textWidth).toEqual(expectedResult.x);
        expect(service.textHeight).toEqual(expectedResult.y);
    });

    it('onMouseDown should set inUse property to true on left click', () => {
        service.onMouseDown(mouseEvent);
        service.lockKeyboard = false;
        expect(service.inUse).toEqual(true);
    });

    it('onMouseDown should call drawTextOnCanvas if finished drawing is true', () => {
        service.lockKeyboard = true;
        service.placeHolderSpan.style.zIndex = '2';

        service.onMouseDown(mouseEvent);

        expect(drawSpy).toHaveBeenCalled();
    });

    it('onMouseUp should not call executeCommand if mouse was not already down', () => {
        service.inUse = false;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.onMouseUp(mouseEvent);
        expect(executeSpy).not.toHaveBeenCalled();
    });

    it('onMouseUp should not call executeCommand if escape false', () => {
        service.escapeKeyUsed = false;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.onMouseUp(mouseEvent);
        expect(executeSpy).not.toHaveBeenCalled();
    });

    it('onMouseUp should not call executeCommand lock true', () => {
        service.lockKeyboard = true;
        service.escapeKeyUsed = false;
        service.inUse = false;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.onMouseUp(mouseEvent);
        expect(executeSpy).not.toHaveBeenCalled();
    });

    it('onMouseUp should not call executeCommand', () => {
        service.lockKeyboard = true;
        service.escapeKeyUsed = true;
        service.inUse = true;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.onMouseUp(mouseEvent);
        expect(executeSpy).not.toHaveBeenCalled();
    });

    it('onMouseUp should set placeholder attributes if only lock is false', () => {
        service.inUse = true;
        service.escapeKeyUsed = true;
        service.lockKeyboard = false;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.onMouseUp(mouseEvent);

        expect(service.placeHolderSpan.style.zIndex).toEqual('2');
        expect(service.placeHolderSpan.style.visibility).toEqual('visible');
        expect(service.placeHolderSpan.innerText).toEqual('Ajoutez du texte ici...');
        expect(service.placeHolderSpan.style.left).toEqual(service.cornerCoords[0].x + 'px');
        expect(service.placeHolderSpan.style.top).toEqual(service.cornerCoords[0].y + 'px');
        expect(service.lockKeyboard).toEqual(true);
        expect(service.escapeKeyUsed).toEqual(false);
        expect(selectedTextSpy).toHaveBeenCalled();
    });

    it('onMouseUp should set placeholder attributes if escaped is true', () => {
        service.inUse = true;
        service.escapeKeyUsed = true;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.onMouseUp(mouseEvent);

        expect(service.placeHolderSpan.style.zIndex).toEqual('2');
        expect(service.placeHolderSpan.style.visibility).toEqual('visible');
        expect(service.placeHolderSpan.innerText).toEqual('Ajoutez du texte ici...');
        expect(service.placeHolderSpan.style.left).toEqual(service.cornerCoords[0].x + 'px');
        expect(service.placeHolderSpan.style.top).toEqual(service.cornerCoords[0].y + 'px');
        expect(service.lockKeyboard).toEqual(true);
        expect(selectedTextSpy).toHaveBeenCalled();
    });

    it('onMouseLeave should clear canvas if inUse is true', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.inUse = true;
        service.onMouseLeave(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('onMouseLeave should not clear canvas if inUse is false', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.inUse = false;
        service.onMouseLeave(mouseEvent);
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
    });

    it('onMouseEnter should make service.mouseDown true if left mouse was pressed and mouse was pressed before leaving', () => {
        const mouseEnterEvent = {
            offsetX: 25,
            offsetY: 40,
            buttons: MouseConstants.PRIMARY_BUTTON,
        } as MouseEvent;
        service.inUse = true;
        service.onMouseEnter(mouseEnterEvent);
        expect(service.inUse).toEqual(false);
    });

    it('onMouseEnter should make service.mouseDown false if left mouse was pressed and mouse was not pressed before leaving', () => {
        const mouseEnterEvent = {
            offsetX: 25,
            offsetY: 40,
            buttons: 1,
        } as MouseEvent;
        service.inUse = false;
        service.onMouseEnter(mouseEnterEvent);
        expect(service.inUse).toEqual(false);
    });

    it('onMouseEnter should make service.mouseDown false if left mouse was not pressed and mouse was not pressed before leaving', () => {
        const mouseEnterEvent = {
            offsetX: 25,
            offsetY: 40,
            buttons: 0,
        } as MouseEvent;
        service.inUse = false;
        service.onMouseEnter(mouseEnterEvent);
        expect(service.inUse).toEqual(false);
    });

    it('drawTextOnCanvas should call clearCornerCoords', () => {
        drawSpy.and.callThrough();
        service.drawTextOnCanvas();
        expect(clearCornerSpy).toHaveBeenCalled();
    });

    it('drawTextOnCanvas should call multiple functions', () => {
        drawSpy.and.callThrough();
        service.drawTextOnCanvas();

        expect(executeSpy).toHaveBeenCalled();
        expect(service.inUse).toEqual(false);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(service.placeHolderSpan.style.visibility).toEqual('hidden');
    });

    it('setSelectedText should call getSelection, createRange', () => {
        selectedTextSpy.and.callThrough();
        const getSelectionSpy = spyOn(window, 'getSelection').and.callThrough();
        const rangeSpy = spyOn(document, 'createRange').and.callThrough();

        service.setSelectedText();

        expect(getSelectionSpy).toHaveBeenCalled();
        expect(rangeSpy).toHaveBeenCalled();
    });

    it('onKeyboardDown of wrong keypress should not call clearCanvas', () => {
        service.mouseDownCoord = { x: 0, y: 0 };

        const keyEvent = {
            key: 'g',
        } as KeyboardEvent;

        service.onKeyboardDown(keyEvent);
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
    });

    it('onToolChange should call drawTextOnCanvas', () => {
        service.lockKeyboard = true;
        service.escapeKeyUsed = false;
        service.onToolChange();
        expect(service.lockKeyboard).toBeFalse();
        expect(drawSpy).toHaveBeenCalled();
        expect(service.lockKeyboard).toEqual(false);
    });

    it('onToolChange should not call drawTextOnCanvas', () => {
        service.lockKeyboard = false;
        service.escapeKeyUsed = true;
        service.onToolChange();
        expect(service.lockKeyboard).toBeFalse();
        expect(drawSpy).not.toHaveBeenCalled();
    });

    it('setFontFamily should change family font', () => {
        service.setFontFamily(TEST_FONT_FAMILY);
        expect(service.placeHolderSpan.style.fontFamily).toEqual(TEST_FONT_FAMILY);
    });

    it('setFontSize should change font size', () => {
        service.setFontSize(TEST_FONT_SIZE);
        expect(service.placeHolderSpan.style.fontSize).toEqual(TEST_FONT_SIZE + 'px');
    });

    it('setTextAlign should change alignment of text', () => {
        service.setTextAlign(TEST_TEXT_ALIGN);
        expect(service.placeHolderSpan.style.textAlign).toEqual(TEST_TEXT_ALIGN);
    });

    it('setTextBold should change style of text to bold', () => {
        service.setTextBold(TEST_FONT_WEIGHT);
        expect(service.placeHolderSpan.style.fontWeight).toEqual(TEST_FONT_WEIGHT);
    });

    it('setTextItalic should change style of text to italic', () => {
        service.setTextItalic(TEST_ITALIC);
        expect(service.placeHolderSpan.style.fontStyle).toEqual(TEST_ITALIC);
    });

    it('setPrimaryColor should change primary color to wanted color', () => {
        const EXPECTED_RANDOM_COLOR = 'blue';
        service.setPrimaryColor(EXPECTED_RANDOM_COLOR);
        expect(service.primaryColor).toEqual(EXPECTED_RANDOM_COLOR);
    });
});
