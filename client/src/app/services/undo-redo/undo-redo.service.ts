import { Injectable } from '@angular/core';
import { Command } from '@app/classes/command';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UndoRedoService {
    undoPile: Command[];
    redoPile: Command[];
    isUndoAllowed: boolean;
    isRedoAllowed: boolean;

    initialImage: HTMLImageElement | undefined;
    resetCanvasSize: Command;

    private actionsAllowedSource: Subject<boolean[]>;
    actionsAllowedObservable: Observable<boolean[]>;

    private pileSizeSource: Subject<number[]>;
    pileSizeObservable: Observable<number[]>;

    constructor(private drawingService: DrawingService) {
        this.undoPile = [];
        this.redoPile = [];
        this.isUndoAllowed = false;
        this.isRedoAllowed = false;
        this.pileSizeSource = new BehaviorSubject([this.undoPile.length, this.redoPile.length]);
        this.pileSizeObservable = this.pileSizeSource.asObservable();
        this.actionsAllowedSource = new BehaviorSubject([this.isUndoAllowed, this.isRedoAllowed]);
        this.actionsAllowedObservable = this.actionsAllowedSource.asObservable();
        this.reset();
    }

    reset(): void {
        this.undoPile = [];
        this.redoPile = [];
        this.updateActionsAllowed(true);
        this.pileSizeSource.next([this.undoPile.length, this.redoPile.length]);
    }

    executeCommand(command: Command): void {
        command.execute();
        this.undoPile.push(command);
        this.redoPile = [];
        this.updateActionsAllowed(true);
        this.pileSizeSource.next([this.undoPile.length, this.redoPile.length]);
    }

    undo(): void {
        if (!this.isUndoAllowed) return;
        this.redoPile.push(this.undoPile.pop() as Command);
        this.refresh();
    }

    redo(): void {
        if (!this.isRedoAllowed) return;
        this.undoPile.push(this.redoPile.pop() as Command);
        this.refresh();
    }

    refresh(): void {
        this.drawingService.clearCanvas(this.drawingService.baseCtx);
        this.resetCanvasSize.execute();
        if (this.initialImage !== undefined) {
            this.drawingService.baseCtx.drawImage(this.initialImage, 0, 0, this.initialImage.width, this.initialImage.height);
        }
        this.undoPile.forEach((c) => c.execute());
        this.updateActionsAllowed(true);
        this.pileSizeSource.next([this.undoPile.length, this.redoPile.length]);
    }

    isUndoPileEmpty(): boolean {
        if (this.undoPile.length) return false;
        return true;
    }

    isRedoPileEmpty(): boolean {
        if (this.redoPile.length) return false;
        return true;
    }

    updateActionsAllowed(isAllowed: boolean): void {
        if (!isAllowed) {
            this.isUndoAllowed = false;
            this.isRedoAllowed = false;
            this.actionsAllowedSource.next([this.isUndoAllowed, this.isRedoAllowed]);
            return;
        }
        if (!this.isUndoPileEmpty()) this.isUndoAllowed = true;
        if (!this.isRedoPileEmpty()) this.isRedoAllowed = true;

        this.actionsAllowedSource.next([this.isUndoAllowed, this.isRedoAllowed]);
    }
}
