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
        this.moveCursor(this.drawingService.previewCtx, event);

        if (this.inUse) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.previewCommand.setValues(this.drawingService.baseCtx, this);
            this.previewCommand.execute();
        }
    }

    private moveCursor(ctx: CanvasRenderingContext2D, event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        this.drawingService.clearCanvas(ctx);

        ctx.lineWidth = 1;
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';

        ctx.beginPath();
        ctx.rect(mousePosition.x - this.lineWidth / 2, mousePosition.y - this.lineWidth / 2, this.lineWidth, this.lineWidth);
        ctx.fillRect(mousePosition.x - this.lineWidth / 2, mousePosition.y - this.lineWidth / 2, this.lineWidth, this.lineWidth);
        ctx.stroke();
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

    private clearPath(): void {
        this.pathData = [];
    }
}
