import { Injectable } from '@angular/core';
import { Command } from '@app/classes/command';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import * as MouseConstants from '@app/constants/mouse-constants';
import * as PolygoneConstants from '@app/constants/polygone-constants';
import * as ToolConstants from '@app/constants/tool-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PolygoneCommand } from '@app/services/tools/polygone/polygone-command';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class PolygoneService extends Tool {
    initNumberSides: number = PolygoneConstants.INIT_SIDES_COUNT;
    cornerCoords: Vec2[];
    lineWidth: number = PolygoneConstants.INIT_LINE_WIDTH;
    fillMode: ToolConstants.FillMode = ToolConstants.FillMode.OUTLINE_FILL;
    primaryColor: string = '#b5cf60';
    secondaryColor: string = '#2F2A36';

    previewCommand: PolygoneCommand;

    constructor(drawingService: DrawingService, undoRedoService: UndoRedoService) {
        super(drawingService, undoRedoService);
        const MAX_PATH_DATA_SIZE = 2;
        this.cornerCoords = new Array<Vec2>(MAX_PATH_DATA_SIZE);
        this.clearCornerCoords();
        this.previewCommand = new PolygoneCommand(this.drawingService.previewCtx, this);
    }

    onMouseDown(event: MouseEvent): void {
        this.inUse = event.button === MouseConstants.MouseButton.Left;
        if (this.inUse) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.cornerCoords[PolygoneConstants.START_INDEX] = this.mouseDownCoord;
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.inUse) {
            this.cornerCoords[PolygoneConstants.END_INDEX].x = this.getPositionFromMouse(event).x - this.lineWidth / 2;
            this.cornerCoords[PolygoneConstants.END_INDEX].y = this.getPositionFromMouse(event).y - this.lineWidth / 2;
            const command: Command = new PolygoneCommand(this.drawingService.baseCtx, this);
            this.undoRedoService.executeCommand(command);
        }
        this.inUse = false;
        this.clearCornerCoords();
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    onMouseMove(event: MouseEvent): void {
        if (this.inUse) {
            this.cornerCoords[PolygoneConstants.END_INDEX].x = this.getPositionFromMouse(event).x - this.lineWidth / 2;
            this.cornerCoords[PolygoneConstants.END_INDEX].y = this.getPositionFromMouse(event).y - this.lineWidth / 2;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.previewCommand.setValues(this.drawingService.previewCtx, this);
            this.previewCommand.execute();
            this.drawPredictionCircle(this.drawingService.previewCtx, this.cornerCoords);
        }
    }

    onMouseLeave(event: MouseEvent): void {
        if (this.inUse) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.cornerCoords[PolygoneConstants.END_INDEX] = this.getPositionFromMouse(event);
            this.previewCommand.setValues(this.drawingService.previewCtx, this);
            this.previewCommand.execute();
            this.drawPredictionCircle(this.drawingService.previewCtx, this.cornerCoords);
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

    setLineWidth(width: number): void {
        this.lineWidth = width;
    }

    setFillMode(newFillMode: ToolConstants.FillMode): void {
        this.fillMode = newFillMode;
    }

    setSidesCount(newSidesCount: number): void {
        this.initNumberSides = newSidesCount;
    }

    setPrimaryColor(newColor: string): void {
        this.primaryColor = newColor;
    }

    setSecondaryColor(newColor: string): void {
        this.secondaryColor = newColor;
    }

    private getRadiiXAndY(path: Vec2[]): number[] {
        const xRadius = Math.abs(path[PolygoneConstants.END_INDEX].x - path[PolygoneConstants.START_INDEX].x);
        const yRadius = Math.abs(path[PolygoneConstants.END_INDEX].y - path[PolygoneConstants.START_INDEX].y);
        return [xRadius, yRadius];
    }

    private drawPredictionCircle(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        const radiiXAndY = this.getRadiiXAndY(path);
        const xRadius = radiiXAndY[PolygoneConstants.X_INDEX];
        const yRadius = radiiXAndY[PolygoneConstants.Y_INDEX];
        const polygoneCenter = path[PolygoneConstants.START_INDEX];

        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = PolygoneConstants.PREDICTION_CIRCLE_WIDTH;
        ctx.setLineDash([PolygoneConstants.LINE_DISTANCE]);
        ctx.arc(polygoneCenter.x, polygoneCenter.y, this.getPredictionCircleRadius(xRadius, yRadius) + this.lineWidth / 2, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    private getPredictionCircleRadius(xRadius: number, yRadius: number): number {
        return Math.sqrt(xRadius ** 2 + yRadius ** 2);
    }

    private clearCornerCoords(): void {
        this.cornerCoords.fill({ x: 0, y: 0 });
    }
}
