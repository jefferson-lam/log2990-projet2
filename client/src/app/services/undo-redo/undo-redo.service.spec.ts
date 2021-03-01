import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Command } from '@app/classes/command';
import { UndoRedoService } from './undo-redo.service';

export class CommandStub extends Command {
    execute(): void {
        return;
    }
}

describe('UndoRedoService', () => {
    let service: UndoRedoService;
    let mockPile: Command[];
    let mockEmptyPile: Command[];
    let refreshSpy: jasmine.Spy;
    let emitSpy: jasmine.Spy;
    let undoPopSpy: jasmine.Spy;
    let undoPushSpy: jasmine.Spy;
    let redoPopSpy: jasmine.Spy;
    let redoPushSpy: jasmine.Spy;

    let canvasTestHelper: CanvasTestHelper;
    let baseCtxStub: CanvasRenderingContext2D;

    let commandStub: CommandStub;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(UndoRedoService);

        commandStub = new CommandStub();

        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        // tslint:disable:no-string-literal
        service['drawingService'].canvas = canvasTestHelper.canvas;
        service['drawingService'].baseCtx = baseCtxStub;

        mockEmptyPile = [];
        mockPile = [commandStub];
        refreshSpy = spyOn(service, 'refresh').and.callThrough();
        emitSpy = spyOn(service.pileSizeSource, 'next');

        undoPopSpy = spyOn(service.undoPile, 'pop');
        undoPushSpy = spyOn(service.undoPile, 'push');
        redoPopSpy = spyOn(service.redoPile, 'pop');
        redoPushSpy = spyOn(service.redoPile, 'push');
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('reset should empty piles', () => {
        service.reset();

        expect(service.undoPile).toEqual(mockEmptyPile);
        expect(service.redoPile).toEqual(mockEmptyPile);
    });

    it('reset should emit empty size of piles', () => {
        service.reset();

        expect(emitSpy).toHaveBeenCalledWith([0, 0]);
    });

    it('executeCommand should push command on undoPile', () => {
        Object.assign(service.undoPile, mockEmptyPile);

        service.executeCommand(commandStub);

        expect(undoPushSpy).toHaveBeenCalledWith(commandStub);
    });

    it('executeCommand should emit new pile sizes', () => {
        Object.assign(service.undoPile, mockEmptyPile);
        Object.assign(service.redoPile, mockEmptyPile);

        service.executeCommand(commandStub);

        expect(emitSpy).toHaveBeenCalledWith([service.undoPile.length, service.redoPile.length]);
    });

    it('undo should return if undoPile is empty', () => {
        service.undoPile = mockEmptyPile;
        service.undo();

        expect(undoPopSpy).not.toHaveBeenCalled();
        expect(redoPushSpy).not.toHaveBeenCalled();
        expect(refreshSpy).not.toHaveBeenCalled();
    });

    it('undo should push popped command on redoPile if undoPile is not empty', () => {
        Object.assign(service.undoPile, mockPile);
        Object.assign(service.redoPile, mockEmptyPile);
        service.undo();

        expect(undoPopSpy).toHaveBeenCalled();
        expect(redoPushSpy).toHaveBeenCalled();
    });

    it('undo should call refresh if undoPile is not empty', () => {
        Object.assign(service.undoPile, mockPile);
        service.undo();

        expect(refreshSpy).toHaveBeenCalled();
    });

    it('redo should return if redoPile is empty', () => {
        Object.assign(service.redoPile, mockEmptyPile);
        service.redo();

        expect(redoPopSpy).not.toHaveBeenCalled();
        expect(undoPushSpy).not.toHaveBeenCalled();
        expect(refreshSpy).not.toHaveBeenCalled();
    });

    it('redo should push popped command on undoPile if redoPile is not empty', () => {
        Object.assign(service.redoPile, mockPile);
        Object.assign(service.undoPile, mockEmptyPile);
        service.redo();

        expect(redoPopSpy).toHaveBeenCalled();
        expect(undoPushSpy).toHaveBeenCalled();
    });

    it('redo should call refresh if redoPile is not empty', () => {
        Object.assign(service.redoPile, mockPile);
        service.redo();

        expect(refreshSpy).toHaveBeenCalled();
    });

    it('refresh should emit pile sizes', () => {
        refreshSpy.and.callThrough();
        Object.assign(service.undoPile, mockEmptyPile);
        Object.assign(service.redoPile, mockEmptyPile);

        service.refresh();

        expect(emitSpy).toHaveBeenCalledWith([service.undoPile.length, service.redoPile.length]);
    });

    it('refresh should clear base canvas', () => {
        // tslint:disable:no-string-literal
        const clearCanvasSpy = spyOn(service['drawingService'], 'clearCanvas');

        service.refresh();

        expect(clearCanvasSpy).toHaveBeenCalled();
        expect(clearCanvasSpy).toHaveBeenCalledWith(baseCtxStub);
    });

    it('refresh should execute commands', () => {
        service.undoPile = mockPile;
        const forEachSpy = spyOn(service.undoPile, 'forEach').and.callThrough();
        const executeSpy = spyOn(service.undoPile[0], 'execute');

        service.refresh();

        expect(forEachSpy).toHaveBeenCalled();
        expect(executeSpy).toHaveBeenCalled();
    });
});
