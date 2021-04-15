import { Injectable } from '@angular/core';
import { Command } from '@app/classes/command';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import * as MouseConstants from '@app/constants/mouse-constants';
import * as PolygoneConstants from '@app/constants/polygone-constants';
import * as ShapeConstants from '@app/constants/shapes-constants';
import * as ToolConstants from '@app/constants/tool-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PolygoneCommand } from '@app/services/tools/polygone/polygone-command';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class PolygoneService extends Tool {
    numberSides: number;
    cornerCoords: Vec2[];
    lineWidth: number;
    fillMode: ToolConstants.FillMode;
    primaryColor: string;
    secondaryColor: string;

    previewCommand: PolygoneCommand;

    constructor(drawingService: DrawingService, undoRedoService: UndoRedoService) {
        super(drawingService, undoRedoService);
        this.numberSides = PolygoneConstants.INIT_SIDES_COUNT;
        this.lineWidth = ShapeConstants.INITIAL_BORDER_WIDTH;
        this.fillMode = ToolConstants.FillMode.OUTLINE_FILL;
        this.primaryColor = '#b5cf60';
        this.secondaryColor = '#2F2A36';
        this.cornerCoords = new Array<Vec2>(ShapeConstants.MAX_PATH_DATA_SIZE);
        this.clearCornerCoords();
        this.previewCommand = new PolygoneCommand(this.drawingService.previewCtx, this);
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
            const command: Command = new PolygoneCommand(this.drawingService.baseCtx, this);
            this.undoRedoService.executeCommand(command);
        }
        this.inUse = false;
        this.clearCornerCoords();
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    onMouseMove(event: MouseEvent): void {
        if (this.inUse) {
            this.cornerCoords[ShapeConstants.END_INDEX] = this.getPositionFromMouse(event);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.previewCommand.setValues(this.drawingService.previewCtx, this);
            this.previewCommand.execute();
            this.drawPredictionCircle(this.drawingService.previewCtx, this.cornerCoords);
        }
    }

    onMouseLeave(event: MouseEvent): void {
        if (this.inUse) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.cornerCoords[ShapeConstants.END_INDEX] = this.getPositionFromMouse(event);
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

    onKeyboardDown(event: KeyboardEvent): void {
        if (event.key === 'Escape') {
            this.inUse = false;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        }
    }

    setLineWidth(width: number): void {
        this.lineWidth = width;
    }

    setFillMode(newFillMode: ToolConstants.FillMode): void {
        this.fillMode = newFillMode;
    }

    setSidesCount(newSidesCount: number): void {
        this.numberSides = newSidesCount;
    }

    setPrimaryColor(newColor: string): void {
        this.primaryColor = newColor;
    }

    setSecondaryColor(newColor: string): void {
        this.secondaryColor = newColor;
    }

    private getRadiiXAndY(path: Vec2[]): number[] {
        let xRadius = Math.abs(path[ShapeConstants.END_INDEX].x - path[ShapeConstants.START_INDEX].x) / 2;
        let yRadius = Math.abs(path[ShapeConstants.END_INDEX].y - path[ShapeConstants.START_INDEX].y) / 2;

        const shortestSide = Math.min(Math.abs(xRadius), Math.abs(yRadius));
        xRadius = yRadius = shortestSide;

        return [xRadius, yRadius];
    }

    private drawPredictionCircle(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        const polygoneCenterX = this.getPolygoneCenter(path[ShapeConstants.START_INDEX], path[ShapeConstants.END_INDEX]).x;
        const polygoneCenterY = this.getPolygoneCenter(path[ShapeConstants.START_INDEX], path[ShapeConstants.END_INDEX]).y;
        const radiiXAndY = this.getRadiiXAndY(path);
        const radiusWithin = radiiXAndY[ShapeConstants.X_INDEX];

        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = PolygoneConstants.PREDICTION_CIRCLE_WIDTH;
        ctx.setLineDash([ShapeConstants.LINE_DISTANCE]);
        ctx.arc(polygoneCenterX, polygoneCenterY, radiusWithin, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    private getPolygoneCenter(start: Vec2, end: Vec2): Vec2 {
        let displacementX: number;
        let displacementY: number;
        const radiusX = Math.abs(end.x - start.x) / 2;
        const radiusY = Math.abs(end.y - start.y) / 2;

        const shortestSide = Math.min(radiusX, radiusY);
        displacementX = displacementY = shortestSide;

        const xVector = end.x - start.x;
        const yVector = end.y - start.y;
        const centerX = start.x + Math.sign(xVector) * displacementX;
        const centerY = start.y + Math.sign(yVector) * displacementY;
        return { x: centerX, y: centerY };
    }

    private clearCornerCoords(): void {
        this.cornerCoords.fill({ x: 0, y: 0 });
    }

    onToolChange(): void {
        this.onMouseUp({} as MouseEvent);
    }
}
