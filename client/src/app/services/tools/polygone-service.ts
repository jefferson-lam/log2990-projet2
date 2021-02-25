import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import * as MouseConstants from '@app/constants/mouse-constants';
import * as PolygoneConstants from '@app/constants/polygone-constants';
import * as ToolConstants from '@app/constants/tool-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class PolygoneService extends Tool {
    initNumberSides: number = PolygoneConstants.INIT_NUMBER_SIDES;
    cornerCoords: Vec2[];
    lineWidth: number = PolygoneConstants.INIT_LINE_WIDTH;
    fillMode: ToolConstants.FillMode = ToolConstants.FillMode.OUTLINE;
    primaryColor: string = '#b5cf60';
    secondaryColor: string = '#2F2A36';

    constructor(drawingService: DrawingService) {
        super(drawingService);
        const MAX_PATH_DATA_SIZE = 2;
        this.cornerCoords = new Array<Vec2>(MAX_PATH_DATA_SIZE);
        this.clearCornerCoords();
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseConstants.MouseButton.Left;
        if (this.mouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.cornerCoords[PolygoneConstants.START_INDEX] = this.mouseDownCoord;
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.cornerCoords[PolygoneConstants.END_INDEX] = mousePosition;
            this.drawPolygone(this.drawingService.baseCtx, this.cornerCoords, this.initNumberSides);
        }
        this.mouseDown = false;
        this.clearCornerCoords();
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.cornerCoords[PolygoneConstants.END_INDEX] = mousePosition;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawPolygone(this.drawingService.previewCtx, this.cornerCoords, this.initNumberSides);
            this.drawPredictionCircle(this.drawingService.previewCtx, this.cornerCoords);
        }
    }

    onMouseLeave(event: MouseEvent): void {
        if (this.mouseDown) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            const exitCoords = this.getPositionFromMouse(event);
            this.cornerCoords[PolygoneConstants.END_INDEX] = exitCoords;
            this.drawPolygone(this.drawingService.previewCtx, this.cornerCoords, this.initNumberSides);
            this.drawPredictionCircle(this.drawingService.previewCtx, this.cornerCoords);
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
        const xRadius = Math.abs(path[PolygoneConstants.END_INDEX].x - path[PolygoneConstants.START_INDEX].x) / 2;
        const yRadius = Math.abs(path[PolygoneConstants.END_INDEX].y - path[PolygoneConstants.START_INDEX].y) / 2;
        return [xRadius, yRadius];
    }

    private drawPolygone(ctx: CanvasRenderingContext2D, path: Vec2[], sides: number): void {
        const polygoneCenter = this.getPolygoneCenter(path[PolygoneConstants.START_INDEX], path[PolygoneConstants.END_INDEX]);
        const startX = polygoneCenter.x;
        const startY = polygoneCenter.y;
        const radiiXAndY = this.getRadiiXAndY(path);
        const xRadius = radiiXAndY[PolygoneConstants.X_INDEX];
        const yRadius = radiiXAndY[PolygoneConstants.X_INDEX];
        const borderColor: string = this.fillMode === ToolConstants.FillMode.FILL_ONLY ? this.primaryColor : this.secondaryColor;
        this.drawTypePolygone(ctx, startX, startY, xRadius, yRadius, sides, this.fillMode, this.primaryColor, borderColor, this.lineWidth);
    }

    private getPolygoneCenter(start: Vec2, end: Vec2): Vec2 {
        let displacementX: number;
        let displacementY: number;
        const radiusX = Math.abs(end.x - start.x) / 2;
        const radiusY = Math.abs(end.y - start.y) / 2;

        displacementX = radiusX;
        displacementY = radiusY;

        const xVector = end.x - start.x;
        const yVector = end.y - start.y;
        const centerX = start.x + Math.sign(xVector) * displacementX;
        const centerY = start.y + Math.sign(yVector) * displacementY;
        return { x: centerX, y: centerY };
    }

    private drawTypePolygone(
        ctx: CanvasRenderingContext2D,
        startX: number,
        startY: number,
        xRadius: number,
        yRadius: number,
        sides: number,
        fillMethod: number,
        primaryColor: string,
        secondaryColor: string,
        lineWidth: number,
    ): void {
        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.lineJoin = 'round';
        const ANGLE = PolygoneConstants.END_ANGLE / sides;
        ctx.moveTo(startX + xRadius * Math.cos(0), startY + xRadius * Math.sin(0));
        for (let i = 1; i < sides; i++) {
            ctx.lineTo(startX + xRadius * Math.cos(ANGLE * i), startY + xRadius * Math.sin(ANGLE * i));
        }
        ctx.closePath();
        ctx.strokeStyle = secondaryColor;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
        if (fillMethod !== ToolConstants.FillMode.OUTLINE) {
            ctx.fillStyle = primaryColor;
            ctx.fill();
        }
    }

    private drawPredictionCircle(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        const radiiXAndY = this.getRadiiXAndY(path);
        const xRadius = radiiXAndY[PolygoneConstants.X_INDEX];
        // const yRadius = radiiXAndY[PolygoneConstants.Y_INDEX];
        const polygoneCenter = this.getPolygoneCenter(path[PolygoneConstants.START_INDEX], path[PolygoneConstants.END_INDEX]);

        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = PolygoneConstants.PREDICTION_CIRCLE_WIDTH;
        ctx.setLineDash([PolygoneConstants.LINE_DISTANCE]);
        ctx.arc(polygoneCenter.x, polygoneCenter.y, xRadius + this.lineWidth / 2, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    private clearCornerCoords(): void {
        this.cornerCoords.fill({ x: 0, y: 0 });
    }
}
