import { CdkDragMove } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { ResizeStrategy } from '@app/classes/resize-strategy';
import { Vec2 } from '@app/classes/vec2';
import * as CanvasConstants from '@app/constants/canvas-constants';

@Injectable({
    providedIn: 'root',
})
export class ResizeBottom extends ResizeStrategy {
    resizePreview(event: CdkDragMove, isShiftDown?: boolean): void {
        // Resizing bottom
        if (event.pointerPosition.y > this.selectionComponent.initialPosition.y) {
            this.selectionComponent.previewSelectionCanvas.style.top = this.selectionComponent.initialPosition.y + 'px';
            this.selectionComponent.previewSelectionCanvas.height = event.pointerPosition.y - this.selectionComponent.initialPosition.y;
        } else {
            // Mirrored to top
            this.selectionComponent.previewSelectionCanvas.style.top = event.pointerPosition.y + 'px';
            this.selectionComponent.previewSelectionCanvas.height = this.selectionComponent.initialPosition.y - event.pointerPosition.y;
        }
        this.lastHeight = this.selectionComponent.previewSelectionCanvas.height;
    }

    resizeHeight(event: CdkDragMove, reference: Vec2): void {
        const width = Math.abs(event.pointerPosition.x - CanvasConstants.LEFT_MARGIN - reference.x);
        const height = Math.abs(event.pointerPosition.y - reference.y);
        this.lastHeight = height;
        const shortestSide = Math.min(width, height);
        // Resizing bottom
        if (event.pointerPosition.y > this.selectionComponent.initialPosition.y) {
            this.selectionComponent.previewSelectionCanvas.style.top = this.selectionComponent.borderCanvas.style.top = reference.y + 'px';
        } else {
            // Mirrored to top
            this.selectionComponent.previewSelectionCanvas.style.top = this.selectionComponent.borderCanvas.style.top =
                reference.y - shortestSide + 'px';
        }
        this.selectionComponent.borderCanvas.style.top = this.selectionComponent.previewSelectionCanvas.style.top;
        this.resizeSquare(false, shortestSide);
    }

    resizeSquare(combined: boolean = false, length?: number): void {
        if (length) {
            this.selectionComponent.previewSelectionCanvas.height = this.selectionComponent.borderCanvas.height = length;
        } else if (combined && this.selectionComponent.initialPosition.y > parseInt(this.selectionComponent.previewSelectionCanvas.style.top, 10)) {
            const shortestSide = Math.min(
                this.selectionComponent.previewSelectionCanvas.width,
                this.selectionComponent.previewSelectionCanvas.height,
            );
            const difference = this.selectionComponent.previewSelectionCanvas.height - shortestSide;
            this.selectionComponent.previewSelectionCanvas.style.top = this.selectionComponent.borderCanvas.style.top =
                parseInt(this.selectionComponent.previewSelectionCanvas.style.top, 10) + difference + 'px';
        }
    }

    restoreLastDimensions(): void {
        if (this.selectionComponent.initialPosition.y > parseInt(this.selectionComponent.previewSelectionCanvas.style.top, 10)) {
            const difference = this.selectionComponent.previewSelectionCanvas.height - this.lastHeight;
            this.selectionComponent.previewSelectionCanvas.style.top = this.selectionComponent.borderCanvas.style.top =
                parseInt(this.selectionComponent.previewSelectionCanvas.style.top, 10) + difference + 'px';
        }

        this.selectionComponent.previewSelectionCanvas.height = this.selectionComponent.borderCanvas.height = this.lastHeight;
    }
}
