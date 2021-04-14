import { Injectable } from '@angular/core';
import { Command } from '@app/classes/command';
import { Line2 } from '@app/classes/line2';
import { Vec2 } from '@app/classes/vec2';
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
        if (this.isManipulating) {
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
            return;
        }
        // const pos = this.getPositionFromMouse(event);
        // console.log(this.isIntersect(pos, this.linePathData));
        super.onMouseDown(event);
        if (!this.inUse && !this.isManipulating) {
            this.clearPath();
            this.initialPoint = this.getPositionFromMouse(event);
            this.linePathData[SelectionConstants.START_INDEX] = this.initialPoint;
            this.inUse = true;
        } else if (this.inUse && !this.isManipulating) {
            if (
                this.linePathData[this.linePathData.length - 1].x === this.initialPoint.x &&
                this.linePathData[this.linePathData.length - 1].y === this.initialPoint.y
            ) {
                this.isConnected = true;
            }
        }

        if (this.isConnected) {
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
    }

    onMouseMove(event: MouseEvent): void {
        if (this.inUse) {
            super.onMouseMove(event);
            const mousePosition = this.getPositionFromMouse(event);
            this.isValidSegment = this.isIntersect(mousePosition, this.linePathData);
            console.log(this.isValidSegment);
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
                this.onMouseDown({} as MouseEvent);
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

    isIntersect(point: Vec2, pathData: Vec2[]): boolean {
        const line = { start: pathData[pathData.length - 1], end: point };
        let curLine;
        for (let i = 0; i < pathData.length - 1; i++) {
            // currentLine = [pathData[i], pathData[i + 1]];
            curLine = { start: pathData[i], end: pathData[i + 1] };
            const isIntersect = this.intersects(line, curLine);
            if (isIntersect) {
                return true;
            }
        }
        return false;
    }

    // https://stackoverflow.com/questions/9043805/test-if-two-lines-intersect-javascript-function
    private intersects(line1: Line2, line2: Line2): boolean {
        let det;
        let gamma;
        let lambda;
        det = (line1.end.x - line1.start.x) * (line2.end.y - line2.start.y) - (line2.end.x - line2.start.x) * (line1.end.y - line1.start.y);
        if (det === 0) {
            return false;
        }
        if (this.isColinear(line1, line2)) {
            return true;
        }
        lambda =
            ((line2.end.y - line2.start.y) * (line2.end.x - line1.start.x) + (line2.start.x - line2.end.x) * (line2.end.y - line1.start.y)) / det;
        gamma = ((line1.start.y - line1.end.y) * (line2.end.x - line1.start.x) + (line1.end.x - line1.start.x) * (line2.end.y - line1.start.y)) / det;
        return 0 < lambda && lambda < 1 && 0 < gamma && gamma < 1;
    }

    private isColinear(line1: Line2, line2: Line2): boolean {
        const line3: Line2 = { start: line1.start, end: line2.start };
        const slopeLine1 = this.calculateSlopeLine(line1);
        const slopeLine3 = this.calculateSlopeLine(line3);
        return slopeLine1 === slopeLine3 && this.doLinesShareRange(line1, line2);
    }

    private doLinesShareRange(line1: Line2, line2: Line2): boolean {
        return (
            this.doesDomainIntersect(line1.start.x, line1.end.x, line2.start.x, line2.end.x) &&
            this.doesDomainIntersect(line1.start.y, line1.end.y, line2.start.y, line2.end.y)
        );
    }

    private doesDomainIntersect(line1Start: number, line1End: number, line2Start: number, line2End: number): boolean {
        const minXLine1 = Math.min(line1Start, line1End);
        const maxXLine1 = Math.max(line1Start, line1End);
        const minXLine2 = Math.min(line2Start, line2End);
        const maxXLine2 = Math.max(line2Start, line2End);
        return !(maxXLine2 < minXLine1 || maxXLine1 < minXLine2);
    }

    private calculateSlopeLine(line: Line2): number {
        const TOLERANCE = 5;
        const ROUNDING_FACTOR = 10;
        return Math.abs(line.end.x - line.start.x) < TOLERANCE
            ? Number.POSITIVE_INFINITY
            : Math.round((Math.abs(line.end.y - line.start.y) / Math.abs(line.end.x - line.start.x)) * ROUNDING_FACTOR) / ROUNDING_FACTOR;
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
