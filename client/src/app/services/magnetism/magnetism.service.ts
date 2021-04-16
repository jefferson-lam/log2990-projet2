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
    transformValues: Vec2;

    previewSelectionCanvas: HTMLCanvasElement;

    private pointOffsets: Vec2[];

    constructor(private canvasGridService: CanvasGridService) {
        this.isMagnetismOn = false;
        this.referenceResizerMode = MagnestismConstants.ResizerIndex.TOP_LEFT_INDEX;
        this.pointOffsets = new Array<Vec2>(MagnestismConstants.ResizerIndex.CENTER_INDEX + 1);
    }

    magnetizeSelection(): Vec2 {
        this.setPointOffsets(this.previewSelectionCanvas);
        this.referenceResizerCoords = this.pointOffsets[this.referenceResizerMode];
        return this.findClosestCorner(this.transformValues);
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

    private setPointOffsets(selectionCanvas: HTMLCanvasElement): void {
        this.setCornerCoords(selectionCanvas);
        this.setTopLeft();

        this.setTopMiddle();

        this.setMiddleLeft();

        this.setTopRight();

        this.setMiddleRight();

        this.setBottomLeft();

        this.setBottomMiddle();

        this.setBottomRight();

        this.setCenter();
    }

    private setTopLeft(): void {
        this.pointOffsets[MagnestismConstants.ResizerIndex.TOP_LEFT_INDEX] = this.topLeftResizerCoords;
    }

    private setTopRight(): void {
        this.pointOffsets[MagnestismConstants.ResizerIndex.TOP_RIGHT_INDEX] = { x: this.bottomRightResizerCoords.x, y: this.topLeftResizerCoords.y };
    }

    private setBottomLeft(): void {
        this.pointOffsets[MagnestismConstants.ResizerIndex.BOTTOM_LEFT_INDEX] = {
            x: this.topLeftResizerCoords.x,
            y: this.bottomRightResizerCoords.y,
        };
    }

    private setTopMiddle(): void {
        const topMiddleXPosition = (this.topLeftResizerCoords.x + this.bottomRightResizerCoords.x) / 2;
        this.pointOffsets[MagnestismConstants.ResizerIndex.TOP_MIDDLE_INDEX] = { x: topMiddleXPosition, y: this.topLeftResizerCoords.y };
    }

    private setMiddleLeft(): void {
        const middleYLeftPosition = (this.topLeftResizerCoords.y + this.bottomRightResizerCoords.y) / 2;
        this.pointOffsets[MagnestismConstants.ResizerIndex.MID_LEFT_INDEX] = { x: this.topLeftResizerCoords.x, y: middleYLeftPosition };
    }

    private setMiddleRight(): void {
        const middleRightPosition = (this.topLeftResizerCoords.y + this.bottomRightResizerCoords.y) / 2;
        this.pointOffsets[MagnestismConstants.ResizerIndex.MID_RIGHT_INDEX] = { x: this.bottomRightResizerCoords.x, y: middleRightPosition };
    }

    private setBottomMiddle(): void {
        const bottomMiddleXPosition = (this.topLeftResizerCoords.x + this.bottomRightResizerCoords.x) / 2;
        this.pointOffsets[MagnestismConstants.ResizerIndex.BOTTOM_MIDDLE_INDEX] = { x: bottomMiddleXPosition, y: this.bottomRightResizerCoords.y };
    }

    private setBottomRight(): void {
        this.pointOffsets[MagnestismConstants.ResizerIndex.BOTTOM_RIGHT_INDEX] = this.bottomRightResizerCoords;
    }

    private setCenter(): void {
        const centerXCoords = (this.topLeftResizerCoords.x + this.bottomRightResizerCoords.x) / 2;
        const centerYCoords = (this.topLeftResizerCoords.y + this.bottomRightResizerCoords.y) / 2;
        this.pointOffsets[MagnestismConstants.ResizerIndex.CENTER_INDEX] = { x: centerXCoords, y: centerYCoords };
    }
}
