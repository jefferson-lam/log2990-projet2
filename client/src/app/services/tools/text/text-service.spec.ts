import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import * as CanvasConstants from '@app/constants/canvas-constants';
import * as MouseConstants from '@app/constants/mouse-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { TextService } from './text-service';

describe('TextService', () => {
    let service: TextService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    let executeSpy: jasmine.Spy;
    let drawSpy: jasmine.Spy;
    let selectedTextSpy: jasmine.Spy;
    let setSpanValuesSpy: jasmine.Spy;

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
        setSpanValuesSpy = spyOn(service, 'setSpanValues');

        service.cornerCoords = { x: 0, y: 0 };

        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;
        service.placeHolderSpan = document.createElement('span');

        const offsetX = 25;
        mouseEvent = {
            x: offsetX + CanvasConstants.LEFT_MARGIN,
            y: 40,
            button: MouseConstants.MouseButton.Left,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('onMouseDown should set inUse property to true on left click', () => {
        service.inUse = false;
        service.onMouseDown(mouseEvent);
        expect(service.inUse).toEqual(true);
    });

    it('onMouseDown should not call anything if not inUse', () => {
        const rightClick = { button: MouseConstants.MouseButton.Right } as MouseEvent;
        const createTextBoxSpy = spyOn(service, 'createTextBox');
        service.inUse = false;

        service.onMouseDown(rightClick);

        expect(drawSpy).not.toHaveBeenCalled();
        expect(createTextBoxSpy).not.toHaveBeenCalled();
    });

    it('onMouseDown should call drawTextOnCanvas() if inUse, lockKeyBoard and not escapeKeyUsed', () => {
        service.lockKeyboard = true;
        service.escapeKeyUsed = false;

        service.onMouseDown(mouseEvent);

        expect(drawSpy).toHaveBeenCalled();
    });

    it('onMouseDown should not call drawTextOnCanvas if lockKeyboard is false and escape key true', () => {
        service.inUse = false;
        service.placeHolderSpan.style.zIndex = '2';

        service.onMouseDown(mouseEvent);

        expect(drawSpy).not.toHaveBeenCalled();
    });

    it('onMouseDown should not call drawTextOnCanvas if lockKeyboard is false and escape key true', () => {
        service.lockKeyboard = false;
        service.escapeKeyUsed = true;

        service.onMouseDown(mouseEvent);

        expect(drawSpy).not.toHaveBeenCalled();
    });

    it('onMouseDown should not call drawTextOnCanvas if lockKeyboard is false and escape key false', () => {
        service.lockKeyboard = false;
        service.escapeKeyUsed = false;

        service.onMouseDown(mouseEvent);

        expect(drawSpy).not.toHaveBeenCalled();
    });

    it('onMouseDown should not call drawTextOnCanvas if lockKeyboard and escape key are true', () => {
        service.lockKeyboard = true;
        service.escapeKeyUsed = true;

        service.onMouseDown(mouseEvent);

        expect(drawSpy).not.toHaveBeenCalled();
    });

    it('onMouseDown should call createTextBox if inUse and (not lockKeyBoard or escapeKeyUsed)', () => {
        const createTextBoxSpy = spyOn(service, 'createTextBox');
        service.lockKeyboard = false;
        service.escapeKeyUsed = false;

        service.onMouseDown(mouseEvent);

        expect(drawSpy).not.toHaveBeenCalled();
        expect(createTextBoxSpy).toHaveBeenCalled();
    });

    it('onMouseUp should not call setSelectedText if not inUse', () => {
        service.inUse = false;
        service.onMouseUp();
        expect(selectedTextSpy).not.toHaveBeenCalled();
    });

    it('onMouseUp should call setSelectedText if inUse', () => {
        service.inUse = true;
        service.onMouseUp();
        expect(selectedTextSpy).toHaveBeenCalled();
    });

    it('onEscapeKeyDown should set placeHolderSpan.style.display to none and escapeKeyUsed to true', () => {
        service.onEscapeKeyDown();
        expect(service.placeHolderSpan.style.display).toBe('none');
        expect(service.escapeKeyUsed).toBeTrue();
    });

    it('createTextBox should set mouseDownCoord to correct position', () => {
        service.createTextBox(mouseEvent);
        expect(service.cornerCoords.x).toEqual(mouseEvent.x - CanvasConstants.LEFT_MARGIN);
        expect(service.cornerCoords.y).toEqual(mouseEvent.y);
    });

    it('createTextBox should call setSpanValues', () => {
        service.createTextBox(mouseEvent);
        expect(setSpanValuesSpy).toHaveBeenCalled();
    });

    it('createTextBox should set lockKeyboard to true, escapeKeyUsed to false and focus on placeHolderSpan', () => {
        const focusSpy = spyOn(service.placeHolderSpan, 'focus');
        service.createTextBox(mouseEvent);
        expect(service.lockKeyboard).toBeTrue();
        expect(service.escapeKeyUsed).toBeFalse();
        expect(focusSpy).toHaveBeenCalled();
    });

    it('drawTextOnCanvas should call multiple functions and call new command', () => {
        drawSpy.and.callThrough();
        service.drawTextOnCanvas();

        expect(executeSpy).toHaveBeenCalled();
        expect(service.inUse).toEqual(false);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(service.placeHolderSpan.style.visibility).toEqual('hidden');
        expect(service.lockKeyboard).toBeFalse();
    });

    it('setSelectedText should call getSelection, createRange', () => {
        selectedTextSpy.and.callThrough();
        const getSelectionSpy = spyOn(window, 'getSelection').and.callThrough();
        const rangeSpy = spyOn(document, 'createRange').and.callThrough();

        service.setSelectedText();

        expect(getSelectionSpy).toHaveBeenCalled();
        expect(rangeSpy).toHaveBeenCalled();
    });

    it('setSpanValues should set right values of span', () => {
        setSpanValuesSpy.and.callThrough();
        service.setSpanValues();

        expect(service.placeHolderSpan.style.zIndex).toEqual('2');
        expect(service.placeHolderSpan.style.visibility).toEqual('visible');
        expect(service.placeHolderSpan.innerText).toEqual('Ajoutez du texte ici...');
        expect(service.placeHolderSpan.style.display).toEqual('block');
        expect(service.placeHolderSpan.style.left).toEqual(service.cornerCoords.x + 'px');
        expect(service.placeHolderSpan.style.top).toEqual(service.cornerCoords.y + 'px');
        expect(service.lockKeyboard).toEqual(false);
        expect(service.escapeKeyUsed).toEqual(false);
        expect(service.placeHolderSpan.style.fontSize).toEqual('20px');
        expect(service.placeHolderSpan.style.position).toEqual('absolute');
        expect(service.placeHolderSpan.style.textAlign).toEqual('');
        expect(service.placeHolderSpan.style.fontFamily).toEqual('Arial');
        expect(service.placeHolderSpan.style.fontWeight).toEqual('');
        expect(service.placeHolderSpan.style.fontStyle).toEqual('');
    });

    it('setFontFamily should change family font', () => {
        service.setFontFamily(TEST_FONT_FAMILY);
        expect(service.placeHolderSpan.style.fontFamily).toEqual(TEST_FONT_FAMILY);
        expect(service.fontFamily).toEqual(TEST_FONT_FAMILY);
    });

    it('setFontSize should change font size', () => {
        service.setFontSize(TEST_FONT_SIZE);
        expect(service.placeHolderSpan.style.fontSize).toEqual(TEST_FONT_SIZE + 'px');
        expect(service.fontSize).toEqual(TEST_FONT_SIZE);
    });

    it('setTextAlign should change alignment of text', () => {
        service.setTextAlign(TEST_TEXT_ALIGN);
        expect(service.placeHolderSpan.style.textAlign).toEqual(TEST_TEXT_ALIGN);
        expect(service.textAlign).toEqual(TEST_TEXT_ALIGN);
    });

    it('setTextBold should change style of text to bold', () => {
        service.setTextBold(TEST_FONT_WEIGHT);
        expect(service.placeHolderSpan.style.fontWeight).toEqual(TEST_FONT_WEIGHT);
        expect(service.fontWeight).toEqual(TEST_FONT_WEIGHT);
    });

    it('setTextItalic should change style of text to italic', () => {
        service.setTextItalic(TEST_ITALIC);
        expect(service.placeHolderSpan.style.fontStyle).toEqual(TEST_ITALIC);
        expect(service.fontStyle).toEqual(TEST_ITALIC);
    });

    it('setPrimaryColor should change primary color to wanted color', () => {
        const EXPECTED_RANDOM_COLOR = 'blue';
        service.setPrimaryColor(EXPECTED_RANDOM_COLOR);
        expect(service.primaryColor).toEqual(EXPECTED_RANDOM_COLOR);
        expect(service.placeHolderSpan.style.color).toEqual(EXPECTED_RANDOM_COLOR);
    });

    it('onToolChange should call drawTextOnCanvas if lockKeyboard and not escapeKeyUsed', () => {
        service.lockKeyboard = true;
        service.escapeKeyUsed = false;
        service.onToolChange();
        expect(service.lockKeyboard).toBeFalse();
        expect(drawSpy).toHaveBeenCalled();
        expect(service.lockKeyboard).toEqual(false);
    });

    it('onToolChange should not call drawTextOnCanvas if not lockKeyboard and escapeKeyUsed', () => {
        service.lockKeyboard = false;
        service.escapeKeyUsed = true;
        service.onToolChange();
        expect(drawSpy).not.toHaveBeenCalled();
    });

    it('onToolChange should not call drawTextOnCanvas if lockKeyboard and escapeKeyUsed', () => {
        service.lockKeyboard = true;
        service.escapeKeyUsed = true;
        service.onToolChange();
        expect(drawSpy).not.toHaveBeenCalled();
    });

    it('onToolChange should not call drawTextOnCanvas if not lockKeyboard and not escapeKeyUsed', () => {
        service.lockKeyboard = false;
        service.escapeKeyUsed = false;
        service.onToolChange();
        expect(drawSpy).not.toHaveBeenCalled();
    });
});
