import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import * as LineConstants from '@app/constants/line-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';

export enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2,
    Back = 3,
    Forward = 4,
}

@Injectable({
    providedIn: 'root',
})
export class LineService extends Tool {
    mousePosition: Vec2;
    initialPoint: Vec2;
    linePathData: Vec2[];
    canvasState: ImageData;

    shiftDown: boolean = false;
    isDrawing: boolean = false;
    isEscapeKeyDown: boolean = false;
    isBackspaceKeyDown: boolean = false;

    // optionValues to be obtained from settings manager.
    withJunctionOption: boolean = true;
    junctionRadiusOption: number = 15;
    lineWidthOption: number = 10;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.clearPath();
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
        if (this.isDrawing) {
            if (event.key === 'Shift' && !this.shiftDown) {
                const angle = this.calculateAngle(this.linePathData[LineConstants.STARTING_POINT], this.mousePosition);
                const finalAngle = this.roundAngleToNearestMultiple(angle, LineConstants.DEGREES_45);
                const finalLineCoord: Vec2 = this.calculateLengthAndFlatten(
                    this.linePathData[LineConstants.STARTING_POINT],
                    this.mousePosition,
                    finalAngle,
                );
                this.linePathData[LineConstants.ENDING_POINT] = this.rotateLine(
                    this.linePathData[LineConstants.STARTING_POINT],
                    finalLineCoord,
                    finalAngle,
                );
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawLine(this.drawingService.previewCtx, this.linePathData);
                this.shiftDown = true;
            } else if (event.key === 'Escape') {
                this.isEscapeKeyDown = true;
            } else if (event.key === 'Backspace') {
                this.isBackspaceKeyDown = true;
            }
        }
    }

    onKeyboardUp(event: KeyboardEvent): void {
        if (this.isDrawing) {
            if (event.key === 'Shift') {
                this.shiftDown = false;
                this.linePathData[LineConstants.ENDING_POINT] = this.mousePosition;
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawLine(this.drawingService.previewCtx, this.linePathData);
            } else if (event.key === 'Escape' && this.isEscapeKeyDown) {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.isEscapeKeyDown = false;
            } else if (event.key === 'Backspace' && this.isBackspaceKeyDown) {
                this.drawingService.baseCtx.putImageData(this.canvasState, 0, 0);
            }
        }
    }

    onMouseClick(event: MouseEvent): void {
        if (!this.isDrawing) {
            this.clearPath();
            this.isDrawing = true;
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.initialPoint = this.mouseDownCoord;
            this.linePathData[LineConstants.STARTING_POINT] = this.mouseDownCoord;
            this.canvasState = this.drawingService.baseCtx.getImageData(0, 0, this.drawingService.canvas.width, this.drawingService.canvas.height);
        } else {
            const distanceToInitialPoint = this.calculateDistance(this.linePathData[LineConstants.ENDING_POINT], this.initialPoint);
            if (distanceToInitialPoint < LineConstants.PIXEL_PROXIMITY_LIMIT) {
                this.linePathData[LineConstants.ENDING_POINT] = this.initialPoint;
            }
            // We do a save of the current state of the canvas in order to deal with the user's 'undo last line' option on backspace.
            this.canvasState = this.drawingService.baseCtx.getImageData(0, 0, this.drawingService.canvas.width, this.drawingService.canvas.height);
            this.drawLine(this.drawingService.baseCtx, this.linePathData);
            this.linePathData[LineConstants.STARTING_POINT] = this.linePathData[LineConstants.ENDING_POINT];
        }
    }

    onMouseDoubleClick(event: MouseEvent): void {
        if (this.isDrawing) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.clearPath();
            this.isDrawing = false;
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.isDrawing) {
            this.mousePosition = this.getPositionFromMouse(event);
            this.linePathData[LineConstants.ENDING_POINT] = this.mousePosition;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.previewCtx, this.linePathData);
        }
    }

    private drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        if (this.withJunctionOption) {
            ctx.arc(
                path[LineConstants.ENDING_POINT].x,
                path[LineConstants.ENDING_POINT].y,
                this.junctionRadiusOption,
                LineConstants.DEGREES_0,
                LineConstants.DEGREES_360,
            );
            ctx.fill();
        }
        ctx.lineWidth = this.lineWidthOption;
        ctx.moveTo(path[LineConstants.STARTING_POINT].x, path[LineConstants.STARTING_POINT].y);
        ctx.lineTo(path[LineConstants.ENDING_POINT].x, path[LineConstants.ENDING_POINT].y);
        ctx.stroke();
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
