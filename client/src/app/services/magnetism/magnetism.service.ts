import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import * as MagnestismConstants from '@app/constants/magnetism-constants';
import { CanvasGridService } from '@app/services/canvas-grid/canvas-grid.service';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class MagnetismService {
    isMagnetismOn: boolean;
    referenceResizerMode: MagnestismConstants.ResizerIndex;
    topLeftResizerCoords: Vec2;
    bottomRightResizerCoords: Vec2;
    referenceResizerCoords: Vec2;
    magnetismStateSubject: Subject<boolean> = new Subject<boolean>();

    constructor(private canvasGridService: CanvasGridService) {
        this.isMagnetismOn = false;
        this.referenceResizerMode = MagnestismConstants.ResizerIndex.TOP_LEFT_INDEX;
    }

    magnetizeSelection(selectionCanvas: HTMLCanvasElement, transformValues: Vec2): Vec2 {
        this.setCornerCoords(selectionCanvas);
        switch (this.referenceResizerMode) {
            case MagnestismConstants.ResizerIndex.TOP_LEFT_INDEX:
                this.referenceResizerCoords = this.topLeftResizerCoords;
                break;
            case MagnestismConstants.ResizerIndex.TOP_MIDDLE_INDEX:
                const topMiddleXPosition = (this.topLeftResizerCoords.x + this.bottomRightResizerCoords.x) / 2;
                this.referenceResizerCoords = { x: topMiddleXPosition, y: this.topLeftResizerCoords.y };
                break;
            case MagnestismConstants.ResizerIndex.TOP_RIGHT_INDEX:
                this.referenceResizerCoords = { x: this.bottomRightResizerCoords.x, y: this.topLeftResizerCoords.y };
                break;
            case MagnestismConstants.ResizerIndex.MID_LEFT_INDEX:
                const middleYLeftPosition = (this.topLeftResizerCoords.y + this.bottomRightResizerCoords.y) / 2;
                this.referenceResizerCoords = { x: this.topLeftResizerCoords.x, y: middleYLeftPosition };
                break;
            case MagnestismConstants.ResizerIndex.MID_RIGHT_INDEX:
                const middleRightPosition = (this.topLeftResizerCoords.y + this.bottomRightResizerCoords.y) / 2;
                this.referenceResizerCoords = { x: this.bottomRightResizerCoords.x, y: middleRightPosition };
                break;
            case MagnestismConstants.ResizerIndex.BOTTOM_LEFT_INDEX:
                this.referenceResizerCoords = { x: this.topLeftResizerCoords.x, y: this.bottomRightResizerCoords.y };
                break;
            case MagnestismConstants.ResizerIndex.BOTTOM_MIDDLE_INDEX:
                const bottomMiddleXPosition = (this.topLeftResizerCoords.x + this.bottomRightResizerCoords.x) / 2;
                this.referenceResizerCoords = { x: bottomMiddleXPosition, y: this.bottomRightResizerCoords.y };
                break;
            case MagnestismConstants.ResizerIndex.BOTTOM_RIGHT_INDEX:
                this.referenceResizerCoords = this.bottomRightResizerCoords;
                break;
            case MagnestismConstants.ResizerIndex.CENTER_INDEX:
                const centerXCoords = (this.topLeftResizerCoords.x + this.bottomRightResizerCoords.x) / 2;
                const centerYCoords = (this.topLeftResizerCoords.y + this.bottomRightResizerCoords.y) / 2;
                this.referenceResizerCoords = { x: centerXCoords, y: centerYCoords };
                break;
        }
        return this.findClosestCorner(transformValues);
    }

    toggleMagnetism(): void {
        this.isMagnetismOn = !this.isMagnetismOn;
        this.magnetismStateSubject.next(this.isMagnetismOn);
    }

    private setCornerCoords(selectionCanvas: HTMLCanvasElement): void {
        this.topLeftResizerCoords = { x: parseInt(selectionCanvas.style.left, 10), y: parseInt(selectionCanvas.style.top, 10) };
        this.bottomRightResizerCoords = {
            x: this.topLeftResizerCoords.x + selectionCanvas.width,
            y: this.topLeftResizerCoords.y + selectionCanvas.height,
        };
    }

    private findClosestCorner(transformValues: Vec2): Vec2 {
        const xDifference =
            Math.round((this.referenceResizerCoords.x + transformValues.x) / this.canvasGridService.squareWidth) *
                this.canvasGridService.squareWidth -
            this.referenceResizerCoords.x;
        const yDifference =
            Math.round((this.referenceResizerCoords.y + transformValues.y) / this.canvasGridService.squareWidth) *
                this.canvasGridService.squareWidth -
            this.referenceResizerCoords.y;
        const xPosition = this.topLeftResizerCoords.x + xDifference;
        const yPosition = this.topLeftResizerCoords.y + yDifference;
        return { x: xPosition, y: yPosition };
    }
}
