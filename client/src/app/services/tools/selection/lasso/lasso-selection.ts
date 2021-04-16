import { Injectable } from '@angular/core';
import { Command } from '@app/classes/command';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/constants/mouse-constants';
import * as SelectionConstants from '@app/constants/selection-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SegmentIntersectionService } from '@app/services/helper/segment-intersection.service';
import { LineService } from '@app/services/tools/line/line-service';
import { LassoSelectionCommand } from '@app/services/tools/selection/lasso/lasso-selection-command';
import { ResizerHandlerService } from '@app/services/tools/selection/resizer/resizer-handler.service';
import { ToolSelectionService } from '@app/services/tools/selection/tool-selection-service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
@Injectable({
    providedIn: 'root',
})
export class LassoSelectionService extends ToolSelectionService {
    isManipulating: boolean;
    isConnected: boolean;
    isInvalidSegment: boolean;
    linePathData: Vec2[];
    initialPoint: Vec2;
    transformValues: Vec2;
    selectionWidth: number;
    selectionHeight: number;
    numSides: number;
    topLeft: Vec2;
    isEscapeDown: boolean;
    isFromClipboard: boolean;

    constructor(
        drawingService: DrawingService,
        undoRedoService: UndoRedoService,
        resizerHandlerService: ResizerHandlerService,
        public segmentIntersectionService: SegmentIntersectionService,
        public lineService: LineService,
    ) {
        super(drawingService, undoRedoService, resizerHandlerService, lineService);
        this.isManipulating = false;
        this.isConnected = false;
        this.isInvalidSegment = false;
        this.linePathData = new Array<Vec2>();
        this.isEscapeDown = false;
        this.isFromClipboard = false;
        this.numSides = 0;
        this.lineService.addPointSubject.asObservable().subscribe((point) => {
            this.linePathData.push(point);
        });
        this.lineService.currentPointSubject.asObservable().subscribe((point) => {
            this.linePathData[this.linePathData.length - 1] = point;
        });
        this.lineService.removePointSubject.asObservable().subscribe((removedPoint) => {
            if (removedPoint) {
                this.linePathData.pop();
            }
        });
    }

