import { Injectable } from '@angular/core';
import { Command } from '@app/classes/command';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import * as EllipseConstants from '@app/constants/ellipse-constants';
import * as MouseConstants from '@app/constants/mouse-constants';
import * as ToolConstants from '@app/constants/tool-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EllipseCommand } from '@app/services/tools/ellipse/ellipse-command';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class EllipseService extends Tool {
    cornerCoords: Vec2[] = [];
    isCircle: boolean = false;
    lineWidth: number = 20;
    fillMode: ToolConstants.FillMode = ToolConstants.FillMode.OUTLINE_FILL;
    primaryColor: string = '#B5CF60';
    secondaryColor: string = '#2F2A36';
    mousePosition: Vec2;

    previewCommand: EllipseCommand;

    constructor(drawingService: DrawingService, undoRedoService: UndoRedoService) {
        super(drawingService, undoRedoService);
        const MAX_PATH_DATA_SIZE = 2;
        this.cornerCoords = new Array<Vec2>(MAX_PATH_DATA_SIZE);
        this.clearCornerCoords();
        this.previewCommand = new EllipseCommand(this.drawingService.previewCtx, this);
    }

    onMouseDown(event: MouseEvent): void {
        this.inUse = event.button === MouseConstants.MouseButton.Left;
        if (this.inUse) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.cornerCoords[EllipseConstants.START_INDEX] = this.mouseDownCoord;
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.inUse) {
            this.cornerCoords[EllipseConstants.END_INDEX] = this.mousePosition;
            const command: Command = new EllipseCommand(this.drawingService.baseCtx, this);
            this.undoRedoService.executeCommand(command);
        }
        this.inUse = false;
        this.clearCornerCoords();
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    onMouseMove(event: MouseEvent): void {
        if (this.inUse) {
            this.mousePosition = this.getPositionFromMouse(event);
            this.cornerCoords[EllipseConstants.END_INDEX] = this.mousePosition;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);

            this.previewCommand.setValues(this.drawingService.previewCtx, this);
            this.previewCommand.execute();

            this.drawPredictionRectangle(this.drawingService.previewCtx, this.cornerCoords);
        }
    }

    onMouseLeave(event: MouseEvent): void {
        if (this.inUse) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            const exitCoords = this.getPositionFromMouse(event);
            this.cornerCoords[EllipseConstants.END_INDEX] = exitCoords;

            this.previewCommand.setValues(this.drawingService.previewCtx, this);
            this.previewCommand.execute();

            this.drawPredictionRectangle(this.drawingService.previewCtx, this.cornerCoords);
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

    onKeyboardDown(event: KeyboardEvent): void {
        if (this.inUse) {
            if (event.key === 'Shift') {
                this.isCircle = true;
                this.drawingService.clearCanvas(this.drawingService.previewCtx);

                this.previewCommand.setValues(this.drawingService.previewCtx, this);
                this.previewCommand.execute();
                this.drawPredictionRectangle(this.drawingService.previewCtx, this.cornerCoords);
            }
        }
    }

    onKeyboardUp(event: KeyboardEvent): void {
        if (this.inUse) {
            if (event.key === 'Shift') {
                this.isCircle = false;
                this.drawingService.clearCanvas(this.drawingService.previewCtx);

                this.previewCommand.setValues(this.drawingService.previewCtx, this);
                this.previewCommand.execute();

                this.drawPredictionRectangle(this.drawingService.previewCtx, this.cornerCoords);
            }
        } else {
            this.isCircle = false;
        }
    }

    setLineWidth(width: number): void {
        if (width < EllipseConstants.MIN_BORDER_WIDTH) {
            this.lineWidth = EllipseConstants.MIN_BORDER_WIDTH;
        } else if (width > EllipseConstants.MAX_BORDER_WIDTH) {
            this.lineWidth = EllipseConstants.MAX_BORDER_WIDTH;
        } else {
            this.lineWidth = width;
        }
    }

    setFillMode(newFillMode: ToolConstants.FillMode): void {
        this.fillMode = newFillMode;
    }

    setPrimaryColor(newColor: string): void {
        this.primaryColor = newColor;
    }

    setSecondaryColor(newColor: string): void {
        this.secondaryColor = newColor;
    }

    private getRadiiXAndY(path: Vec2[]): number[] {
        let xRadius = Math.abs(path[EllipseConstants.END_INDEX].x - path[EllipseConstants.START_INDEX].x) / 2;
        let yRadius = Math.abs(path[EllipseConstants.END_INDEX].y - path[EllipseConstants.START_INDEX].y) / 2;

        if (this.isCircle) {
            const shortestSide = Math.min(Math.abs(xRadius), Math.abs(yRadius));
            xRadius = yRadius = shortestSide;
        }
        return [xRadius, yRadius];
    }

    private drawPredictionRectangle(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        const start = path[EllipseConstants.START_INDEX];
        const xDifference = path[EllipseConstants.END_INDEX].x - path[EllipseConstants.START_INDEX].x;
        const xFactor = Math.sign(xDifference);
        const yDifference = path[EllipseConstants.END_INDEX].y - path[EllipseConstants.START_INDEX].y;
        const yFactor = Math.sign(yDifference);

        const radiiXAndY = this.getRadiiXAndY(path);
        const xRadius = radiiXAndY[EllipseConstants.X_INDEX];
        const yRadius = radiiXAndY[EllipseConstants.Y_INDEX];
        const width = xRadius * 2 * xFactor;
        const height = yRadius * 2 * yFactor;

        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = EllipseConstants.PREDICTION_RECTANGLE_WIDTH;
        ctx.setLineDash([EllipseConstants.LINE_DISTANCE]);
        ctx.rect(start.x, start.y, width, height);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    private clearCornerCoords(): void {
        this.cornerCoords.fill({ x: 0, y: 0 });
    }

    onToolChange(): void {
        this.onMouseUp({} as MouseEvent);
    }
}
