import { Injectable } from '@angular/core';
import { Command } from '@app/classes/command';
import { Vec2 } from '@app/classes/vec2';
import { END_ANGLE, ROTATION, START_ANGLE } from '@app/constants/ellipse-constants';
import * as MouseConstants from '@app/constants/mouse-constants';
import * as SelectionConstants from '@app/constants/selection-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EllipseService } from '@app/services/tools/ellipse/ellipse-service';
import { EllipseSelectionCommand } from '@app/services/tools/selection/ellipse/ellipse-selection-command';
import { ResizerHandlerService } from '@app/services/tools/selection/resizer/resizer-handler.service';
import { ToolSelectionService } from '@app/services/tools/selection/tool-selection-service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class EllipseSelectionService extends ToolSelectionService {
    inUse: boolean = false;
    isManipulating: boolean = false;
    transformValues: Vec2;
    isCircle: boolean = false;
    isShiftDown: boolean = false;
    isEscapeDown: boolean = false;
    cornerCoords: Vec2[] = new Array<Vec2>(2);
    selectionHeight: number = 0;
    selectionWidth: number = 0;
    isFromClipboard: boolean = false;

    constructor(
        drawingService: DrawingService,
        undoRedoService: UndoRedoService,
        resizerHandlerService: ResizerHandlerService,
        public ellipseService: EllipseService,
    ) {
        super(drawingService, undoRedoService, resizerHandlerService, ellipseService);
    }

    onMouseDown(event: MouseEvent): void {
        if (this.isManipulating) {
            this.confirmSelection();
        }
        this.inUse = event.button === MouseConstants.MouseButton.Left;
        if (this.inUse) {
            this.cornerCoords[SelectionConstants.START_INDEX] = this.getPositionFromMouse(event);
            super.onMouseDown(event);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.inUse) {
            this.cornerCoords[SelectionConstants.END_INDEX] = this.getPositionFromMouse(event);
            this.ellipseService.inUse = false;
            super.onMouseUp(event);
            this.selectionWidth = this.cornerCoords[SelectionConstants.END_INDEX].x - this.cornerCoords[SelectionConstants.START_INDEX].x;
            this.selectionHeight = this.cornerCoords[SelectionConstants.END_INDEX].y - this.cornerCoords[SelectionConstants.START_INDEX].y;
            if (!this.validateSelectionHeightAndWidth()) {
                return;
            }
            this.drawingService.selectionCanvas.width = this.drawingService.previewSelectionCanvas.width = this.selectionWidth;
            this.drawingService.selectionCanvas.height = this.drawingService.previewSelectionCanvas.height = this.selectionHeight;
            this.selectEllipse(this.drawingService.selectionCtx, this.drawingService.baseCtx);
            this.setSelectionCanvasPosition(this.cornerCoords[SelectionConstants.START_INDEX]);
            this.inUse = false;
            this.isManipulating = true;
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.inUse) {
            this.cornerCoords[SelectionConstants.END_INDEX] = this.getPositionFromMouse(event);
            super.onMouseMove(event);
        }
    }

    onMouseLeave(event: MouseEvent): void {
        super.onMouseLeave(event);
    }

    onMouseEnter(event: MouseEvent): void {
        super.onMouseEnter(event);
    }

    onKeyboardDown(event: KeyboardEvent): void {
        super.onKeyboardDown(event);
        if (this.inUse) {
            if (event.key === 'Shift' && !this.isShiftDown) {
                this.isCircle = true;
                this.isShiftDown = true;
            } else if (event.key === 'Escape' && !this.isEscapeDown) {
                this.isEscapeDown = true;
            }
        } else if (this.isManipulating) {
            if (event.key === 'Escape' && !this.isEscapeDown) {
                this.isEscapeDown = true;
            }
        }
    }

    onKeyboardUp(event: KeyboardEvent): void {
        super.onKeyboardUp(event);
        if (this.inUse) {
            // Case where the user is still selecting.
            if (event.key === 'Shift' && this.isShiftDown) {
                this.isCircle = false;
                this.isShiftDown = false;
            } else if (event.key === 'Escape' && this.isEscapeDown) {
                this.resetCanvasState(this.drawingService.selectionCanvas);
                this.resetCanvasState(this.drawingService.previewSelectionCanvas);
                this.resetSelectedToolSettings();
                // Erase the rectangle drawn as a preview of selection
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.inUse = false;
                this.isEscapeDown = false;
            }
        } else if (this.isManipulating) {
            if (event.key === 'Escape' && this.isEscapeDown) {
                // Case where user has defined the selection area
                // onMouseDown draws the image on baseCtx.
                this.onMouseDown({} as MouseEvent);
                this.isEscapeDown = false;
            }
        }
    }

    onToolChange(): void {
        if (this.isManipulating) {
            const emptyMouseEvent: MouseEvent = {} as MouseEvent;
            this.onMouseDown(emptyMouseEvent);
        } else if (this.inUse) {
            const resetKeyboardEvent: KeyboardEvent = {
                key: 'Escape',
            } as KeyboardEvent;
            this.isEscapeDown = true;
            this.onKeyboardUp(resetKeyboardEvent);
            this.ellipseService.inUse = false;
        }
    }

    fillEllipse(ctx: CanvasRenderingContext2D, cornerCoords: Vec2[], isCircle: boolean): void {
        const ellipseCenter = this.getEllipseCenter(
            cornerCoords[SelectionConstants.START_INDEX],
            cornerCoords[SelectionConstants.END_INDEX],
            isCircle,
        );
        const startX = ellipseCenter.x;
        const startY = ellipseCenter.y;
        const radiiXAndY = this.getRadiiXAndY(this.cornerCoords);
        const xRadius = radiiXAndY[0];
        const yRadius = radiiXAndY[1];
        ctx.beginPath();
        ctx.ellipse(startX, startY, xRadius, yRadius, ROTATION, START_ANGLE, END_ANGLE);
        ctx.fillStyle = 'white';
        ctx.fill();
    }

    clipEllipse(ctx: CanvasRenderingContext2D, start: Vec2, offset: number): void {
        const end: Vec2 = {
            x: start.x + this.selectionWidth,
            y: start.y + this.selectionHeight,
        };
        const ellipseCenter = this.getEllipseCenter(start, end, this.isCircle);
        const startX = ellipseCenter.x;
        const startY = ellipseCenter.y;
        const radiiXAndY = this.getRadiiXAndY([start, end]);
        const xRadius = radiiXAndY[0];
        const yRadius = radiiXAndY[1];
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.ellipse(startX, startY, xRadius + offset, yRadius + offset, ROTATION, START_ANGLE, END_ANGLE);
        ctx.clip();
    }

    drawOutlineEllipse(ctx: CanvasRenderingContext2D, start: Vec2, radius: Vec2): void {
        const offset = SelectionConstants.DRAWN_ELLIPSE_RADIUS_OFFSET;
        ctx.beginPath();
        ctx.setLineDash([SelectionConstants.DEFAULT_LINE_DASH, SelectionConstants.DEFAULT_LINE_DASH]);
        ctx.ellipse(start.x, start.y, radius.x + offset, radius.y + offset, ROTATION, START_ANGLE, END_ANGLE);
        ctx.stroke();
    }

    setSelectionCanvasPosition(topLeft: Vec2): void {
        this.drawingService.selectionCanvas.style.left = topLeft.x + 'px';
        this.drawingService.selectionCanvas.style.top = topLeft.y + 'px';
        this.drawingService.previewSelectionCanvas.style.left = topLeft.x + 'px';
        this.drawingService.previewSelectionCanvas.style.top = topLeft.y + 'px';
        this.resizerHandlerService.setResizerPositions(this.drawingService.selectionCanvas);
    }

    confirmSelection(): void {
        // transformValues represent where the canvas' topleft corner was moved
        this.transformValues = {
            x: parseInt(this.drawingService.selectionCanvas.style.left, 10),
            y: parseInt(this.drawingService.selectionCanvas.style.top, 10),
        };
        const command: Command = new EllipseSelectionCommand(this.drawingService.baseCtx, this.drawingService.selectionCanvas, this);
        this.undoRedoService.executeCommand(command);
        this.isManipulating = false;
        this.isCircle = false;
        this.isShiftDown = false;
        // Reset selection canvas to {w=0, h=0}, {top=0, left=0} and transform values
        this.resetCanvasState(this.drawingService.selectionCanvas);
        this.resetCanvasState(this.drawingService.previewSelectionCanvas);
        this.clearCorners(this.cornerCoords);
        this.resetSelectedToolSettings();
        this.resizerHandlerService.resetResizers();
        this.isFromClipboard = false;
    }

    undoSelection(): void {
        if (!this.isManipulating) return;
        this.clipEllipse(this.drawingService.baseCtx, this.cornerCoords[0], 1);
        if (!this.isFromClipboard) {
            this.drawingService.baseCtx.drawImage(
                this.drawingService.selectionCanvas,
                0,
                0,
                this.selectionWidth,
                this.selectionHeight,
                this.cornerCoords[0].x,
                this.cornerCoords[0].y,
                this.selectionWidth,
                this.selectionHeight,
            );
        }
        this.drawingService.baseCtx.restore();
        this.resetSelectedToolSettings();
        this.resetCanvasState(this.drawingService.selectionCanvas);
        this.resetCanvasState(this.drawingService.previewSelectionCanvas);
        this.resizerHandlerService.resetResizers();
        this.isManipulating = false;
        this.isEscapeDown = false;
    }

    private validateSelectionHeightAndWidth(): boolean {
        if (this.selectionWidth === 0 || this.selectionHeight === 0) {
            this.resetSelectedToolSettings();
            this.inUse = false;
            return false;
        }
        this.cornerCoords = this.validateCornerCoords(this.cornerCoords, this.selectionWidth, this.selectionHeight);
        if (this.isCircle) {
            const shortestSide = Math.min(Math.abs(this.selectionWidth), Math.abs(this.selectionHeight));
            this.cornerCoords = this.computeSquareCoords(this.cornerCoords, this.selectionWidth, this.selectionHeight);
            this.selectionHeight = this.selectionWidth = shortestSide;
        }
        this.selectionWidth = Math.abs(this.selectionWidth);
        this.selectionHeight = Math.abs(this.selectionHeight);
        return true;
    }
    private getRadiiXAndY(path: Vec2[]): number[] {
        let xRadius = Math.abs(path[SelectionConstants.END_INDEX].x - path[SelectionConstants.START_INDEX].x) / 2;
        let yRadius = Math.abs(path[SelectionConstants.END_INDEX].y - path[SelectionConstants.START_INDEX].y) / 2;
        if (this.isCircle) {
            const shortestSide = Math.min(Math.abs(xRadius), Math.abs(yRadius));
            xRadius = yRadius = shortestSide;
        }
        return [xRadius, yRadius];
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

    private selectEllipse(selectionCtx: CanvasRenderingContext2D, baseCtx: CanvasRenderingContext2D): void {
        this.clipEllipseSelection(selectionCtx, baseCtx);
        this.fillEllipse(baseCtx, this.cornerCoords, this.isCircle);
    }

    private clipEllipseSelection(selectionCtx: CanvasRenderingContext2D, baseCtx: CanvasRenderingContext2D): void {
        const start: Vec2 = {} as Vec2;
        const radius: Vec2 = {} as Vec2;
        start.x = radius.x = this.selectionWidth / 2;
        start.y = radius.y = this.selectionHeight / 2;
        this.clipEllipse(selectionCtx, { x: 0, y: 0 }, 2);
        selectionCtx.drawImage(
            baseCtx.canvas,
            this.cornerCoords[SelectionConstants.START_INDEX].x,
            this.cornerCoords[SelectionConstants.START_INDEX].y,
            this.selectionWidth,
            this.selectionHeight,
            0,
            0,
            this.selectionWidth,
            this.selectionHeight,
        );
        selectionCtx.restore();
        this.drawOutlineEllipse(this.drawingService.selectionCtx, start, radius);
    }
}
