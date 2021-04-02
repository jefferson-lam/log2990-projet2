import { CdkDragMove } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { ResizeStrategy } from '@app/classes/resize-strategy';
import { SelectionComponent } from '@app/components/selection/selection.component';
import * as CanvasConstants from '@app/constants/canvas-constants';

@Injectable({
    providedIn: 'root',
})
export class ResizeRight extends ResizeStrategy {
    resize(selectionComponent: SelectionComponent, event: CdkDragMove): void {
        const pointerPosition = event.pointerPosition.x - CanvasConstants.LEFT_MARGIN;
        // Right side resizing
        if (pointerPosition > selectionComponent.initialPosition.x) {
            selectionComponent.previewSelectionCanvas.width = pointerPosition - selectionComponent.initialPosition.x;
            selectionComponent.previewSelectionCanvas.style.left = selectionComponent.initialPosition.x + 'px';
        } else {
            // Mirrored to left
            selectionComponent.previewSelectionCanvas.width = selectionComponent.initialPosition.x - pointerPosition;
            selectionComponent.previewSelectionCanvas.style.left = pointerPosition + 'px';
        }
    }
}
