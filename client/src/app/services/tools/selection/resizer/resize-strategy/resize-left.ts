import { CdkDragMove } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { ResizeStrategy } from '@app/classes/resize-strategy';
import { SelectionComponent } from '@app/components/selection/selection.component';
import * as CanvasConstants from '@app/constants/canvas-constants';

@Injectable({
    providedIn: 'root',
})
export class ResizeLeft extends ResizeStrategy {
    resize(selectionComponent: SelectionComponent, event: CdkDragMove): void {
        const pointerPosition = event.pointerPosition.x - CanvasConstants.LEFT_MARGIN;
        const rightReference = selectionComponent.initialPosition.x + selectionComponent.initialSize.width;
        // Mirrored to right
        if (pointerPosition > rightReference) {
            selectionComponent.previewSelectionCanvas.width = pointerPosition - rightReference;
            selectionComponent.previewSelectionCanvas.style.left = rightReference + 'px';
        } else {
            // Left side resizing
            selectionComponent.previewSelectionCanvas.width = rightReference - pointerPosition;
            selectionComponent.previewSelectionCanvas.style.left = pointerPosition + 'px';
        }
    }
}
