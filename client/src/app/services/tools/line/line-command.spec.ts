import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { LineCommand } from '@app/services/tools/line/line-command';
import { LineService } from '@app/services/tools/line/line-service';

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

    it('execute should call drawLine', () => {
        command.execute();

        expect(drawLineSpy).toHaveBeenCalled();
    });

    it('drawLine should call arc if withJunction', () => {
        const arcSpy = spyOn(baseCtxStub, 'arc');

        // tslint:disable-next-line:no-string-literal
        command['drawLine'](baseCtxStub, pathStub);

        expect(arcSpy).toHaveBeenCalled();
    });

    it('drawLine should not call arc if not withJunction', () => {
        const arcSpy = spyOn(baseCtxStub, 'arc');

        // tslint:disable-next-line:no-string-literal
        command['withJunction'] = false;
        // tslint:disable-next-line:no-string-literal
        command['drawLine'](baseCtxStub, pathStub);

        expect(arcSpy).not.toHaveBeenCalled();
    });
});
