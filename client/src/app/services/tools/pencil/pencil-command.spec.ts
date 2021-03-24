import { TestBed } from '@angular/core/testing';

import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { PencilService } from '@app/services/tools/pencil/pencil-service';
import { PencilCommand } from './pencil-command';

// tslint:disable:no-any
describe('PencilCommandService', () => {
    let command: PencilCommand;
    let pencilService: PencilService;

    let canvasTestHelper: CanvasTestHelper;
    let baseCtxStub: CanvasRenderingContext2D;

    let drawLineSpy: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        pencilService = TestBed.inject(PencilService);

        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;

        pencilService.pathData = Object.assign(
            [],
            [
                { x: 0, y: 0 },
                { x: 1, y: 1 },
            ],
        );

        command = new PencilCommand(baseCtxStub, pencilService);

        drawLineSpy = spyOn<any>(command, 'drawLine').and.callThrough();
    });

    it('should be created', () => {
        expect(command).toBeTruthy();
    });

    it('execute should call drawLine', () => {
        command.execute();

        expect(drawLineSpy).toHaveBeenCalled();
    });

    it('setValues should set values', () => {
        command.setValues({} as CanvasRenderingContext2D, pencilService);

        // tslint:disable:no-string-literal
        expect(command['path']).toEqual(pencilService.pathData);
        expect(command['lineWidth']).toEqual(pencilService.lineWidth);
        expect(command['primaryColor']).toEqual(pencilService.primaryColor);
    });

    it('drawLine should call canvas functions', () => {
        const beginSpy = spyOn(baseCtxStub, 'beginPath').and.callThrough();
        const lineToSpy = spyOn(baseCtxStub, 'lineTo').and.callThrough();
        const strokeSpy = spyOn(baseCtxStub, 'stroke').and.callThrough();

        command['drawLine'](command['ctx'], command['path']);

        expect(drawLineSpy).toHaveBeenCalled();
        expect(beginSpy).toHaveBeenCalled();
        expect(lineToSpy).toHaveBeenCalled();
        expect(strokeSpy).toHaveBeenCalled();
    });
});
