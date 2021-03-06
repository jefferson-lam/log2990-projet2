import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import * as ShapeConstants from '@app/constants/shapes-constants';
import * as ToolConstants from '@app/constants/tool-constants';
import { RectangleCommand } from '@app/services/tools/rectangle/rectangle-command';
import { RectangleService } from '@app/services/tools/rectangle/rectangle-service';

// tslint:disable:no-any
// tslint:disable: no-string-literal
describe('RectangleCommand', () => {
    let command: RectangleCommand;
    let rectangleService: RectangleService;

    let pathStub: Vec2[];

    let drawRectangleSpy: jasmine.Spy;
    let drawRectangleTypeSpy: jasmine.Spy;

    let canvasTestHelper: CanvasTestHelper;
    let baseCtxStub: CanvasRenderingContext2D;

    // Constants
    const BIG_TEST_LINE_WIDTH = 50;
    const TEST_LINE_WIDTH = 1;
    const RED_VALUE = 120;
    const GREEN_VALUE = 170;
    const BLUE_VALUE = 140;
    const TEST_PRIMARY_COLOR = `rgb(${RED_VALUE}, ${GREEN_VALUE}, ${BLUE_VALUE})`;
    const TEST_SECONDARY_COLOR = 'black';
    const TEST_X_OFFSET = 3;
    const TEST_Y_OFFSET = 3;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        rectangleService = TestBed.inject(RectangleService);

        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;

        pathStub = [
            { x: 0, y: 0 },
            { x: TEST_X_OFFSET, y: TEST_Y_OFFSET },
        ] as Vec2[];

        rectangleService.cornerCoords = Object.assign([], pathStub);

        rectangleService.setLineWidth(TEST_LINE_WIDTH);
        rectangleService.primaryColor = TEST_PRIMARY_COLOR;
        rectangleService.secondaryColor = TEST_SECONDARY_COLOR;

        command = new RectangleCommand(baseCtxStub, rectangleService);
        drawRectangleSpy = spyOn<any>(command, 'drawRectangle').and.callThrough();
        drawRectangleTypeSpy = spyOn<any>(command, 'drawTypeRectangle').and.callThrough();
    });

    it('should be created', () => {
        expect(command).toBeTruthy();
    });

    it('execute should call drawRectangle', () => {
        command.execute();

        expect(drawRectangleSpy).toHaveBeenCalled();
    });

    it('setValues should set values', () => {
        command.setValues({} as CanvasRenderingContext2D, rectangleService);

        expect(command['isSquare']).toEqual(rectangleService.isSquare);
        expect(command['lineWidth']).toEqual(rectangleService.lineWidth);
        expect(command['fillMode']).toEqual(rectangleService.fillMode);
        expect(command['primaryColor']).toEqual(rectangleService.primaryColor);
        expect(command['secondaryColor']).toEqual(rectangleService.secondaryColor);
        expect(command.cornerCoords).toEqual(rectangleService.cornerCoords);
    });

    it('drawRectangle should call drawTypeRectangle with unchanged width & height if smaller or equal to lineWidth', () => {
        const width = command.cornerCoords[ShapeConstants.END_INDEX].x - command.cornerCoords[ShapeConstants.START_INDEX].x;

        command['isSquare'] = false;
        command['lineWidth'] = width;
        command['fillMode'] = ToolConstants.FillMode.FILL_ONLY;

        // tslint:disable:no-string-literal
        command['drawRectangle'](command['ctx'], command.cornerCoords);

        expect(drawRectangleTypeSpy).toHaveBeenCalled();
        expect(drawRectangleTypeSpy).toHaveBeenCalledWith(baseCtxStub, pathStub);
    });

    it('drawRectangle should call drawTypeRectangle with shortestSide of width & height if smaller or equal to lineWidth and isSquare', () => {
        let width = command.cornerCoords[ShapeConstants.END_INDEX].x - command.cornerCoords[ShapeConstants.START_INDEX].x;
        let height = command.cornerCoords[ShapeConstants.END_INDEX].y - command.cornerCoords[ShapeConstants.START_INDEX].y;

        const shortestSide = Math.min(Math.abs(width), Math.abs(height));
        width = Math.sign(width) * shortestSide;
        height = Math.sign(height) * shortestSide;

        command['isSquare'] = true;
        command['lineWidth'] = width;
        command['fillMode'] = ToolConstants.FillMode.FILL_ONLY;

        // tslint:disable:no-string-literal
        command['drawRectangle'](command['ctx'], command.cornerCoords);

        expect(drawRectangleTypeSpy).toHaveBeenCalled();
        expect(drawRectangleTypeSpy).toHaveBeenCalledWith(baseCtxStub, pathStub);
    });

    it('drawRectangle should call drawTypeRectangle with changed width & height if bigger than 2*lineWidth', () => {
        const width = command.cornerCoords[ShapeConstants.END_INDEX].x - command.cornerCoords[ShapeConstants.START_INDEX].x;
        const height = command.cornerCoords[ShapeConstants.END_INDEX].y - command.cornerCoords[ShapeConstants.START_INDEX].y;

        command['isSquare'] = false;
        command['lineWidth'] = Math.min(Math.abs(height), Math.abs(width)) / 2 - 1;
        command['fillMode'] = ToolConstants.FillMode.FILL_ONLY;

        // tslint:disable:no-string-literal
        command['drawRectangle'](command['ctx'], command.cornerCoords);

        expect(drawRectangleTypeSpy).toHaveBeenCalled();
        expect(drawRectangleTypeSpy).toHaveBeenCalledWith(baseCtxStub, pathStub);
    });

    it('drawRectangle should fill all pixels with border color if width or height to be is smaller than line width.', () => {
        rectangleService.fillMode = ToolConstants.FillMode.OUTLINE;
        rectangleService.setLineWidth(BIG_TEST_LINE_WIDTH);

        command.setValues(baseCtxStub, rectangleService);
        command.execute();

        expect(drawRectangleTypeSpy).toHaveBeenCalledWith(baseCtxStub, command['cornerCoords']);
    });

    it('drawRectangle not call fill rect of base CTX if fill mode is OUTLINE.', () => {
        command['fillMode'] = ToolConstants.FillMode.OUTLINE;
        const spy = spyOn(baseCtxStub, 'fillRect');
        command['drawTypeRectangle'](baseCtxStub, command['cornerCoords']);

        expect(spy).not.toHaveBeenCalled();
    });
});
