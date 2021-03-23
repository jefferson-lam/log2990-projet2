import { Injectable } from '@angular/core';
import { Command } from '@app/classes/command';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import * as LineConstants from '@app/constants/line-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { LineCommand } from '@app/services/tools/line/line-command';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class LineService extends Tool {
    mousePosition: Vec2;
    initialPoint: Vec2;
    linePathData: Vec2[];

    previewCommand: LineCommand;

    shiftDown: boolean;

    withJunction: boolean;
    junctionRadius: number;
    lineWidth: number;
    primaryColor: string;

    constructor(drawingService: DrawingService, undoRedoService: UndoRedoService) {
        super(drawingService, undoRedoService);
        this.clearPath();
        this.previewCommand = new LineCommand(drawingService.previewCtx, this);
        this.shiftDown = false;
        this.withJunction = false;
        this.junctionRadius = LineConstants.MIN_JUNCTION_RADIUS;
        this.lineWidth = LineConstants.MIN_LINE_WIDTH;
        this.primaryColor = LineConstants.DEFAULT_PRIMARY_COLOR;
    }

    setPrimaryColor(newColor: string): void {
        this.primaryColor = newColor;
    }

    setLineWidth(width: number): void {
        if (width < LineConstants.MIN_LINE_WIDTH) {
            this.lineWidth = LineConstants.MIN_LINE_WIDTH;
        } else if (width > LineConstants.MAX_LINE_WIDTH) {
            this.lineWidth = LineConstants.MAX_LINE_WIDTH;
        } else {
            this.lineWidth = width;
        }
        if (this.lineWidth > this.junctionRadius) {
            this.setJunctionRadius(this.lineWidth / LineConstants.MIN_JUNCTION_TO_LINE_FACTOR);
        }
    }

    setJunctionRadius(junctionRadius: number): void {
        if (junctionRadius < this.lineWidth / LineConstants.MIN_JUNCTION_TO_LINE_FACTOR || junctionRadius < LineConstants.MIN_JUNCTION_RADIUS) {
            this.junctionRadius = this.lineWidth / LineConstants.MIN_JUNCTION_TO_LINE_FACTOR;
        } else if (junctionRadius > LineConstants.MAX_JUNCTION_RADIUS) {
            this.junctionRadius = LineConstants.MAX_JUNCTION_RADIUS;
        } else {
            this.junctionRadius = junctionRadius;
        }
    }

    setWithJunction(hasJunction: boolean): void {
        this.withJunction = hasJunction;
    }

    /**
     * Function handles three different keydowns: Shift, Escape and Backspace.
     * In the case of shift, this function first calculates the angle between both
     * points. It rounds to the nearest multiple of 45, and computes a intermediate
     * set of points at a set length defined by the requirements for each angle,
     * at the angle 0. It finally rotates this set of points a new set of point at the
     * required angle.
     * We use keyboardDown event to simulate Escape and backspace as the keyboardClick
     * event does not work for these modifiers.
     */
    onKeyboardDown(event: KeyboardEvent): void {
        if (this.inUse && event.key === 'Shift' && !this.shiftDown) {
            this.stickToClosest45Angle();
            this.drawPreview();
            this.shiftDown = true;
        }
    }

    onKeyboardUp(event: KeyboardEvent): void {
        if (!this.inUse) {
            return;
        }
        switch (event.key) {
            case 'Shift':
                this.shiftDown = false;
                this.linePathData[this.linePathData.length - 1] = this.mousePosition;
                this.drawPreview();
                break;
            case 'Escape':
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.clearPath();
                this.inUse = false;
                break;
            case 'Backspace':
                this.linePathData.pop();
                this.finishLine();
                break;
        }
    }

    onMouseDown(event: MouseEvent): void {
        if (!this.inUse) {
            this.clearPath();
            this.inUse = true;
            this.initialPoint = this.getPositionFromMouse(event);
            this.linePathData[LineConstants.STARTING_POINT] = this.initialPoint;
            this.linePathData.push(this.initialPoint);
        } else {
            this.linePathData.push(this.linePathData[this.linePathData.length - 1]);
            this.drawPreview();
        }
    }

    onMouseDoubleClick(event: MouseEvent): void {
        if (this.inUse) {
            this.linePathData.splice(this.linePathData.length - 2, 2);
            this.finishLine();
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.inUse) {
            this.mousePosition = this.getPositionFromMouse(event);
            const distanceToInitialPoint = this.calculateDistance(this.mousePosition, this.initialPoint);
            if (distanceToInitialPoint < LineConstants.PIXEL_PROXIMITY_LIMIT) {
                this.linePathData[this.linePathData.length - 1] = this.initialPoint;
            } else if (this.shiftDown) {
                this.stickToClosest45Angle();
            } else {
                this.linePathData[this.linePathData.length - 1] = this.mousePosition;
            }
            this.drawPreview();
        }
    }

    finishLine(): void {
        const command: Command = new LineCommand(this.drawingService.baseCtx, this);
        this.undoRedoService.executeCommand(command);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.clearPath();
        this.inUse = false;
        this.shiftDown = false;
    }

    stickToClosest45Angle(): void {
        const angle = this.calculateAngle(this.linePathData[this.linePathData.length - 2], this.mousePosition);
        const finalAngle = this.roundAngleToNearestMultiple(angle, LineConstants.DEGREES_45);
        const finalLineCoord: Vec2 = this.calculateLengthAndFlatten(this.linePathData[this.linePathData.length - 2], this.mousePosition, finalAngle);
        this.linePathData[this.linePathData.length - 1] = this.rotateLine(
            this.linePathData[this.linePathData.length - 2],
            finalLineCoord,
            finalAngle,
        );
    }

    drawPreview(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.previewCommand.setValues(this.drawingService.previewCtx, this);
        this.previewCommand.execute();
    }

    private clearPath(): void {
        this.linePathData = [];
    }

    /**
     * Computes the new coordinates of the point with regards to the specified angle, and
     * makes sure that length of line matches requirements:
     * Case 0, 45, 135, 180, 225, 315:
     *     Distance in x plane needs to be equal to the x position of the mouse.
     * Case 90, 270:
     *     Distance in y plane needs to be equal to the y position of the mouse.
     */
    calculateLengthAndFlatten(initialPoint: Vec2, mousePosition: Vec2, angle: number): Vec2 {
        let lineLength = 0;
        switch (angle) {
            case LineConstants.DEGREES_45:
            case LineConstants.DEGREES_135:
            case LineConstants.DEGREES_225:
            case LineConstants.DEGREES_315:
                lineLength = Math.abs(Math.abs(mousePosition.x - initialPoint.x) / Math.cos(angle * (Math.PI / LineConstants.DEGREES_180)));
                break;
            case LineConstants.DEGREES_90:
            case LineConstants.DEGREES_270:
                lineLength = Math.abs(mousePosition.y - initialPoint.y);
                break;
            default:
                lineLength = Math.abs(mousePosition.x - initialPoint.x);
                break;
        }

        // We simply add to the x position to ensure our line is at 0 degrees.
        return {
            x: Math.round(initialPoint.x + lineLength),
            y: Math.round(initialPoint.y),
        };
    }

    // Application of trigonometric laws to determine position of new point in the
    // angle defined by user relative to the initial point.
    rotateLine(initialPoint: Vec2, currentPoint: Vec2, angle: number): Vec2 {
        const radians = (Math.PI / LineConstants.DEGREES_180) * angle;
        return {
            x: Math.round(
                (currentPoint.x - initialPoint.x) * Math.cos(radians) + (currentPoint.y - initialPoint.y) * Math.sin(radians) + initialPoint.x,
            ),
            y: Math.round(
                (currentPoint.y - initialPoint.y) * Math.cos(radians) - (currentPoint.x - initialPoint.x) * Math.sin(radians) + initialPoint.y,
            ),
        };
    }

    // Application of pythagorean theorem to compute euclidean distance.
    calculateDistance(initialPoint: Vec2, currentPoint: Vec2): number {
        return Math.abs(Math.sqrt(Math.pow(currentPoint.x - initialPoint.x, 2) + Math.pow(currentPoint.y - initialPoint.y, 2)));
    }

    // Application of inverse tangent to compute the angle between two points.
    // Returns angle in degrees.
    calculateAngle(initialPoint: Vec2, currentPoint: Vec2): number {
        let angle = (Math.atan2(initialPoint.y - currentPoint.y, currentPoint.x - initialPoint.x) * LineConstants.DEGREES_180) / Math.PI;
        if (angle < LineConstants.DEGREES_0) {
            angle += LineConstants.DEGREES_360;
        }
        return angle;
    }

    roundAngleToNearestMultiple(angleBetweenTwoPoints: number, multiple: number): number {
        // We add to the angle the multiple divided by two in order to make sure that when we
        // the nearest multiple can always be obtained by rounding down. We floor the result in order to
        // eliminate floating point numbers, and the include the edge case: 0 as an final angle.
        return Math.floor((angleBetweenTwoPoints + multiple / 2) / multiple) * multiple;
    }
}
