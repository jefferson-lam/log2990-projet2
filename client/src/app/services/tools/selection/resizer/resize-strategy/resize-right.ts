import { CdkDragMove } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { ResizeStrategy } from '@app/classes/resize-strategy';
import { Vec2 } from '@app/classes/vec2';
import * as CanvasConstants from '@app/constants/canvas-constants';

@Injectable({
    providedIn: 'root',
})
export class ResizeRight extends ResizeStrategy {
    resizePreview(event: CdkDragMove, isShiftDown?: boolean): void {
        const pointerPosition = event.pointerPosition.x - CanvasConstants.LEFT_MARGIN;
        // Right side resizing
        if (pointerPosition > this.selectionComponent.initialPosition.x) {
            this.selectionComponent.previewSelectionCanvas.width = pointerPosition - this.selectionComponent.initialPosition.x;
            this.selectionComponent.previewSelectionCanvas.style.left = this.selectionComponent.initialPosition.x + 'px';
        } else {
            // Mirrored to left
            this.selectionComponent.previewSelectionCanvas.width = this.selectionComponent.initialPosition.x - pointerPosition;
            this.selectionComponent.previewSelectionCanvas.style.left = pointerPosition + 'px';
        }
        this.lastWidth = this.selectionComponent.previewSelectionCanvas.width;
    }

    resizeWidth(event: CdkDragMove, reference: Vec2): void {
        const width = Math.abs(event.pointerPosition.x - CanvasConstants.LEFT_MARGIN - reference.x);
        const height = Math.abs(event.pointerPosition.y - reference.y);
        this.lastWidth = width;
        const shortestSide = Math.min(width, height);
        const pointerPosition = event.pointerPosition.x - CanvasConstants.LEFT_MARGIN;
        // Right side resizing
        if (pointerPosition > reference.x) {
            this.selectionComponent.previewSelectionCanvas.style.left = reference.x + 'px';
        } else {
            // Mirrored to left
            this.selectionComponent.previewSelectionCanvas.style.left = reference.x - shortestSide + 'px';
        }
        this.recalibrateBorderCanvas();
        this.resizeSquare(false, shortestSide);
    }

    resizeSquare(combined: boolean = false, length?: number): void {
        if (length) {
            this.selectionComponent.previewSelectionCanvas.width = this.selectionComponent.borderCanvas.width = length;
        } else if (combined && this.selectionComponent.initialPosition.x > parseInt(this.selectionComponent.previewSelectionCanvas.style.left, 10)) {
            const shortestSide = Math.min(
                this.selectionComponent.previewSelectionCanvas.width,
                this.selectionComponent.previewSelectionCanvas.height,
            );
            const difference = this.selectionComponent.previewSelectionCanvas.width - shortestSide;
            this.selectionComponent.previewSelectionCanvas.style.left = this.selectionComponent.borderCanvas.style.left =
                parseInt(this.selectionComponent.previewSelectionCanvas.style.left, 10) + difference + 'px';
        }
        this.recalibrateBorderCanvas();
    }

    restoreLastDimensions(): void {
        if (this.selectionComponent.initialPosition.x > parseInt(this.selectionComponent.previewSelectionCanvas.style.left, 10)) {
            const difference = this.selectionComponent.previewSelectionCanvas.width - this.lastWidth;
            this.selectionComponent.previewSelectionCanvas.style.left = this.selectionComponent.borderCanvas.style.left =
                parseInt(this.selectionComponent.previewSelectionCanvas.style.left, 10) + difference + 'px';
        }

        this.selectionComponent.previewSelectionCanvas.width = this.selectionComponent.borderCanvas.width = this.lastWidth;
    }
}
