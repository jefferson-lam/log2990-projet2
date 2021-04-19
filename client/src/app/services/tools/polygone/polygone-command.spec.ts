import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import * as PolygoneConstants from '@app/constants/polygone-constants';
import * as ShapeConstants from '@app/constants/shapes-constants';
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
    let mockNegativeRadius: number;
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
    const END_NEG_X = -20;
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
        mockNegativeRadius = END_NEG_X;

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

    it('drawPolygone should not set radiusWithin if negative', () => {
        spyOn<any>(command, 'getRadiiX').and.callFake(() => {
            return mockNegativeRadius;
        });
        const drawTypeSpy = spyOn<any>(command, 'drawTypePolygone');
        // tslint:disable:no-string-literal
        command['drawPolygone'](command['ctx']);
        expect(drawTypeSpy).not.toHaveBeenCalled();
    });

    it('drawPolygone should set fillMode to fill only', () => {
        // tslint:disable:no-string-literal
        command.primaryColor = 'black';
        command.fillMode = ToolConstants.FillMode.FILL_ONLY;
        const drawPolygoneSpy = spyOn<any>(command, 'drawPolygone');
        command['drawPolygone'](command['ctx']);
        expect(drawPolygoneSpy).toHaveBeenCalled();
    });

    it('drawPolygone should set fillMode to outline', () => {
        // tslint:disable:no-string-literal
        command.secondaryColor = 'black';
        command.fillMode = ToolConstants.FillMode.OUTLINE;
        const drawPolygoneSpy = spyOn<any>(command, 'drawPolygone');
        command['drawPolygone'](command['ctx']);
        expect(drawPolygoneSpy).toHaveBeenCalled();
    });

    it('drawPolygone should set fillMode to outline fill', () => {
        // tslint:disable:no-string-literal
        command.primaryColor = 'black';
        command.secondaryColor = 'black';
        command.fillMode = ToolConstants.FillMode.OUTLINE_FILL;
        const drawPolygoneSpy = spyOn<any>(command, 'drawPolygone');
        command['drawPolygone'](command['ctx']);
        expect(drawPolygoneSpy).toHaveBeenCalled();
    });

    it('drawPolygone should call getRadiiX', () => {
        const getRadiiSpy = spyOn<any>(command, 'getRadiiX').and.callFake(() => {
            return mockRadii;
        });
        // tslint:disable:no-string-literal
        command['drawPolygone'](command['ctx']);
        expect(getRadiiSpy).toHaveBeenCalled();
    });

    it('drawPolygone should call drawTypePolygone and change primary color', () => {
        spyOn<any>(command, 'getRadiiX').and.callFake(() => {
            return mockRadii;
        });
        const drawTypeSpy = spyOn<any>(command, 'drawTypePolygone');
        command.fillMode = ToolConstants.FillMode.FILL_ONLY;
        // tslint:disable:no-string-literal
        command['drawPolygone'](command['ctx']);
        expect(drawTypeSpy).toHaveBeenCalled();
    });

    it('drawPolygone should call drawTypePolygone and not change primary color', () => {
        spyOn<any>(command, 'getRadiiX').and.callFake(() => {
            return mockRadii;
        });
        const drawTypeSpy = spyOn<any>(command, 'drawTypePolygone');
        command.fillMode = ToolConstants.FillMode.OUTLINE;
        // tslint:disable:no-string-literal
        command['drawPolygone'](command['ctx']);
        expect(drawTypeSpy).toHaveBeenCalled();
    });

    it('drawPolygone should call drawTypePolygone with fill mode change', () => {
        spyOn<any>(command, 'getRadiiX').and.callFake(() => {
            return mockRadii;
        });
        const drawTypeSpy = spyOn<any>(command, 'drawTypePolygone');
        command.fillMode = ToolConstants.FillMode.OUTLINE_FILL;
        command.lineWidth = mockRadii[0];
        // tslint:disable:no-string-literal
        command['drawPolygone'](command['ctx']);
        expect(drawTypeSpy).toHaveBeenCalled();
    });

    it('drawTypePolygone should change fillStyle and fill if not FillMode.OUTLINE', () => {
        command.radiusWithin = mockRadius;
        command.centerPosition.x = mockPoint.x;
        command.centerPosition.y = mockPoint.y;
        command.numberSides = PolygoneConstants.MIN_SIDES_COUNT;
        command.fillMode = ToolConstants.FillMode.OUTLINE_FILL;
        command.primaryColor = TEST_PRIM_COLOR;
        command.borderColor = TEST_PRIM_COLOR;
        command.lineWidth = TEST_LINE_WIDTH;
        const fillSpy = spyOn(testCtx, 'fill');
        command['drawTypePolygone'](testCtx);
        expect(testCtx.fillStyle).toEqual(TEST_PRIMARY_COLOR_HEX);
        expect(fillSpy).toHaveBeenCalled();
    });

    it('drawTypePolygone should not change fillStyle and fill if FillMode.OUTLINE', () => {
        command.radiusWithin = mockRadius;
        command.centerPosition.x = mockPoint.x;
        command.centerPosition.y = mockPoint.y;
        command.numberSides = PolygoneConstants.MIN_SIDES_COUNT;
        command.fillMode = ToolConstants.FillMode.OUTLINE;
        command.primaryColor = TEST_PRIM_COLOR;
        command.borderColor = TEST_PRIM_COLOR;
        command.lineWidth = TEST_LINE_WIDTH;
        const fillSpy = spyOn(testCtx, 'fill');
        command['drawTypePolygone'](testCtx);
        expect(testCtx.fillStyle).not.toEqual(TEST_PRIMARY_COLOR_HEX);
        expect(fillSpy).not.toHaveBeenCalled();
    });

    it('drawTypePolygone should call ctx lineTo for odd sides', () => {
        command.radiusWithin = mockRadius;
        command.centerPosition.x = mockPoint.x;
        command.centerPosition.y = mockPoint.y;
        command.numberSides = PolygoneConstants.MIN_SIDES_COUNT;
        command.fillMode = ToolConstants.FillMode.OUTLINE_FILL;
        command.primaryColor = TEST_PRIM_COLOR;
        command.borderColor = TEST_PRIM_COLOR;
        command.lineWidth = TEST_LINE_WIDTH;
        const lineSpy = spyOn(testCtx, 'lineTo');
        command['drawTypePolygone'](testCtx);
        expect(lineSpy).toHaveBeenCalled();
    });

    it('drawTypePolygone should change call ctx.moveTo for even sides', () => {
        const EVEN_NUMBER = 4;
        command.radiusWithin = mockRadius;
        command.centerPosition.x = mockPoint.x;
        command.centerPosition.y = mockPoint.y;
        command.numberSides = EVEN_NUMBER;
        command.fillMode = ToolConstants.FillMode.OUTLINE_FILL;
        command.primaryColor = TEST_PRIM_COLOR;
        command.borderColor = TEST_PRIM_COLOR;
        command.lineWidth = TEST_LINE_WIDTH;
        const moveSpy = spyOn(testCtx, 'moveTo');
        command['drawTypePolygone'](testCtx);
        expect(moveSpy).toHaveBeenCalled();
    });

    it('drawTypePolygone should change call ctx.lineTo for even sides', () => {
        const lineSpy = spyOn(testCtx, 'lineTo');
        command['drawTypePolygone'](testCtx);
        expect(lineSpy).toHaveBeenCalled();
    });

    it('getPolygoneCenter should set polygone center', () => {
        const start = command.cornerCoords[ShapeConstants.START_INDEX];
        const end = command.cornerCoords[ShapeConstants.END_INDEX];
        const shortestSide = Math.min(Math.abs(end.x - start.x) / 2, Math.abs(end.y - start.y) / 2);
        const xVector = end.x - start.x;
        const yVector = end.y - start.y;

        // tslint:disable:no-string-literal
        command['getPolygoneCenter'](start, end);

        expect(command.centerPosition.x).toEqual(start.x + Math.sign(xVector) * shortestSide);
        expect(command.centerPosition.y).toEqual(start.y + Math.sign(yVector) * shortestSide);
    });

    it('getRadiiXAndY should set radius to shortest side always', () => {
        const start = command.cornerCoords[ShapeConstants.START_INDEX];
        const end = command.cornerCoords[ShapeConstants.END_INDEX];
        const xRadius = Math.abs(end.x - start.x) / 2;
        const yRadius = Math.abs(end.y - start.y) / 2;
        const shortestSide = Math.min(Math.abs(xRadius), Math.abs(yRadius));

        // tslint:disable:no-string-literal
        const radii = command['getRadiiX'](command.cornerCoords);

        expect(radii).toEqual(shortestSide);
    });
});
