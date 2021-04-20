import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { TextService } from '@app/services/tools/text/text-service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { TextCommand } from './text-command';

// tslint:disable: no-string-literal
describe('TextCommand', () => {
    let command: TextCommand;
    let textService: TextService;
    let canvasTestHelper: CanvasTestHelper;
    let baseCtxStub: CanvasRenderingContext2D;
    let testCanvas: HTMLCanvasElement;
    let testCtx: CanvasRenderingContext2D;

    const TEST_FONT_FAMILY = 'Arial';
    const TEST_FONT_WEIGHT = 'bold';
    const TEST_FONT_SIZE = 50;
    const TEST_TEXT_ALIGN = 'center';
    const TEST_ITALIC = 'italic';
    const TEST_SPLIT_TEXT = ['HELLO' + 'OK' + 'WORLD'];

    const RED_VALUE = 110;
    const GREEN_VALUE = 225;
    const BLUE_VALUE = 202;
    const TEST_PRIM_COLOR = `rgb(${RED_VALUE}, ${GREEN_VALUE}, ${BLUE_VALUE})`;

    beforeEach(() => {
        textService = new TextService({} as DrawingService, {} as UndoRedoService);
        TestBed.configureTestingModule({
            providers: [{ provide: TextService, useValue: textService }],
        });

        textService.placeHolderSpan = document.createElement('span');
        textService.placeHolderSpan.id = 'placeHolderSpan';
        document.body.append(textService.placeHolderSpan);

        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        testCanvas = document.createElement('canvas');
        testCtx = testCanvas.getContext('2d') as CanvasRenderingContext2D;

        textService.setPrimaryColor(TEST_PRIM_COLOR);
        textService.setFontFamily(TEST_FONT_FAMILY);
        textService.setFontSize(TEST_FONT_SIZE);
        textService.setTextAlign(TEST_TEXT_ALIGN);
        textService.setTextBold(TEST_FONT_WEIGHT);
        textService.setTextItalic(TEST_ITALIC);

        textService.cornerCoords = { x: 0, y: 0 };

        command = new TextCommand(baseCtxStub, textService);
        command['splitText'] = TEST_SPLIT_TEXT;
    });

    it('should be created', () => {
        expect(command).toBeTruthy();
    });

    it('execute should call writeText', () => {
        // tslint:disable-next-line:no-any
        const textSpy = spyOn<any>(command, 'writeText');
        command.execute();
        expect(textSpy).toHaveBeenCalled();
    });

    it('setValues should set values', () => {
        command.setValues({} as CanvasRenderingContext2D, textService);

        expect(command['primaryColor']).toEqual(textService.primaryColor);
        expect(command['fontSize']).toEqual(textService.fontSize);
        expect(command['fontStyle']).toEqual(textService.placeHolderSpan.style.fontStyle);
        expect(command['textAlign']).toEqual(textService.placeHolderSpan.style.textAlign);
        expect(command['fontWeight']).toEqual(textService.placeHolderSpan.style.fontWeight);
        expect(command['fontFamily']).toEqual(textService.placeHolderSpan.style.fontFamily);
        expect(command['cornerCoords'].x).toEqual(textService.cornerCoords.x);
        expect(command['cornerCoords'].y).toEqual(textService.cornerCoords.y);
        expect(command['spanLeftPosition']).toEqual(textService.placeHolderSpan.clientWidth);
        expect(command['spanTopPosition']).toEqual(textService.placeHolderSpan.clientHeight);
        expect(command['text']).toEqual(textService.placeHolderSpan.innerText);
    });

    it('writeText should call fillText on each call', () => {
        const fillSpy = spyOn(testCtx, 'fillText');
        command.writeText(testCtx);
        expect(fillSpy).toHaveBeenCalled();
    });

    it('writeText should call splitTextString()', () => {
        const splitSpy = spyOn(command, 'splitTextString');
        command.writeText(testCtx);
        expect(splitSpy).toHaveBeenCalled();
    });

    it('writeText should call adjustTextAlignWidth() with center align', () => {
        command['textAlign'] = 'center';
        const adjustSpy = spyOn(command, 'adjustTextAlignWidth');
        command.writeText(testCtx);
        expect(adjustSpy).toHaveBeenCalled();
    });

    it('writeText should call adjustTextAlignWidth() with left align', () => {
        command['textAlign'] = 'left';
        const adjustSpy = spyOn(command, 'adjustTextAlignWidth');
        command.writeText(testCtx);
        expect(adjustSpy).toHaveBeenCalled();
    });

    it('writeText should call adjustTextAlignWidth() with right align', () => {
        command['textAlign'] = 'right';
        const adjustSpy = spyOn(command, 'adjustTextAlignWidth');
        command.writeText(testCtx);
        expect(adjustSpy).toHaveBeenCalled();
    });

    it('writeText should call adjustTextAlignWidth() with 0 return if wrong value', () => {
        command['textAlign'] = 'ddddd';
        const adjustSpy = spyOn(command, 'adjustTextAlignWidth');
        command.writeText(testCtx);
        expect(adjustSpy).toHaveBeenCalled();
    });

    it('adjustTextAlignWidth() with right align', () => {
        command['textAlign'] = 'right';
        const positionSpan = command.adjustTextAlignWidth(command['textAlign']);
        expect(positionSpan).toEqual(command['spanLeftPosition']);
    });

    it('adjustTextAlignWidth() with left align', () => {
        command['textAlign'] = 'left';
        const positionSpan = command.adjustTextAlignWidth(command['textAlign']);
        expect(positionSpan).toEqual(0);
    });

    it('adjustTextAlignWidth() with center align', () => {
        command['textAlign'] = 'center';
        const positionSpan = command.adjustTextAlignWidth(command['textAlign']);
        expect(positionSpan).toEqual(command['spanLeftPosition'] / 2);
    });

    it('adjustTextAlignWidth() with wrong align', () => {
        command['textAlign'] = 'dddd';
        const positionSpan = command.adjustTextAlignWidth(command['textAlign']);
        expect(positionSpan).toEqual(0);
    });

    it('writeText should set font', () => {
        command.writeText(testCtx);
        expect(testCtx.font).toEqual(command['fontStyle'] + ' ' + command['fontWeight'] + ' ' + command['fontSize'] + 'px ' + command['fontFamily']);
    });

    it('writeText should set fillStyle', () => {
        command.writeText(testCtx);
        expect(testCtx.fillStyle).toEqual('#6ee1ca');
    });

    it('writeText should set textAlign', () => {
        command.writeText(testCtx);
        expect(testCtx.textAlign).toEqual(command['textAlign']);
    });

    it('fillTextOnCanvas should call fillText', () => {
        const INDEX_STUB = 2;
        const fillSpy = spyOn(testCtx, 'fillText');
        command.fillTextOnCanvas(testCtx, INDEX_STUB);
        expect(fillSpy).toHaveBeenCalled();
    });

    it('splitTextString should split text to paste on canvas', () => {
        command['text'] = 'TEXT \n TESTING';
        command['splitTextString']();
        expect(command['splitText']).toEqual(['TEXT ', ' TESTING']);
    });

    it('splitTextString should not split text if no "\n" found', () => {
        command['text'] = 'TEXT TESTING';
        command['splitTextString']();
        expect(command['splitText']).toEqual(['TEXT TESTING']);
    });
});