    onMouseDown(event: MouseEvent): void {
        if (event.button !== MouseButton.Left) return;
        if (this.isInvalidSegment) return;
        if (this.isManipulating) {
            this.confirmSelection();
            return;
        }
        super.onMouseDown(event);
        if (!this.inUse) {
            this.clearPath();
            this.initialPoint = this.getPositionFromMouse(event);
            this.linePathData[SelectionConstants.START_INDEX] = this.initialPoint;
            this.linePathData.push(this.initialPoint);
            this.inUse = true;
        } else if (this.inUse) {
            this.numSides++;
            this.isConnected = this.arePointsEqual(this.linePathData[this.linePathData.length - 1], this.initialPoint);
        }
        if (this.isConnected) {
            this.initializeSelection();
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (!this.inUse) return;
        super.onMouseMove(event);
        this.isInvalidSegment = this.validateSegment(this.linePathData[this.linePathData.length - 1], this.linePathData);
        if (this.isInvalidSegment) {
            this.drawingService.previewCtx.canvas.style.cursor = 'no-drop';
        } else {
            this.drawingService.previewCtx.canvas.style.cursor = 'crosshair';
        }
    }

    validateSegment(point: Vec2, pathData: Vec2[]): boolean {
        return (
            this.isIntersect(point, pathData) ||
            (this.arePointsEqual(point, this.initialPoint) && this.numSides < SelectionConstants.MINIMUM_LINE_LASSO)
        );
    }

    onKeyboardDown(event: KeyboardEvent): void {
        super.onKeyboardDown(event);
        if (this.isEscapeDown) return;
        switch (event.key) {
            case 'Escape':
                this.isEscapeDown = true;
                break;
        }
    }

    onKeyboardUp(event: KeyboardEvent): void {
        super.onKeyboardUp(event);
        if (this.inUse) {
            switch (event.key) {
                case 'Escape':
                    this.resetSelection();
                    this.isEscapeDown = false;
                    break;
            }
        } else if (this.isManipulating) {
            switch (event.key) {
                case 'Escape':
                    this.confirmSelection();
                    this.clearPath();
                    this.lineService.onToolChange();
                    this.isEscapeDown = false;
                    break;
            }
        }
    }

    undoSelection(): void {
        if (!this.isManipulating) return;
        this.drawImageToCtx(this.drawingService.baseCtx, this.drawingService.selectionCanvas);
        this.resetSelectedToolSettings();
        this.resetCanvasState(this.drawingService.selectionCanvas);
        this.resetCanvasState(this.drawingService.previewSelectionCanvas);
        this.resetCanvasState(this.drawingService.borderCanvas);
        this.resizerHandlerService.resetResizers();
        this.isManipulating = false;
        this.isEscapeDown = false;
        this.isConnected = false;
    }

    resetSelection(): void {
        this.resetCanvasState(this.drawingService.selectionCanvas);
        this.resetCanvasState(this.drawingService.previewSelectionCanvas);
        this.resetCanvasState(this.drawingService.borderCanvas);
        this.resetSelectedToolSettings();
        // Erase the rectangle drawn as a preview of selection
        this.clearPath();
        this.drawingService.previewCtx.canvas.style.cursor = 'crosshair';
        this.numSides = 0;
        this.isInvalidSegment = false;
        this.inUse = false;
    }

    isIntersect(point: Vec2, pathData: Vec2[]): boolean {
        const newLine = { start: pathData[pathData.length - 2], end: point };
        let pathLine;
        let numIntersections = 0;
        for (let i = 0; i < pathData.length - 2; i++) {
            pathLine = { start: pathData[i], end: pathData[i + 1] };
            const isIntersect = this.segmentIntersectionService.intersects(newLine, pathLine);
            if (isIntersect) {
                ++numIntersections;
            }
        }
        if (numIntersections === 0) {
            return false;
        }
        if (numIntersections === 1 && this.arePointsEqual(point, this.initialPoint)) {
            return false;
        } else {
            return true;
        }
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

        return [maxWidth - minWidth, maxHeight - minHeight];
    }

    onToolChange(): void {
        super.onToolChange();
        if (this.isManipulating) {
            this.confirmSelection();
        } else if (this.inUse) {
            this.resetSelection();
            this.lineService.onToolChange();
        }
    }

    confirmSelection(): void {
        this.transformValues = {
            x: parseInt(this.drawingService.selectionCanvas.style.left, 10),
            y: parseInt(this.drawingService.selectionCanvas.style.top, 10),
        };
        const command: Command = new LassoSelectionCommand(this.drawingService.baseCtx, this.drawingService.selectionCanvas, this);
        this.undoRedoService.executeCommand(command);
        this.resetSelection();
        this.resizerHandlerService.resetResizers();
        this.isManipulating = false;
    }

    initializeSelection(): void {
        this.lineService.onToolChange();
        const selectionSize = this.computeSelectionSize(this.linePathData);
        this.selectionWidth = selectionSize[0];
        this.selectionHeight = selectionSize[1];
        this.drawingService.selectionCanvas.width = this.drawingService.previewSelectionCanvas.width = this.drawingService.borderCanvas.width = this.selectionWidth;
        this.drawingService.selectionCanvas.height = this.drawingService.previewSelectionCanvas.height = this.drawingService.borderCanvas.height = this.selectionHeight;
        this.selectLasso(this.drawingService.selectionCtx, this.drawingService.baseCtx, this.linePathData);
        this.setSelectionCanvasPosition(this.topLeft);
        this.isConnected = false;
        this.inUse = false;
        this.numSides = 0;
        this.isManipulating = true;
    }

    private selectLasso(targetCtx: CanvasRenderingContext2D, baseCtx: CanvasRenderingContext2D, pathData: Vec2[]): void {
        this.clipLassoSelection(targetCtx, baseCtx, pathData);
        this.fillLasso(baseCtx, pathData, 'white');
    }

    private clipLassoSelection(targetCtx: CanvasRenderingContext2D, baseCtx: CanvasRenderingContext2D, pathData: Vec2[]): void {
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
        this.drawLassoOutline(this.drawingService.borderCtx, pathData);
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

    private drawImageToCtx(targetCtx: CanvasRenderingContext2D, sourceCanvas: HTMLCanvasElement): void {
        if (this.isFromClipboard) return;
        targetCtx.drawImage(
            sourceCanvas,
            0,
            0,
            this.selectionWidth,
            this.selectionHeight,
            this.topLeft.x,
            this.topLeft.y,
            this.selectionWidth,
            this.selectionHeight,
        );
    }

    private setSelectionCanvasPosition(topLeft: Vec2): void {
        this.drawingService.selectionCanvas.style.left = topLeft.x + 'px';
        this.drawingService.selectionCanvas.style.top = topLeft.y + 'px';
        this.drawingService.previewSelectionCanvas.style.left = topLeft.x + 'px';
        this.drawingService.previewSelectionCanvas.style.top = topLeft.y + 'px';
        this.drawingService.borderCanvas.style.left = topLeft.x + 'px';
        this.drawingService.borderCanvas.style.top = topLeft.y + 'px';
        this.resizerHandlerService.setResizerPositions(this.drawingService.selectionCanvas);
    }

    private clearPath(): void {
        this.linePathData = [];
    }

    private arePointsEqual(point1: Vec2, point2: Vec2): boolean {
        return point1.x === point2.x && point1.y === point2.y;
    }
}
