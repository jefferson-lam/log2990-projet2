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

    initialImage: HTMLImageElement;
    resetCanvasSize: Command;

    pileSizeSource: Subject<number[]> = new BehaviorSubject<number[]>([this.undoPile.length, this.redoPile.length]);
    pileSizeObservable: Observable<number[]> = this.pileSizeSource.asObservable();

    constructor(private drawingService: DrawingService) {
        this.reset();
        this.initialImage = new Image();
    }

    reset(): void {
        this.undoPile = [];
        this.redoPile = [];
        this.pileSizeSource.next([this.undoPile.length, this.redoPile.length]);
    }

    executeCommand(command: Command): void {
        command.execute();
        this.undoPile.push(command);
        this.redoPile = [];
        this.pileSizeSource.next([this.undoPile.length, this.redoPile.length]);
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
        this.drawingService.clearCanvas(this.drawingService.baseCtx);
        this.resetCanvasSize.execute();
        if (this.initialImage.src !== '') {
            this.drawingService.baseCtx.drawImage(this.initialImage, 0, 0, this.initialImage.width, this.initialImage.height);
        }
        this.undoPile.forEach((c) => c.execute());
        this.pileSizeSource.next([this.undoPile.length, this.redoPile.length]);
    }

    isUndoPileEmpty(): boolean {
        if (this.undoPile.length) return false;
        return true;
    }
}
