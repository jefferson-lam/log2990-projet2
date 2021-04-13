import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { TextService } from '@app/services/tools/text/text-service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { TextCommand } from './text-command';

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

    const END_X = 10;
    const END_Y = 15;

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

        textService.cornerCoords[0] = { x: 0, y: 0 };
        textService.cornerCoords[1] = { x: END_X, y: END_Y };

        command = new TextCommand(baseCtxStub, textService);
        command.splitText = TEST_SPLIT_TEXT;
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

        expect(command.primaryColor).toEqual(textService.primaryColor);
        expect(command.fontSize).toEqual(textService.fontSize);
        expect(command.fontStyle).toEqual(textService.placeHolderSpan.style.fontStyle);
        expect(command.textAlign).toEqual(textService.placeHolderSpan.style.textAlign);
        expect(command.fontWeight).toEqual(textService.placeHolderSpan.style.fontWeight);
        expect(command.fontFamily).toEqual(textService.placeHolderSpan.style.fontFamily);
        expect(command.textWidth).toEqual(textService.textWidth);
        expect(command.textHeight).toEqual(textService.textHeight);
        expect(command.spanLeftPosition).toEqual(textService.placeHolderSpan.clientWidth);
        expect(command.spanTopPosition).toEqual(textService.placeHolderSpan.clientHeight);
        expect(command.text).toEqual(textService.placeHolderSpan.innerText);
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

    it('writeText should call adjustWidthWithTextAlign() with center align', () => {
        command.textAlign = 'center';
        const adjustSpy = spyOn(command, 'adjustWidthWithTextAlign');
        command.writeText(testCtx);
        expect(adjustSpy).toHaveBeenCalled();
    });

    it('writeText should call adjustWidthWithTextAlign() with left align', () => {
        command.textAlign = 'left';
        const adjustSpy = spyOn(command, 'adjustWidthWithTextAlign');
        command.writeText(testCtx);
        expect(adjustSpy).toHaveBeenCalled();
    });

    it('writeText should call adjustWidthWithTextAlign() with right align', () => {
        command.textAlign = 'right';
        const adjustSpy = spyOn(command, 'adjustWidthWithTextAlign');
        command.writeText(testCtx);
        expect(adjustSpy).toHaveBeenCalled();
    });

    it('writeText should call adjustWidthWithTextAlign() with 0 return', () => {
        command.textAlign = 'ddddd';
        const adjustSpy = spyOn(command, 'adjustWidthWithTextAlign');
        command.writeText(testCtx);
        expect(adjustSpy).toHaveBeenCalled();
    });

    it('adjustWidthWithTextAlign() with right align', () => {
        command.textAlign = 'right';
        const positionSpan = command.adjustWidthWithTextAlign(command.textAlign);
        command.adjustWidthWithTextAlign(command.textAlign);
        command.writeText(testCtx);
        expect(positionSpan).toEqual(command.spanLeftPosition);
    });

    it('adjustWidthWithTextAlign() with left align', () => {
        command.textAlign = 'left';
        const positionSpan = command.adjustWidthWithTextAlign(command.textAlign);
        command.adjustWidthWithTextAlign(command.textAlign);
        command.writeText(testCtx);
        expect(positionSpan).toEqual(0);
    });

    it('adjustWidthWithTextAlign() with center align', () => {
        command.textAlign = 'center';
        const positionSpan = command.adjustWidthWithTextAlign(command.textAlign);
        command.adjustWidthWithTextAlign(command.textAlign);
        command.writeText(testCtx);
        expect(positionSpan).toEqual(command.spanLeftPosition / 2);
    });

    it('adjustWidthWithTextAlign() with wrong align', () => {
        command.textAlign = 'dddd';
        const positionSpan = command.adjustWidthWithTextAlign(command.textAlign);
        command.adjustWidthWithTextAlign(command.textAlign);
        command.writeText(testCtx);
        expect(positionSpan).toEqual(0);
    });

    it('writeText should set font', () => {
        command.writeText(testCtx);
        expect(testCtx.font).toEqual(command.fontStyle + ' ' + command.fontWeight + ' ' + command.fontSize + 'px ' + command.fontFamily);
    });

    it('writeText should set fillStyle', () => {
        command.writeText(testCtx);
        expect(testCtx.fillStyle).toEqual('#6ee1ca');
    });

    it('writeText should set textAlign', () => {
        command.writeText(testCtx);
        expect(testCtx.textAlign).toEqual(command.textAlign);
    });
});
