import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Command } from '@app/classes/command';
import { UndoRedoService } from './undo-redo.service';

export class CommandStub extends Command {
    execute(): void {
        return;
    }
}

// tslint:disable:no-string-literal
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
    let updateSpy: jasmine.Spy;

    let canvasTestHelper: CanvasTestHelper;
    let baseCtxStub: CanvasRenderingContext2D;

    let commandStub: CommandStub;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(UndoRedoService);

        commandStub = new CommandStub();
        service.resetCanvasSize = commandStub;

        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        service['drawingService'].canvas = canvasTestHelper.canvas;
        service['drawingService'].baseCtx = baseCtxStub;

        mockEmptyPile = [];
        mockPile = [commandStub];
        refreshSpy = spyOn(service, 'refresh').and.callThrough();
        emitSpy = spyOn(service['actionsAllowedSource'], 'next');

        undoPopSpy = spyOn(service.undoPile, 'pop');
        undoPushSpy = spyOn(service.undoPile, 'push');
        redoPopSpy = spyOn(service.redoPile, 'pop');
        redoPushSpy = spyOn(service.redoPile, 'push');
        updateSpy = spyOn(service, 'updateActionsAllowed');
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('reset should empty piles', () => {
        service.reset();

        expect(service.undoPile).toEqual(mockEmptyPile);
        expect(service.redoPile).toEqual(mockEmptyPile);
    });

    it('reset should call updateActionsAllowed with true', () => {
        service.reset();

        expect(updateSpy).toHaveBeenCalled();
        expect(updateSpy).toHaveBeenCalledWith(true);
    });

    it('executeCommand should push command on undoPile', () => {
        Object.assign(service.undoPile, mockEmptyPile);

        service.executeCommand(commandStub);

        expect(undoPushSpy).toHaveBeenCalledWith(commandStub);
    });

    it('executeCommand should call updateActionsAllowed with true', () => {
        Object.assign(service.undoPile, mockEmptyPile);
        Object.assign(service.redoPile, mockEmptyPile);

        service.executeCommand(commandStub);

        expect(updateSpy).toHaveBeenCalled();
        expect(updateSpy).toHaveBeenCalledWith(true);
    });

    it('undo should return if !isUndoAllowed', () => {
        service.isUndoAllowed = false;
        service.undo();

        expect(undoPopSpy).not.toHaveBeenCalled();
        expect(redoPushSpy).not.toHaveBeenCalled();
        expect(refreshSpy).not.toHaveBeenCalled();
    });

    it('undo should push popped command on redoPile if isUndoAllowed', () => {
        service.isUndoAllowed = true;
        service.undo();

        expect(undoPopSpy).toHaveBeenCalled();
        expect(redoPushSpy).toHaveBeenCalled();
    });

    it('undo should call refresh if isUndoAllowed', () => {
        service.isUndoAllowed = true;
        service.undo();

        expect(refreshSpy).toHaveBeenCalled();
    });

    it('redo should return if !isRedoAllowed', () => {
        service.isRedoAllowed = false;
        service.redo();

        expect(redoPopSpy).not.toHaveBeenCalled();
        expect(undoPushSpy).not.toHaveBeenCalled();
        expect(refreshSpy).not.toHaveBeenCalled();
    });

    it('redo should push popped command on undoPile if isRedoAllowed', () => {
        service.isRedoAllowed = true;
        service.redo();

        expect(redoPopSpy).toHaveBeenCalled();
        expect(undoPushSpy).toHaveBeenCalled();
    });

    it('redo should call refresh if isRedoAllowed', () => {
        service.isRedoAllowed = true;
        service.redo();

        expect(refreshSpy).toHaveBeenCalled();
    });

    it('refresh should call updateActions allowed with true', () => {
        refreshSpy.and.callThrough();

        service.refresh();

        expect(updateSpy).toHaveBeenCalled();
        expect(updateSpy).toHaveBeenCalledWith(true);
    });

    it('refresh should white out base canvas', () => {
        // tslint:disable:no-string-literal
        const whiteOutSpy = spyOn(service['drawingService'], 'whiteOut');

        service.refresh();

        expect(whiteOutSpy).toHaveBeenCalled();
        expect(whiteOutSpy).toHaveBeenCalledWith(baseCtxStub);
    });

    it('refresh should execute commands', () => {
        service.undoPile = mockPile;
        const forEachSpy = spyOn(service.undoPile, 'forEach').and.callThrough();
        const executeSpy = spyOn(service.undoPile[0], 'execute');

        service.refresh();

        expect(forEachSpy).toHaveBeenCalled();
        expect(executeSpy).toHaveBeenCalled();
    });

    it('refresh should execute resetCanvasSize', () => {
        const executeSpy = spyOn(service.resetCanvasSize, 'execute');

        service.refresh();

        expect(executeSpy).toHaveBeenCalled();
    });

    it('refresh should call drawingService.baseCtx.drawImage if initialImage.src is not empty', () => {
        service.initialImage = new Image();
        service.initialImage.src =
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAADElEQVQImWNgoBMAAABpAAFEI8ARAAAAAElFTkSuQmCC';
        // tslint:disable:no-string-literal
        const drawImageSpy = spyOn(service['drawingService'].baseCtx, 'drawImage');

        service.refresh();

        expect(drawImageSpy).toHaveBeenCalled();
    });

    it('isUndoPileEmpty should return true if undo pile is empty', () => {
        service.undoPile = [];
        const result = service.isUndoPileEmpty();
        expect(result).toBeTrue();
    });

    it('isUndoPileEmpty should return false if undo pile is not empty', () => {
        service.undoPile = [{} as Command];
        const result = service.isUndoPileEmpty();
        expect(result).toBeFalse();
    });

    it('isRedoPileEmpty should return true if redo pile is empty', () => {
        service.redoPile = [];
        const result = service.isRedoPileEmpty();
        expect(result).toBeTrue();
    });

    it('isRedoPileEmpty should return false if redo pile is not empty', () => {
        service.redoPile = [{} as Command];
        const result = service.isRedoPileEmpty();
        expect(result).toBeFalse();
    });

    it('updateActionsAllowed should set both isUndoAllowed and isRedoAllowed to false if called with false', () => {
        updateSpy.and.callThrough();
        service.isRedoAllowed = true;
        service.isUndoAllowed = true;

        service.updateActionsAllowed(false);

        expect(service.isUndoAllowed).toBeFalse();
        expect(service.isRedoAllowed).toBeFalse();
        expect(emitSpy).toHaveBeenCalled();
        expect(emitSpy).toHaveBeenCalledWith([service.isUndoAllowed, service.isRedoAllowed]);
    });

    it('updateActionsAllowed should set both isUndoAllowed and isRedoAllowed to true if called with true and piles not empty', () => {
        spyOn(service, 'isUndoPileEmpty').and.callFake(() => {
            return false;
        });
        spyOn(service, 'isRedoPileEmpty').and.callFake(() => {
            return false;
        });
        updateSpy.and.callThrough();
        service.isRedoAllowed = false;
        service.isUndoAllowed = false;

        service.updateActionsAllowed(true);

        expect(service.isUndoAllowed).toBeTrue();
        expect(service.isRedoAllowed).toBeTrue();
        expect(emitSpy).toHaveBeenCalled();
        expect(emitSpy).toHaveBeenCalledWith([service.isUndoAllowed, service.isRedoAllowed]);
    });

    it('updateActionsAllowed should set only isUndoAllowed to true if called with true and undo pile not empty', () => {
        spyOn(service, 'isUndoPileEmpty').and.callFake(() => {
            return false;
        });
        spyOn(service, 'isRedoPileEmpty').and.callFake(() => {
            return true;
        });
        updateSpy.and.callThrough();
        service.isRedoAllowed = false;
        service.isUndoAllowed = false;

        service.updateActionsAllowed(true);

        expect(service.isUndoAllowed).toBeTrue();
        expect(service.isRedoAllowed).toBeFalse();
        expect(emitSpy).toHaveBeenCalled();
        expect(emitSpy).toHaveBeenCalledWith([service.isUndoAllowed, service.isRedoAllowed]);
    });

    it('updateActionsAllowed should set only isRedoAllowed to true if called with true and redo pile not empty', () => {
        spyOn(service, 'isUndoPileEmpty').and.callFake(() => {
            return true;
        });
        spyOn(service, 'isRedoPileEmpty').and.callFake(() => {
            return false;
        });
        updateSpy.and.callThrough();
        service.isRedoAllowed = false;
        service.isUndoAllowed = false;

        service.updateActionsAllowed(true);

        expect(service.isUndoAllowed).toBeFalse();
        expect(service.isRedoAllowed).toBeTrue();
        expect(emitSpy).toHaveBeenCalled();
        expect(emitSpy).toHaveBeenCalledWith([service.isUndoAllowed, service.isRedoAllowed]);
    });
});
