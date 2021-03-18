import { Injectable } from '@angular/core';
import { Command } from '@app/classes/command';
import { Vec2 } from '@app/classes/vec2';
import { END_ANGLE, ROTATION, START_ANGLE } from '@app/constants/ellipse-constants';
import * as MouseConstants from '@app/constants/mouse-constants';
import * as SelectionConstants from '@app/constants/selection-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
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

    constructor(drawingService: DrawingService, undoRedoService: UndoRedoService, public ellipseService: EllipseService) {
        super(drawingService, undoRedoService, ellipseService);
    }

    onMouseDown(event: MouseEvent) {
        if (this.isManipulating) {
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
            this.clearCorners();
            this.resetSelectedToolSettings();
        }
        this.inUse = event.button === MouseConstants.MouseButton.Left;
        if (this.inUse) {
            this.cornerCoords[SelectionConstants.START_INDEX] = this.getPositionFromMouse(event);
            super.onMouseDown(event);
        }
    }

    onMouseUp(event: MouseEvent) {
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
            this.validateCornerCoords();
            this.selectionWidth = Math.abs(this.selectionWidth);
            this.selectionHeight = Math.abs(this.selectionHeight);
            console.log(this.isCircle);
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
            this.inUse = false;
            this.isManipulating = true;
        }
    }

    onMouseMove(event: MouseEvent) {
        if (this.inUse) {
            this.cornerCoords[SelectionConstants.END_INDEX] = this.getPositionFromMouse(event);
            super.onMouseMove(event);
        }
    }

    onMouseLeave(event: MouseEvent) {
        super.onMouseLeave(event);
    }

    onMouseEnter(event: MouseEvent) {
        super.onMouseEnter(event);
    }

    onKeyboardDown(event: KeyboardEvent) {
        super.onKeyboardDown(event);
        if (this.inUse) {
            if (event.key === 'Shift' && !this.isShiftDown) {
                this.isCircle = true;
                this.isShiftDown = true;
                console.log(this.isCircle);
            } else if (event.key === 'Escape' && !this.isEscapeDown) {
                this.isEscapeDown = true;
            }
        } else if (this.isManipulating) {
            if (event.key === 'Escape' && !this.isEscapeDown) {
                this.isEscapeDown = true;
            }
        }
    }

    onKeyboardUp(event: KeyboardEvent) {
        super.onKeyboardUp(event);
        if (this.inUse) {
            if (event.key === 'Shift' && this.isShiftDown) {
                this.isCircle = false;
                this.isShiftDown = false;
            } else if (event.key === 'Escape' && this.isEscapeDown) {
                // Case where the user is still selecting.
                this.resetCanvasState(this.drawingService.selectionCanvas);
                this.resetSelectedToolSettings();
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.inUse = false;
                this.isEscapeDown = false;
            }
        } else if (this.isManipulating) {
            if (event.key === 'Escape' && this.isEscapeDown) {
                // Case where user has defined the selection area
                this.drawingService.baseCtx.drawImage(
                    this.drawingService.selectionCanvas,
                    0,
                    0,
                    this.selectionWidth,
                    this.selectionHeight,
                    this.cornerCoords[SelectionConstants.START_INDEX].x,
                    this.cornerCoords[SelectionConstants.START_INDEX].y,
                    this.selectionWidth,
                    this.selectionHeight,
                );
                this.resetCanvasState(this.drawingService.selectionCanvas);
                this.resetSelectedToolSettings();
                this.isManipulating = false;
                this.isEscapeDown = false;
                this.isShiftDown = false;
            }
        }
    }

    clearCorners(): void {
        this.cornerCoords.fill({ x: 0, y: 0 });
    }

    drawSelectionOnSelectionCanvas(): void {
        let startX, radiusX;
        let startY, radiusY;
        startX = radiusX = this.selectionWidth / 2;
        startY = radiusY = this.selectionHeight / 2;
        this.drawingService.selectionCtx.save();
        this.drawingService.selectionCtx.beginPath();
        this.drawingService.selectionCtx.ellipse(startX, startY, radiusX, radiusY, ROTATION, START_ANGLE, END_ANGLE);
        // this.drawingService.selectionCtx.stroke();
        this.drawingService.selectionCtx.clip();
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

    validateCornerCoords() {
        const tempCoord = this.cornerCoords[SelectionConstants.START_INDEX];
        if (this.selectionHeight < 0 && this.selectionWidth < 0) {
            this.cornerCoords[SelectionConstants.START_INDEX] = this.cornerCoords[SelectionConstants.END_INDEX];
            this.cornerCoords[SelectionConstants.END_INDEX] = tempCoord;
        } else if (this.selectionWidth < 0 && this.selectionHeight > 0) {
            this.cornerCoords[SelectionConstants.START_INDEX].x = this.cornerCoords[SelectionConstants.END_INDEX].x;
            this.cornerCoords[SelectionConstants.END_INDEX].x = tempCoord.x;
        } else if (this.selectionWidth > 0 && this.selectionHeight < 0) {
            this.cornerCoords[SelectionConstants.START_INDEX].y = this.cornerCoords[SelectionConstants.END_INDEX].y;
            this.cornerCoords[SelectionConstants.END_INDEX].y = tempCoord.y;
        }
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
