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
    cornerCoords: Vec2[];
    isCircle: boolean = false;
    lineWidth: number = 20;
    fillMode: ToolConstants.FillMode = ToolConstants.FillMode.OUTLINE;
    primaryColor: string = '#B5CF60';
    secondaryColor: string = '#2F2A36';

    constructor(drawingService: DrawingService, undoRedoService: UndoRedoService) {
        super(drawingService, undoRedoService);
        const MAX_PATH_DATA_SIZE = 2;
        this.cornerCoords = new Array<Vec2>(MAX_PATH_DATA_SIZE);
        this.clearCornerCoords();
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseConstants.MouseButton.Left;
        if (this.mouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.cornerCoords[EllipseConstants.START_INDEX] = this.mouseDownCoord;
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.cornerCoords[EllipseConstants.END_INDEX] = mousePosition;
            const command: Command = new EllipseCommand(this.drawingService.baseCtx, this);
            this.undoRedoService.executeCommand(command);
            // this.drawEllipse(this.drawingService.baseCtx, this.cornerCoords);
        }
        this.mouseDown = false;
        this.clearCornerCoords();
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.cornerCoords[EllipseConstants.END_INDEX] = mousePosition;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawEllipse(this.drawingService.previewCtx, this.cornerCoords);
            this.drawPredictionRectangle(this.drawingService.previewCtx, this.cornerCoords);
        }
    }

    onMouseLeave(event: MouseEvent): void {
        if (this.mouseDown) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            const exitCoords = this.getPositionFromMouse(event);
            this.cornerCoords[EllipseConstants.END_INDEX] = exitCoords;
            this.drawEllipse(this.drawingService.previewCtx, this.cornerCoords);
            this.drawPredictionRectangle(this.drawingService.previewCtx, this.cornerCoords);
        }
    }

    onMouseEnter(event: MouseEvent): void {
        const LEFT_CLICK_BUTTONS = 1;
        if (event.buttons === LEFT_CLICK_BUTTONS && this.mouseDown) {
            this.mouseDown = true;
        } else {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.mouseDown = false;
        }
    }

    onKeyboardDown(event: KeyboardEvent): void {
        if (this.mouseDown) {
            if (event.key === 'Shift') {
                this.isCircle = true;
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawEllipse(this.drawingService.previewCtx, this.cornerCoords);
                this.drawPredictionRectangle(this.drawingService.previewCtx, this.cornerCoords);
            }
        }
    }

    onKeyboardUp(event: KeyboardEvent): void {
        if (this.mouseDown) {
            if (event.key === 'Shift') {
                this.isCircle = false;
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawEllipse(this.drawingService.previewCtx, this.cornerCoords);
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
        // TODO: add color check
        this.primaryColor = newColor;
    }

    setSecondaryColor(newColor: string): void {
        // TODO: add color check
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

    drawEllipse(
        ctx: CanvasRenderingContext2D,
        path: Vec2[],
        isCircle?: boolean,
        fillMode?: ToolConstants.FillMode,
        lineWidth?: number,
        primaryColor?: string,
        secondaryColor?: string,
    ): void {
        if (!isCircle) isCircle = this.isCircle;
        if (!fillMode) fillMode = this.fillMode;
        if (!lineWidth) lineWidth = this.lineWidth;
        if (!primaryColor) primaryColor = this.primaryColor;
        if (!secondaryColor) secondaryColor = this.secondaryColor;

        const ellipseCenter = this.getEllipseCenter(path[EllipseConstants.START_INDEX], path[EllipseConstants.END_INDEX], isCircle);
        const startX = ellipseCenter.x;
        const startY = ellipseCenter.y;

        const radiiXAndY = this.getRadiiXAndY(path);
        let xRadius = radiiXAndY[EllipseConstants.X_INDEX];
        let yRadius = radiiXAndY[EllipseConstants.Y_INDEX];
        const borderColor: string = fillMode === ToolConstants.FillMode.FILL_ONLY ? primaryColor : secondaryColor;
        if (xRadius > lineWidth / 2 && yRadius > lineWidth / 2) {
            xRadius -= lineWidth / 2;
            yRadius -= lineWidth / 2;
            this.drawTypeEllipse(ctx, startX, startY, xRadius, yRadius, fillMode, primaryColor, borderColor, lineWidth);
        } else {
            this.drawTypeEllipse(
                ctx,
                startX,
                startY,
                xRadius,
                yRadius,
                ToolConstants.FillMode.OUTLINE_FILL,
                borderColor,
                borderColor,
                EllipseConstants.HIDDEN_BORDER_WIDTH,
            );
        }
    }

    private getEllipseCenter(start: Vec2, end: Vec2, isCircle: boolean): Vec2 {
        let displacementX: number;
        let displacementY: number;
        const radiusX = Math.abs(end.x - start.x) / 2;
        const radiusY = Math.abs(end.y - start.y) / 2;
        if (isCircle) {
            const shortestSide = Math.min(radiusX, radiusY);
            displacementX = displacementY = shortestSide;
        } else {
            displacementX = radiusX;
            displacementY = radiusY;
        }
        const xVector = end.x - start.x;
        const yVector = end.y - start.y;
        const centerX = start.x + Math.sign(xVector) * displacementX;
        const centerY = start.y + Math.sign(yVector) * displacementY;
        return { x: centerX, y: centerY };
    }

    private drawTypeEllipse(
        ctx: CanvasRenderingContext2D,
        startX: number,
        startY: number,
        xRadius: number,
        yRadius: number,
        fillMethod: number,
        primaryColor: string,
        secondaryColor: string,
        lineWidth: number,
    ): void {
        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.lineJoin = 'round';
        ctx.ellipse(startX, startY, xRadius, yRadius, EllipseConstants.ROTATION, EllipseConstants.START_ANGLE, EllipseConstants.END_ANGLE);

        ctx.strokeStyle = secondaryColor;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
        if (fillMethod !== ToolConstants.FillMode.OUTLINE) {
            ctx.fillStyle = primaryColor;
            ctx.fill();
        }
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
}
