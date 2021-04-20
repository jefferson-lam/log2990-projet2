import { Injectable } from '@angular/core';
import { Command } from '@app/classes/command';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import * as MouseConstants from '@app/constants/mouse-constants';
import * as PencilConstants from '@app/constants/pencil-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PencilCommand } from '@app/services/tools/pencil/pencil-command';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class PencilService extends Tool {
    pathData: Vec2[];
    lineWidth: number;
    primaryColor: string;
    private previewCommand: PencilCommand;

    constructor(drawingService: DrawingService, undoRedoService: UndoRedoService) {
        super(drawingService, undoRedoService);
        this.primaryColor = 'black';
        this.clearPath();
        this.lineWidth = PencilConstants.MIN_SIZE_PENCIL;
        this.previewCommand = new PencilCommand(drawingService.previewCtx, this);
    }

    setPrimaryColor(color: string): void {
        this.primaryColor = color;
    }

    setLineWidth(width: number): void {
        if (width >= PencilConstants.MIN_SIZE_PENCIL && width <= PencilConstants.MAX_SIZE_PENCIL) {
            this.lineWidth = width;
        } else if (width >= PencilConstants.MAX_SIZE_PENCIL) {
            this.lineWidth = PencilConstants.MAX_SIZE_PENCIL;
        } else {
            this.lineWidth = PencilConstants.MIN_SIZE_PENCIL;
        }
    }

    onMouseDown(event: MouseEvent): void {
        this.inUse = event.button === MouseConstants.MouseButton.Left;
        if (this.inUse) {
            this.clearPath();

            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.inUse) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);

            const command: Command = new PencilCommand(this.drawingService.baseCtx, this);
            this.undoRedoService.executeCommand(command);

            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        }
        this.inUse = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.inUse) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);

            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);

            this.previewCommand.setValues(this.drawingService.previewCtx, this);
            this.previewCommand.execute();
        }
    }

    onMouseLeave(event: MouseEvent): void {
        if (this.inUse) {
            const command: Command = new PencilCommand(this.drawingService.baseCtx, this);
            this.undoRedoService.executeCommand(command);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        }
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

    onToolChange(): void {
        this.onMouseUp({} as MouseEvent);
    }
}
