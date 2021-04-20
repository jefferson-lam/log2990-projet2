import { Injectable } from '@angular/core';
import { Command } from '@app/classes/command';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import * as MouseConstants from '@app/constants/mouse-constants';
import * as ShapeConstants from '@app/constants/shapes-constants';
import * as ToolConstants from '@app/constants/tool-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { RectangleCommand } from '@app/services/tools/rectangle/rectangle-command';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class RectangleService extends Tool {
    cornerCoords: Vec2[];
    isSquare: boolean;
    isShiftDown: boolean;
    lineWidth: number;
    fillMode: ToolConstants.FillMode;
    primaryColor: string;
    secondaryColor: string;
    private mousePosition: Vec2;

    private previewCommand: RectangleCommand;

    constructor(drawingService: DrawingService, undoRedoService: UndoRedoService) {
        super(drawingService, undoRedoService);
        this.cornerCoords = new Array<Vec2>(ShapeConstants.DIMENSION);
        this.isSquare = false;
        this.isShiftDown = false;
        this.lineWidth = ShapeConstants.INITIAL_BORDER_WIDTH;
        this.fillMode = ToolConstants.FillMode.OUTLINE_FILL;
        this.primaryColor = 'red';
        this.secondaryColor = 'grey';
        this.clearCorners();
        this.previewCommand = new RectangleCommand(drawingService.previewCtx, this);
    }

    onMouseDown(event: MouseEvent): void {
        this.inUse = event.button === MouseConstants.MouseButton.Left;
        if (this.inUse) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.cornerCoords[ShapeConstants.START_INDEX] = this.mouseDownCoord;
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.inUse) {
            this.cornerCoords[ShapeConstants.END_INDEX] = this.getPositionFromMouse(event);
            const command: Command = new RectangleCommand(this.drawingService.baseCtx, this);
            this.undoRedoService.executeCommand(command);
        }
        this.inUse = false;
        this.clearCorners();
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    onMouseLeave(event: MouseEvent): void {
        if (this.inUse) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            const exitCoords = this.getPositionFromMouse(event);
            this.cornerCoords[ShapeConstants.END_INDEX] = exitCoords;
            this.previewCommand.setValues(this.drawingService.previewCtx, this);
            this.previewCommand.execute();
        }
    }

    onMouseEnter(event: MouseEvent): void {
        const LEFT_CLICK_BUTTONS = 1;
        if (event.buttons === LEFT_CLICK_BUTTONS && this.inUse) {
            this.inUse = true;
        } else {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.inUse = false;
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.inUse) {
            this.mousePosition = this.getPositionFromMouse(event);
            this.cornerCoords[ShapeConstants.END_INDEX] = this.mousePosition;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.previewCommand.setValues(this.drawingService.previewCtx, this);
            this.previewCommand.execute();
        } else {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        }
    }

    onKeyboardDown(event: KeyboardEvent): void {
        if (this.inUse) {
            if (event.key === 'Shift' && !this.isShiftDown) {
                this.isShiftDown = true;
                this.isSquare = true;
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.previewCommand.setValues(this.drawingService.previewCtx, this);
                this.previewCommand.execute();
            }
        }
    }

    onKeyboardUp(event: KeyboardEvent): void {
        if (this.inUse) {
            if (event.key === 'Shift') {
                this.isShiftDown = false;
                this.isSquare = false;
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.previewCommand.setValues(this.drawingService.previewCtx, this);
                this.previewCommand.execute();
            }
        } else {
            this.isSquare = false;
        }
    }

    setLineWidth(width: number): void {
        if (width < ShapeConstants.MIN_BORDER_WIDTH) {
            this.lineWidth = ShapeConstants.MIN_BORDER_WIDTH;
        } else if (width > ShapeConstants.MAX_BORDER_WIDTH) {
            this.lineWidth = ShapeConstants.MAX_BORDER_WIDTH;
        } else {
            this.lineWidth = width;
        }
    }

    private clearCorners(): void {
        this.cornerCoords.fill({ x: 0, y: 0 });
    }

    onToolChange(): void {
        this.onMouseUp({} as MouseEvent);
    }
}
