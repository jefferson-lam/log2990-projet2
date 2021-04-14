import { Injectable } from '@angular/core';
import { Command } from '@app/classes/command';
import { Line2 } from '@app/classes/line2';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/constants/mouse-constants';
import * as SelectionConstants from '@app/constants/selection-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { LassoSelectionCommand } from '@app/services/tools/selection/lasso/lasso-selection-command';
import { ResizerHandlerService } from '@app/services/tools/selection/resizer/resizer-handler.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { LineService } from '../../line/line-service';
import { ToolSelectionService } from '../tool-selection-service';
@Injectable({
    providedIn: 'root',
})
export class LassoSelectionService extends ToolSelectionService {
    isManipulating: boolean;
    isConnected: boolean;
    isValidSegment: boolean;
    linePathData: Vec2[];
    initialPoint: Vec2;
    transformValues: Vec2;
    selectionWidth: number;
    selectionHeight: number;
    topLeft: Vec2;
    isEscapeDown: boolean;

    constructor(
        drawingService: DrawingService,
        undoRedoService: UndoRedoService,
        resizerHandlerService: ResizerHandlerService,
        public lineService: LineService,
    ) {
        super(drawingService, undoRedoService, resizerHandlerService, lineService);
        this.isManipulating = false;
        this.isConnected = false;
        this.isValidSegment = true;
        this.linePathData = new Array<Vec2>();
        this.isEscapeDown = false;
        this.lineService.linePathDataSubject.asObservable().subscribe((point) => {
            this.linePathData.push(point);
        });
    }

    onMouseDown(event: MouseEvent): void {
        if (event.button != MouseButton.Left) {
            return;
        }
        if (this.isManipulating) {
            this.confirmSelection();
            return;
        }
        super.onMouseDown(event);
        if (!this.inUse && !this.isManipulating) {
            this.clearPath();
            this.initialPoint = this.getPositionFromMouse(event);
            this.linePathData[SelectionConstants.START_INDEX] = this.initialPoint;
            this.inUse = true;
        } else if (this.inUse && !this.isManipulating) {
            this.isConnected = this.arePointsEqual(this.linePathData[this.linePathData.length - 1], this.initialPoint);
        }
        if (this.isConnected) {
            this.initializeSelection();
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.inUse) {
            super.onMouseMove(event);
            const mousePosition = this.getPositionFromMouse(event);
            this.isValidSegment = this.isIntersect(mousePosition, this.linePathData);
        }
    }

    onKeyboardDown(event: KeyboardEvent): void {
        super.onKeyboardDown(event);
        if (event.key === 'Escape' && !this.isEscapeDown) {
            this.isEscapeDown = true;
        }
    }

    onKeyboardUp(event: KeyboardEvent): void {
        super.onKeyboardUp(event);
        if (this.inUse) {
            if (event.key === 'Escape' && this.isEscapeDown) {
                this.resetCanvasState(this.drawingService.selectionCanvas);
                this.resetCanvasState(this.drawingService.previewSelectionCanvas);
                this.resetSelectedToolSettings();
                // Erase the rectangle drawn as a preview of selection
                this.clearPath();
                this.inUse = false;
                this.isEscapeDown = false;
            }
        } else if (this.isManipulating) {
            if (event.key === 'Escape' && this.isEscapeDown) {
                const confirmMouseDown = {
                    button: MouseButton.Left,
                } as MouseEvent;
                this.onMouseDown(confirmMouseDown);
                this.clearPath();
                this.lineService.onToolChange();
                this.inUse = false;
                this.isEscapeDown = false;
            }
        }
    }

    undoSelection(): void {
        if (this.isManipulating) {
            this.drawingService.baseCtx.drawImage(
                this.drawingService.selectionCanvas,
                0,
                0,
                this.selectionWidth,
                this.selectionHeight,
                this.topLeft.x,
                this.topLeft.y,
                this.selectionWidth,
                this.selectionHeight,
            );
            this.resetSelectedToolSettings();
            this.resetCanvasState(this.drawingService.selectionCanvas);
            this.resetCanvasState(this.drawingService.previewSelectionCanvas);
            this.resizerHandlerService.resetResizers();
            this.isManipulating = false;
        }
    }

