import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { LineCommand } from '@app/services/tools/line/line-command';
import { LineService } from '@app/services/tools/line/line-service';

// tslint:disable:no-any
describe('LineCommand', () => {
    let command: LineCommand;
    let lineService: LineService;

    let pathStub: Vec2[];

    let drawLineSpy: jasmine.Spy;

    let canvasTestHelper: CanvasTestHelper;
    let baseCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        lineService = TestBed.inject(LineService);

        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;

        pathStub = [
            { x: 5, y: 5 },
            { x: 10, y: 10 },
            { x: 15, y: 15 },
        ] as Vec2[];

        lineService.linePathData = Object.assign([], pathStub);
        lineService.lineWidth = 2;

        command = new LineCommand(baseCtxStub, lineService);
        drawLineSpy = spyOn<any>(command, 'drawLine').and.callThrough();
    });

    it('should be created', () => {
        expect(command).toBeTruthy();
    });

    it('setValues should set isPreview to true', () => {
        command.setValues(baseCtxStub, lineService);

        expect(command.isPreview).toBeTrue();
    });

    it('setValues should assign ctx to command', () => {
        command.setValues(baseCtxStub, lineService);

        // tslint:disable-next-line:no-string-literal
        expect(command['ctx']).toBe(baseCtxStub);
    });

    it('setValues should assign lineService values to command', () => {
        command.setValues(baseCtxStub, lineService);

        expect(command.path).toEqual(lineService.linePathData);
        expect(command.withJunction).toBe(lineService.withJunction);
        expect(command.junctionRadius).toBe(lineService.junctionRadius);
        expect(command.lineWidth).toBe(lineService.lineWidth);
        expect(command.primaryColor).toBe(lineService.primaryColor);
    });

    it('execute should call drawLine', () => {
        command.execute();

        expect(drawLineSpy).toHaveBeenCalled();
    });

    it('drawLine should call clearRect if isPreview', () => {
        const clearRectSpy = spyOn(baseCtxStub, 'clearRect');
        command.isPreview = true;

        // tslint:disable-next-line:no-string-literal
        command['drawLine'](baseCtxStub, pathStub);

        expect(clearRectSpy).toHaveBeenCalled();
    });

    it('drawLine should call drawJunctions if withJunction', () => {
        const drawJunctionsSpy = spyOn(command, 'drawJunctions');
        command.withJunction = true;

        // tslint:disable-next-line:no-string-literal
        command['drawLine'](baseCtxStub, pathStub);

        expect(drawJunctionsSpy).toHaveBeenCalled();
    });

    it('drawJunctions should set fillstyle', () => {
        command.drawJunctions(baseCtxStub, pathStub);

        expect(baseCtxStub.fillStyle).toBe('#000000');
    });

    it('drawJunctions should call arc and other canvas functions', () => {
        const beginPathSpy = spyOn(baseCtxStub, 'beginPath');
        const arcSpy = spyOn(baseCtxStub, 'arc');
        const fillSpy = spyOn(baseCtxStub, 'fill');

        command.drawJunctions(baseCtxStub, pathStub);

        expect(beginPathSpy).toHaveBeenCalled();
        expect(arcSpy).toHaveBeenCalled();
        expect(arcSpy).toHaveBeenCalledTimes(pathStub.length);
        expect(fillSpy).toHaveBeenCalled();
    });

    it('drawLine should not call drawJunctions if not withJunction', () => {
        const drawJunctionsSpy = spyOn(command, 'drawJunctions');

        command.withJunction = false;
        // tslint:disable-next-line:no-string-literal
        command['drawLine'](baseCtxStub, pathStub);

        expect(drawJunctionsSpy).not.toHaveBeenCalled();
    });
});
