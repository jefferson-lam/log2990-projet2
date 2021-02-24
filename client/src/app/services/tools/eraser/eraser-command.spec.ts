import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { EraserService } from '@app/services/tools/eraser/eraser-service';
import { EraserCommand } from './eraser-command';

// tslint:disable:no-any
describe('EraserCommand', () => {
    let command: EraserCommand;
    let eraserService: EraserService;

    let pathStub: Vec2[];

    let eraseSpy: jasmine.Spy;
    let eraseSquareSpy: jasmine.Spy;
    let cornersSpy: jasmine.Spy;

    let canvasTestHelper: CanvasTestHelper;
    let baseCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        eraserService = TestBed.inject(EraserService);

        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;

        pathStub = [
            { x: 5, y: 5 },
            { x: 10, y: 10 },
            { x: 15, y: 15 },
        ] as Vec2[];

        eraserService.pathData = Object.assign([], pathStub);
        eraserService.lineWidth = 2;

        command = new EraserCommand(baseCtxStub, eraserService);
        eraseSquareSpy = spyOn<any>(command, 'eraseSquare').and.callThrough();
        eraseSpy = spyOn<any>(command, 'erase').and.callThrough();
        cornersSpy = spyOn<any>(command, 'getCorners').and.callThrough();
    });

    it('should be created', () => {
        expect(command).toBeTruthy();
    });

    it('execute should call eraseSquare and not call erase if path is just one point', () => {
        // tslint:disable:no-string-literal
        command['path'] = Object.assign([], [{ x: 0, y: 0 }]);
        command.execute();

        expect(eraseSquareSpy).toHaveBeenCalled();
        expect(eraseSpy).not.toHaveBeenCalled();
    });

    it('execute should call erase one time if is preview', () => {
        command['preview'] = true;
        command.execute();

        expect(eraseSpy).toHaveBeenCalled();
        expect(eraseSpy).toHaveBeenCalledWith(command['ctx'], pathStub);
        expect(eraseSpy).toHaveBeenCalledTimes(1);
    });

    it('execute should call erase length of path - 1 times if is not preview', () => {
        command.execute();

        expect(eraseSpy).toHaveBeenCalled();
        expect(eraseSpy).toHaveBeenCalledWith(command['ctx'], pathStub, 1);
        expect(eraseSpy).toHaveBeenCalledTimes(pathStub.length - 1);
    });

    it('setValues should set values', () => {
        command.setValues({} as CanvasRenderingContext2D, eraserService);

        expect(command['preview']).toBeTrue();
        expect(command['path']).toEqual(eraserService.pathData);
        expect(command['lineWidth']).toEqual(eraserService.lineWidth);
    });

    it('erase should call getCorners and eraseSquare', () => {
        command['erase'](command['ctx'], command['path']);

        expect(cornersSpy).toHaveBeenCalled();
        expect(eraseSquareSpy).toHaveBeenCalled();
    });

    it('eraseSquare should call canvas functions', () => {
        const beginSpy = spyOn(baseCtxStub, 'beginPath').and.callThrough();
        const rectSpy = spyOn(baseCtxStub, 'rect').and.callThrough();
        const fillSpy = spyOn(baseCtxStub, 'fill').and.callThrough();

        command['eraseSquare'](command['ctx'], command['path']);

        expect(eraseSquareSpy).toHaveBeenCalledWith(baseCtxStub, pathStub);
        expect(beginSpy).toHaveBeenCalled();
        expect(rectSpy).toHaveBeenCalled();
        expect(fillSpy).toHaveBeenCalled();
    });

    it('eraseSquare should call canvas functions with index', () => {
        const beginSpy = spyOn(baseCtxStub, 'beginPath').and.callThrough();
        const rectSpy = spyOn(baseCtxStub, 'rect').and.callThrough();
        const fillSpy = spyOn(baseCtxStub, 'fill').and.callThrough();

        command['eraseSquare'](command['ctx'], command['path'], 2);

        expect(eraseSquareSpy).toHaveBeenCalledWith(baseCtxStub, pathStub, 2);
        expect(beginSpy).toHaveBeenCalled();
        expect(rectSpy).toHaveBeenCalled();
        expect(fillSpy).toHaveBeenCalled();
    });

    it('getCorners of positive vector coordinates product returns bottom left and top right corners', () => {
        const corners: Vec2[] = command['getCorners'](pathStub[pathStub.length - 1], pathStub[pathStub.length - 2], command['lineWidth']);
        const expectedCorners = [
            { x: 9, y: 11 },
            { x: 11, y: 9 },
            { x: 14, y: 16 },
            { x: 16, y: 14 },
        ] as Vec2[];

        expect(cornersSpy).toHaveBeenCalled();
        expect(corners).toEqual(expectedCorners);
    });

    it('getCorners of negative vector coordinates product returns bottom right and top left corners', () => {
        const mockPath = [
            { x: 5, y: 10 },
            { x: 10, y: 5 },
        ] as Vec2[];

        command['path'] = Object.assign([], mockPath);

        const corners: Vec2[] = command['getCorners'](mockPath[mockPath.length - 1], mockPath[mockPath.length - 2], command['lineWidth']);
        const expectedCorners = [
            { x: 6, y: 11 },
            { x: 4, y: 9 },
            { x: 11, y: 6 },
            { x: 9, y: 4 },
        ] as Vec2[];

        expect(cornersSpy).toHaveBeenCalled();
        expect(corners).toEqual(expectedCorners);
    });
});