    doLinesIntersect(line1: Line2, line2: Line2) {
        let d =
            Math.abs(line2.end.y - line2.start.y) * Math.abs(line1.end.x - line1.start.x) -
            Math.abs(line2.end.x - line2.start.x) * Math.abs(line1.end.y - line1.start.y);

        let num_a =
            Math.abs(line2.end.x - line2.start.x) * Math.abs(line1.start.y - line2.start.y) -
            Math.abs(line2.end.y - line2.start.y) * Math.abs(line1.start.x - line2.start.x);

        let num_b =
            Math.abs(line1.end.x - line1.start.x) * Math.abs(line1.start.y - line2.start.y) -
            Math.abs(line1.end.y - line1.start.y) * Math.abs(line1.start.x - line2.start.x);

        if (d === 0) {
            return false;
        }

        let ua = num_a / d;
        let ub = num_b / d;

        if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
            return true;
        }
        return false;
    }

    isIntersect(point: Vec2, pathData: Vec2[]): boolean {
        const line = { start: pathData[pathData.length - 1], end: point };
        let curLine;
        for (let i = 0; i < pathData.length - 1; i++) {
            // currentLine = [pathData[i], pathData[i + 1]];
            curLine = { start: pathData[i], end: pathData[i + 1] };
            let isIntersect = this.intersection(line, curLine);
            if (isIntersect) {
                return true;
            }
        }
        return false;
    }

    segmentIntersect(line1: Line2, line2: Line2) {
        let r = this.substractPoints(line1.end, line1.start);
        let s = this.substractPoints(line2.end, line2.start);

        let uNumerator = this.crossProduct(this.substractPoints(line2.start, line1.start), r);
        let denominator = this.crossProduct(r, s);

        if (uNumerator === 0 && denominator === 0) {
            if (
                this.arePointsEqual(line1.start, line2.start) ||
                this.arePointsEqual(line1.start, line2.end) ||
                this.arePointsEqual(line1.end, line2.start) ||
                this.arePointsEqual(line1.end, line2.end)
            ) {
                return true;
            }
        }

        if (denominator === 0) {
            return false;
        }

        const u = uNumerator / denominator;
        const t = this.crossProduct(this.substractPoints(line2.start, line1.start), s) / denominator;

        return t >= 0 && t <= 1 && u >= 0 && u <= 1;
    }

    crossProduct(point1: Vec2, point2: Vec2): number {
        return point1.x * point2.y - point1.y * point2.x;
    }

    substractPoints(point1: Vec2, point2: Vec2): Vec2 {
        return {
            x: point1.x - point2.x,
            y: point1.y - point2.y,
        };
    }

    arePointsEqual(point1: Vec2, point2: Vec2): boolean {
        return point1.x === point2.x && point1.y === point2.y;
    }

    intersection(line1: Line2, line2: Line2): boolean {
        let s1 = this.substractPoints(line1.end, line1.start);
        let s2 = this.substractPoints(line2.end, line2.start);

        let s;
        let t;

        s = (-s1.y * (line1.start.x - line2.start.x) + s1.x * (line1.start.y - line2.start.y)) / (-s2.x * s1.y + s1.x * s2.y);
        t = (s2.x * (line1.start.y - line2.start.y) - s2.y * (line1.start.x - line2.start.x)) / (-s2.x * s1.y + s1.x * s2.y);

        return s >= 0 && s <= 1 && t >= 0 && t <= 1;
    }

    computeSelectionSize(pathData: Vec2[]): number[] {
        let minHeight = Number.MAX_VALUE;
        let maxHeight = Number.MIN_VALUE;
        let minWidth = Number.MAX_VALUE;
        let maxWidth = Number.MIN_VALUE;

        pathData.forEach((vec) => {
            minWidth = vec.x < minWidth ? vec.x : minWidth;
            maxWidth = vec.x > maxWidth ? vec.x : maxWidth;
            minHeight = vec.y < minHeight ? vec.y : minHeight;
            maxHeight = vec.y > maxHeight ? vec.y : maxHeight;
        });

        this.topLeft = {
            x: minWidth,
            y: minHeight,
        };

        this.selectionHeight = maxHeight - minHeight;
        this.selectionWidth = maxWidth - minWidth;

        return [maxWidth - minWidth, maxHeight - minHeight];
    }

    onToolChange(): void {
        super.onToolChange();
        if (this.isManipulating) {
            this.onMouseDown({} as MouseEvent);
        } else if (this.inUse) {
            const resetKeyboardEvent: KeyboardEvent = {
                key: 'Escape',
            } as KeyboardEvent;
            this.isEscapeDown = true;
            this.onKeyboardUp(resetKeyboardEvent);
        }
    }

    clipLassoSelection(targetCtx: CanvasRenderingContext2D, baseCtx: CanvasRenderingContext2D, pathData: Vec2[]): void {
        targetCtx.save();
        targetCtx.beginPath();
        targetCtx.moveTo(pathData[0].x - this.topLeft.x, pathData[0].y - this.topLeft.y);
        for (const point of pathData) {
            targetCtx.lineTo(point.x - this.topLeft.x, point.y - this.topLeft.y);
        }
        targetCtx.clip();
        targetCtx.drawImage(
            baseCtx.canvas,
            this.topLeft.x,
            this.topLeft.y,
            this.selectionWidth,
            this.selectionHeight,
            0,
            0,
            this.selectionWidth,
            this.selectionHeight,
        );
        targetCtx.restore();
        this.drawLassoOutline(this.drawingService.previewSelectionCtx, pathData);
        // this.drawLassoOutline(targetCtx, pathData);
    }

    private confirmSelection(): void {
        this.transformValues = {
            x: parseInt(this.drawingService.selectionCanvas.style.left, 10),
            y: parseInt(this.drawingService.selectionCanvas.style.top, 10),
        };
        const command: Command = new LassoSelectionCommand(this.drawingService.baseCtx, this.drawingService.selectionCanvas, this);
        this.undoRedoService.executeCommand(command);
        this.isManipulating = false;
        this.resetCanvasState(this.drawingService.selectionCanvas);
        this.resetCanvasState(this.drawingService.previewSelectionCanvas);
        this.resetSelectedToolSettings();
        this.resizerHandlerService.resetResizers();
    }

    private initializeSelection(): void {
        this.inUse = false;
        this.lineService.onToolChange();
        this.isConnected = false;
        // Get selectionWidth and Height
        const selectionSize = this.computeSelectionSize(this.linePathData);
        this.drawingService.selectionCanvas.width = this.drawingService.previewSelectionCanvas.width = selectionSize[0];
        this.drawingService.selectionCanvas.height = this.drawingService.previewSelectionCanvas.height = selectionSize[1];
        this.selectLasso(this.drawingService.selectionCtx, this.drawingService.baseCtx, this.linePathData);
        this.setSelectionCanvasPosition(this.topLeft);
        this.inUse = false;
        this.isManipulating = true;
    }

    private selectLasso(targetCtx: CanvasRenderingContext2D, baseCtx: CanvasRenderingContext2D, pathData: Vec2[]): void {
        this.clipLassoSelection(targetCtx, baseCtx, pathData);
        this.fillLasso(baseCtx, pathData, 'white');
    }

    private fillLasso(ctx: CanvasRenderingContext2D, pathData: Vec2[], color: string): void {
        ctx.beginPath();
        ctx.moveTo(pathData[0].x, pathData[0].y);
        for (const point of pathData) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.save();
        ctx.clip();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.restore();
    }

    private drawLassoOutline(ctx: CanvasRenderingContext2D, pathData: Vec2[]): void {
        ctx.beginPath();
        ctx.setLineDash([SelectionConstants.DEFAULT_LINE_DASH, SelectionConstants.DEFAULT_LINE_DASH]);
        ctx.moveTo(pathData[0].x - this.topLeft.x, pathData[0].y - this.topLeft.y);
        for (const point of pathData) {
            ctx.lineTo(point.x - this.topLeft.x, point.y - this.topLeft.y);
        }
        ctx.stroke();
    }

    private setSelectionCanvasPosition(topLeft: Vec2): void {
        this.drawingService.selectionCanvas.style.left = topLeft.x + 'px';
        this.drawingService.selectionCanvas.style.top = topLeft.y + 'px';
        this.drawingService.previewSelectionCanvas.style.left = topLeft.x + 'px';
        this.drawingService.previewSelectionCanvas.style.top = topLeft.y + 'px';
        this.resizerHandlerService.setResizerPositions(this.drawingService.selectionCanvas);
    }

    private clearPath(): void {
        this.linePathData = [];
    }
}
