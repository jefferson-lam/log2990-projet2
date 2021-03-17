import { Injectable } from '@angular/core';
import { Command } from '@app/classes/command';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UndoRedoService {
    undoPile: Command[] = [];
    redoPile: Command[] = [];

    resetCanvasSize: Command;

    pileSizeSource: Subject<number[]> = new BehaviorSubject<number[]>([this.undoPile.length, this.redoPile.length]);
    pileSizeObservable: Observable<number[]> = this.pileSizeSource.asObservable();

    constructor(private drawingService: DrawingService) {
        this.reset();
    }

    reset(): void {
        this.undoPile = [];
        this.redoPile = [];
        this.pileSizeSource.next([this.undoPile.length, this.redoPile.length]);
    }

    executeCommand(command: Command): void {
        this.undoPile.push(command);
        this.redoPile = [];
        this.pileSizeSource.next([this.undoPile.length, this.redoPile.length]);
        command.execute();
    }

    undo(): void {
        if (this.undoPile.length === 0) return;

        this.redoPile.push(this.undoPile.pop() as Command);
        this.refresh();
    }

    redo(): void {
        if (this.redoPile.length === 0) return;

        this.undoPile.push(this.redoPile.pop() as Command);
        this.refresh();
    }

    refresh(): void {
        this.pileSizeSource.next([this.undoPile.length, this.redoPile.length]);
        this.drawingService.clearCanvas(this.drawingService.baseCtx);
        this.resetCanvasSize.execute();
        this.undoPile.forEach((c) => c.execute());
    }
}
