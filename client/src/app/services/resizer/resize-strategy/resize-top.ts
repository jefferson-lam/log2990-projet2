import { CdkDragMove } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { ResizeStrategy } from '@app/classes/resize-strategy';
import { SelectionComponent } from '@app/components/selection/selection.component';

@Injectable({
    providedIn: 'root',
})
export class ResizeTop extends ResizeStrategy {
    resize(selectionComponent: SelectionComponent, event: CdkDragMove): void {
        const bottomReference = selectionComponent.initialPosition.y + selectionComponent.initialSize.height;
        // Mirrored to bottom
        if (event.pointerPosition.y > bottomReference) {
            selectionComponent.previewSelectionCanvas.style.top = bottomReference + 'px';
            selectionComponent.previewSelectionCanvas.height = event.pointerPosition.y - bottomReference;
        } else {
            // Resizing top
            selectionComponent.previewSelectionCanvas.style.top = event.pointerPosition.y + 'px';
            selectionComponent.previewSelectionCanvas.height = bottomReference - event.pointerPosition.y;
        }
    }
}
