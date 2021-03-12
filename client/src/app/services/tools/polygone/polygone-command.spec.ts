import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import * as PolygoneConstants from '@app/constants/polygone-constants';
import * as ToolConstants from '@app/constants/tool-constants';
import { PolygoneService } from '@app/services/tools/polygone/polygone-service';
import { PolygoneCommand } from './polygone-command';

// tslint:disable:no-any
describe('PolygoneCommand', () => {
    let command: PolygoneCommand;
    let polygoneService: PolygoneService;
    let mockPoint: Vec2;
    let mockRadii: number[];
    let mockRadius: number;
    let canvasTestHelper: CanvasTestHelper;
    let baseCtxStub: CanvasRenderingContext2D;
    let testCanvas: HTMLCanvasElement;
    let testCtx: CanvasRenderingContext2D;

    const RED_VALUE = 110;
    const GREEN_VALUE = 225;
    const BLUE_VALUE = 202;
    const OPACITY = 1;
    const TEST_PRIMARY_COLOR_HEX = '#6ee1ca';
    const TEST_PRIM_COLOR = `rgb(${RED_VALUE}, ${GREEN_VALUE}, ${BLUE_VALUE}, ${OPACITY})`;
    const TEST_SECOND_COLOR = 'white';
    const TEST_LINE_WIDTH = 1;

    const END_X = 10;
    const END_Y = 15;

    const TEST_X_RADIUS = (END_X - TEST_LINE_WIDTH) / 2;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        polygoneService = TestBed.inject(PolygoneService);

        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        testCanvas = document.createElement('canvas');
        testCtx = testCanvas.getContext('2d') as CanvasRenderingContext2D;

        mockPoint = { x: 10, y: 10 };
        mockRadii = [END_X, END_Y];
        mockRadius = TEST_X_RADIUS;

        polygoneService.setPrimaryColor(TEST_PRIM_COLOR);
        polygoneService.setSecondaryColor(TEST_SECOND_COLOR);
        polygoneService.setLineWidth(TEST_LINE_WIDTH);
        polygoneService.cornerCoords[0] = { x: 0, y: 0 };
        polygoneService.cornerCoords[1] = { x: END_X, y: END_Y };

        command = new PolygoneCommand(baseCtxStub, polygoneService);
    });

    it('should be created', () => {
        expect(command).toBeTruthy();
    });

    it('execute should call drawPolygone', () => {
        const drawPolygoneSpy = spyOn<any>(command, 'drawPolygone');
        command.execute();
        expect(drawPolygoneSpy).toHaveBeenCalled();
    });

    it('setValues should set values', () => {
        command.setValues({} as CanvasRenderingContext2D, polygoneService);

        expect(command.fillMode).toEqual(polygoneService.fillMode);
        expect(command.primaryColor).toEqual(polygoneService.primaryColor);
        expect(command.secondaryColor).toEqual(polygoneService.secondaryColor);
        expect(command.lineWidth).toEqual(polygoneService.lineWidth);
        expect(command.cornerCoords).toEqual(polygoneService.cornerCoords);
    });

    it('drawPolygone should set fillMode to fill only', () => {
        // tslint:disable:no-string-literal
        command.primaryColor = 'black';
        command.fillMode = ToolConstants.FillMode.FILL_ONLY;
        const drawPolygoneSpy = spyOn<any>(command, 'drawPolygone');
        command['drawPolygone'](command['ctx'], command.cornerCoords, command.initNumberSides);
        expect(drawPolygoneSpy).toHaveBeenCalled();
    });

    it('drawPolygone should set fillMode to outline', () => {
        // tslint:disable:no-string-literal
        command.secondaryColor = 'black';
        command.fillMode = ToolConstants.FillMode.OUTLINE;
        const drawPolygoneSpy = spyOn<any>(command, 'drawPolygone');
        command['drawPolygone'](command['ctx'], command.cornerCoords, command.initNumberSides);
        expect(drawPolygoneSpy).toHaveBeenCalled();
    });

    it('drawPolygone should set fillMode to outline fill', () => {
        // tslint:disable:no-string-literal
        command.primaryColor = 'black';
        command.secondaryColor = 'black';
        command.fillMode = ToolConstants.FillMode.OUTLINE_FILL;
        const drawPolygoneSpy = spyOn<any>(command, 'drawPolygone');
        command['drawPolygone'](command['ctx'], command.cornerCoords, command.initNumberSides);
        expect(drawPolygoneSpy).toHaveBeenCalled();
    });

    it('drawPolygone should call getRadiiXAndY', () => {
        const getRadiiSpy = spyOn<any>(command, 'getRadiiXAndY').and.callFake(() => {
            return mockRadii;
        });
        // tslint:disable:no-string-literal
        command['drawPolygone'](command['ctx'], command.cornerCoords, command.initNumberSides);
        expect(getRadiiSpy).toHaveBeenCalled();
    });

    it('drawPolygone should call drawTypePolygone and change primary color', () => {
        spyOn<any>(command, 'getRadiiXAndY').and.callFake(() => {
            return mockRadii;
        });
        const drawTypeSpy = spyOn<any>(command, 'drawTypePolygone');
        command.fillMode = ToolConstants.FillMode.FILL_ONLY;
        // tslint:disable:no-string-literal
        command['drawPolygone'](command['ctx'], command.cornerCoords, command.initNumberSides);
        expect(drawTypeSpy).toHaveBeenCalled();
    });

    it('drawPolygone should call drawTypePolygone and not change primary color', () => {
        spyOn<any>(command, 'getRadiiXAndY').and.callFake(() => {
            return mockRadii;
        });
        const drawTypeSpy = spyOn<any>(command, 'drawTypePolygone');
        command.fillMode = ToolConstants.FillMode.OUTLINE;
        // tslint:disable:no-string-literal
        command['drawPolygone'](command['ctx'], command.cornerCoords, command.initNumberSides);
        expect(drawTypeSpy).toHaveBeenCalled();
    });

    it('drawPolygone should call drawTypePolygone with fill mode change', () => {
        spyOn<any>(command, 'getRadiiXAndY').and.callFake(() => {
            return mockRadii;
        });
        const drawTypeSpy = spyOn<any>(command, 'drawTypePolygone');
        command.fillMode = ToolConstants.FillMode.OUTLINE_FILL;
        command.lineWidth = mockRadii[0];
        // tslint:disable:no-string-literal
        command['drawPolygone'](command['ctx'], command.cornerCoords, command.initNumberSides);
        expect(drawTypeSpy).toHaveBeenCalled();
    });

    it('drawTypePolygone should change fillStyle and fill if not FillMode.OUTLINE', () => {
        const fillSpy = spyOn(testCtx, 'fill');
        command['drawTypePolygone'](
            testCtx,
            mockPoint.x,
            mockPoint.y,
            mockRadii[0],
            mockRadii[1],
            PolygoneConstants.MIN_SIDES_COUNT,
            ToolConstants.FillMode.OUTLINE_FILL,
            TEST_PRIM_COLOR,
            TEST_PRIM_COLOR,
            TEST_LINE_WIDTH,
        );
        expect(testCtx.fillStyle).toEqual(TEST_PRIMARY_COLOR_HEX);
        expect(fillSpy).toHaveBeenCalled();
    });

    it('drawTypePolygone should not change fillStyle and fill if FillMode.OUTLINE', () => {
        const fillSpy = spyOn(testCtx, 'fill');
        command['drawTypePolygone'](
            testCtx,
            mockPoint.x,
            mockPoint.y,
            mockRadii[0],
            mockRadii[1],
            PolygoneConstants.MIN_SIDES_COUNT,
            ToolConstants.FillMode.OUTLINE,
            TEST_PRIM_COLOR,
            TEST_PRIM_COLOR,
            TEST_LINE_WIDTH,
        );
        expect(testCtx.fillStyle).not.toEqual(TEST_PRIMARY_COLOR_HEX);
        expect(fillSpy).not.toHaveBeenCalled();
    });

    it('drawPolygone should call getDrawTypeRadius', () => {
        const getRadiusSpy = spyOn<any>(command, 'getDrawTypeRadius').and.callFake(() => {
            return mockRadius;
        });
        // tslint:disable:no-string-literal
        command['drawPolygone'](command['ctx'], command.cornerCoords, command.initNumberSides);
        expect(getRadiusSpy).toHaveBeenCalled();
    });

    it('drawPolygoneType should call getDrawTypeRadius and change return value to yRadius', () => {
        const getRadiusSpy = spyOn<any>(command, 'getDrawTypeRadius').and.callThrough();
        // tslint:disable:no-string-literal
        command['drawTypePolygone'](
            testCtx,
            mockPoint.x,
            mockPoint.y,
            mockRadii[0] + TEST_X_RADIUS * 2,
            mockRadii[1],
            PolygoneConstants.MIN_SIDES_COUNT,
            ToolConstants.FillMode.OUTLINE,
            TEST_PRIM_COLOR,
            TEST_PRIM_COLOR,
            TEST_LINE_WIDTH,
        );
        expect(getRadiusSpy).toHaveBeenCalled();
    });

    it('drawPolygoneType should call getDrawTypeRadius and change return value to xRadius', () => {
        const getRadiusSpy = spyOn<any>(command, 'getDrawTypeRadius').and.callThrough();
        // tslint:disable:no-string-literal
        command['drawTypePolygone'](
            testCtx,
            mockPoint.x,
            mockPoint.y,
            mockRadii[0],
            mockRadii[1] + TEST_X_RADIUS * 2,
            PolygoneConstants.MIN_SIDES_COUNT,
            ToolConstants.FillMode.OUTLINE,
            TEST_PRIM_COLOR,
            TEST_PRIM_COLOR,
            TEST_LINE_WIDTH,
        );
        expect(getRadiusSpy).toHaveBeenCalled();
    });

    it('drawTypePolygone should call ctx lineTo for odd sides', () => {
        const lineSpy = spyOn(testCtx, 'lineTo');
        command['drawTypePolygone'](
            testCtx,
            mockPoint.x,
            mockPoint.y,
            mockRadii[0],
            mockRadii[1],
            PolygoneConstants.MIN_SIDES_COUNT,
            ToolConstants.FillMode.OUTLINE_FILL,
            TEST_PRIM_COLOR,
            TEST_PRIM_COLOR,
            TEST_LINE_WIDTH,
        );
        expect(lineSpy).toHaveBeenCalled();
    });

    it('drawTypePolygone should change call ctx.moveTo for even sides', () => {
        const moveSpy = spyOn(testCtx, 'moveTo');
        const evenNumber = 4;
        command['drawTypePolygone'](
            testCtx,
            mockPoint.x,
            mockPoint.y,
            mockRadii[0],
            mockRadii[1],
            evenNumber,
            ToolConstants.FillMode.OUTLINE_FILL,
            TEST_PRIM_COLOR,
            TEST_PRIM_COLOR,
            TEST_LINE_WIDTH,
        );
        expect(moveSpy).toHaveBeenCalled();
    });

    it('drawTypePolygone should change call ctx.lineTo for even sides', () => {
        const lineSpy = spyOn(testCtx, 'lineTo');
        const evenNumber = 4;
        command['drawTypePolygone'](
            testCtx,
            mockPoint.x,
            mockPoint.y,
            mockRadii[0],
            mockRadii[1],
            evenNumber,
            ToolConstants.FillMode.OUTLINE_FILL,
            TEST_PRIM_COLOR,
            TEST_PRIM_COLOR,
            TEST_LINE_WIDTH,
        );
        expect(lineSpy).toHaveBeenCalled();
    });
});
