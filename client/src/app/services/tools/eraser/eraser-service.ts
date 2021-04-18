import { Injectable } from '@angular/core';
import { Command } from '@app/classes/command';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import * as EraserConstants from '@app/constants/eraser-constants';
import * as MouseConstants from '@app/constants/mouse-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EraserCommand } from '@app/services/tools/eraser/eraser-command';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class EraserService extends Tool {
    pathData: Vec2[];
    lineWidth: number;
    previewCommand: EraserCommand;

    constructor(drawingService: DrawingService, undoRedoService: UndoRedoService) {
        super(drawingService, undoRedoService);
        this.clearPath();
        this.lineWidth = EraserConstants.MIN_SIZE_ERASER;
        this.previewCommand = new EraserCommand(this.drawingService.previewCtx, this);
    }

    setLineWidth(width: number): void {
        if (width >= EraserConstants.MIN_SIZE_ERASER && width <= EraserConstants.MAX_SIZE_ERASER) {
            this.lineWidth = width;
        } else if (width > EraserConstants.MAX_SIZE_ERASER) {
            this.lineWidth = EraserConstants.MAX_SIZE_ERASER;
        } else {
            this.lineWidth = EraserConstants.MIN_SIZE_ERASER;
        }
    }

    onMouseDown(event: MouseEvent): void {
        this.inUse = event.button === MouseConstants.MouseButton.Left;
        if (this.inUse) {
            this.clearPath();

            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);
            this.previewCommand.setValues(this.drawingService.baseCtx, this);
            this.previewCommand.execute();
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.inUse) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            const command: Command = new EraserCommand(this.drawingService.baseCtx, this);
            this.undoRedoService.executeCommand(command);
        }
        this.inUse = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        this.drawCursor(this.getPositionFromMouse(event));

        if (this.inUse) {
            this.pathData.push(this.getPositionFromMouse(event));
            this.previewCommand.setValues(this.drawingService.baseCtx, this);
            this.previewCommand.execute();
        }
    }

    onMouseLeave(event: MouseEvent): void {
        if (this.inUse) {
            const command: Command = new EraserCommand(this.drawingService.baseCtx, this);
            this.undoRedoService.executeCommand(command);
        }
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.clearPath();
    }

    onMouseEnter(event: MouseEvent): void {
        if (event.buttons === MouseConstants.MouseButton.Left) {
            this.inUse = false;
        }
    }

    drawCursor(position: Vec2): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);

        this.drawingService.previewCtx.lineWidth = 1;
        this.drawingService.previewCtx.fillStyle = 'white';
        this.drawingService.previewCtx.strokeStyle = 'black';

        this.drawingService.previewCtx.beginPath();
        this.drawingService.previewCtx.rect(position.x - this.lineWidth / 2, position.y - this.lineWidth / 2, this.lineWidth, this.lineWidth);
        this.drawingService.previewCtx.fillRect(position.x - this.lineWidth / 2, position.y - this.lineWidth / 2, this.lineWidth, this.lineWidth);
        this.drawingService.previewCtx.stroke();
    }

    onToolChange(): void {
        this.onMouseUp({} as MouseEvent);
    }

    private clearPath(): void {
        this.pathData = [];
    }
}
