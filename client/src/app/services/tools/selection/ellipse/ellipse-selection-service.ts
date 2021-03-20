import { Injectable } from '@angular/core';
import { Command } from '@app/classes/command';
import { Vec2 } from '@app/classes/vec2';
import { END_ANGLE, ROTATION, START_ANGLE } from '@app/constants/ellipse-constants';
import * as MouseConstants from '@app/constants/mouse-constants';
import * as SelectionConstants from '@app/constants/selection-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ResizerHandlerService } from '@app/services/resizer/resizer-handler.service';
import { EllipseService } from '@app/services/tools/ellipse/ellipse-service';
import { EllipseSelectionCommand } from '@app/services/tools/selection/ellipse/ellipse-selection-command';
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
            this.resizerHandlerService.resetResizers();
            this.clearCorners(this.cornerCoords);
            this.resetSelectedToolSettings();
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
            if (this.selectionWidth === 0 || this.selectionHeight === 0) {
                this.resetSelectedToolSettings();
                this.inUse = false;
                return;
            }
            this.cornerCoords = this.validateCornerCoords(this.cornerCoords, this.selectionWidth, this.selectionHeight);
            this.selectionWidth = Math.abs(this.selectionWidth);
            this.selectionHeight = Math.abs(this.selectionHeight);
            if (this.isCircle) {
                const shortestSide = Math.min(this.selectionWidth, this.selectionHeight);
                this.selectionHeight = this.selectionWidth = shortestSide;
            }
            this.drawingService.selectionCanvas.width = this.selectionWidth;
            this.drawingService.selectionCanvas.height = this.selectionHeight;
            // We clip the part of the selectionCanvas that we want to select, in this case an ellipse
            this.drawSelectionOnSelectionCanvas();
            this.deleteSelectionZoneOnBaseCanvas();
            this.drawingService.selectionCanvas.style.left = this.cornerCoords[SelectionConstants.START_INDEX].x + 'px';
            this.drawingService.selectionCanvas.style.top = this.cornerCoords[SelectionConstants.START_INDEX].y + 'px';
            this.resizerHandlerService.setResizerPosition(
                this.cornerCoords[SelectionConstants.START_INDEX],
                this.selectionWidth,
                this.selectionHeight,
            );
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
            if (event.key === 'Shift' && this.isShiftDown) {
                this.isCircle = false;
                this.isShiftDown = false;
            } else if (event.key === 'Escape' && this.isEscapeDown) {
                // Case where the user is still selecting.
                this.resetCanvasState(this.drawingService.selectionCanvas);
                this.resetSelectedToolSettings();
                // Erase the rectangle drawn as a preview of selection
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.inUse = false;
                this.isEscapeDown = false;
            }
        } else if (this.isManipulating) {
            if (event.key === 'Escape' && this.isEscapeDown) {
                // Case where user has defined the selection area
                // Draw the image on baseCtx.
                this.onMouseDown({} as MouseEvent);
                this.resetCanvasState(this.drawingService.selectionCanvas);
                this.resetSelectedToolSettings();
                this.resizerHandlerService.resetResizers();
                this.isManipulating = false;
                this.isEscapeDown = false;
            }
        }
    }

    undoSelection(): void {
        if (this.isManipulating) {
            this.clipEllise(this.drawingService.baseCtx, this.cornerCoords[0], this.selectionHeight, this.selectionWidth, 0);
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
            this.drawingService.baseCtx.restore();
            this.resetSelectedToolSettings();
            this.resetCanvasState(this.drawingService.selectionCanvas);
            this.resizerHandlerService.resetResizers();
            this.isManipulating = false;
            this.isEscapeDown = false;
        }
    }

    drawSelectionOnSelectionCanvas(): void {
        let startX: number;
        let radiusX: number;
        let startY: number;
        let radiusY: number;
        startX = radiusX = this.selectionWidth / 2;
        startY = radiusY = this.selectionHeight / 2;
        this.clipEllise(this.drawingService.selectionCtx, { x: 0, y: 0 }, this.selectionHeight, this.selectionWidth, 0);
        this.drawingService.selectionCtx.drawImage(
            this.drawingService.canvas,
            this.cornerCoords[SelectionConstants.START_INDEX].x,
            this.cornerCoords[SelectionConstants.START_INDEX].y,
            this.selectionWidth,
            this.selectionHeight,
            0,
            0,
            this.selectionWidth,
            this.selectionHeight,
        );
        this.drawingService.selectionCtx.restore();
        // Draw outline on selectionCanvas, this outline will be on selectionCanvas but not part of the clipped zone.
        this.drawingService.selectionCtx.beginPath();
        this.drawingService.selectionCtx.setLineDash([SelectionConstants.DEFAULT_LINE_DASH, SelectionConstants.DEFAULT_LINE_DASH]);
        this.drawingService.selectionCtx.ellipse(
            startX,
            startY,
            radiusX + SelectionConstants.OFFSET_RADIUS,
            radiusY + SelectionConstants.OFFSET_RADIUS,
            ROTATION,
            START_ANGLE,
            END_ANGLE,
        );
        this.drawingService.selectionCtx.stroke();
    }

    deleteSelectionZoneOnBaseCanvas(): void {
        const ellipseCenter = this.getEllipseCenter(
            this.cornerCoords[SelectionConstants.START_INDEX],
            this.cornerCoords[SelectionConstants.END_INDEX],
            this.isCircle,
        );
        const startX = ellipseCenter.x;
        const startY = ellipseCenter.y;
        const radiiXAndY = this.getRadiiXAndY(this.cornerCoords);
        const xRadius = radiiXAndY[0];
        const yRadius = radiiXAndY[1];
        this.drawingService.baseCtx.beginPath();
        this.drawingService.baseCtx.ellipse(startX, startY, xRadius, yRadius, ROTATION, START_ANGLE, END_ANGLE);
        this.drawingService.baseCtx.fillStyle = 'white';
        this.drawingService.baseCtx.fill();
    }

    clipEllise(ctx: CanvasRenderingContext2D, start: Vec2, height: number, width: number, offset: number): void {
        const end: Vec2 = {
            x: start.x + width,
            y: start.y + height,
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
        ctx.ellipse(startX, startY, xRadius - offset, yRadius - offset, ROTATION, START_ANGLE, END_ANGLE);
        ctx.clip();
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
}
