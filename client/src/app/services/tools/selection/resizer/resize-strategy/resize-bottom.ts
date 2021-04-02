import { CdkDragMove } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { SelectionComponent } from '@app/components/selection/selection.component';
import { ResizeStrategy } from '../../../../../classes/resize-strategy';

@Injectable({
    providedIn: 'root',
})
export class ResizeBottom extends ResizeStrategy {
    resize(selectionComponent: SelectionComponent, event: CdkDragMove): void {
        // Resizing bottom
        if (event.pointerPosition.y > selectionComponent.initialPosition.y) {
            selectionComponent.previewSelectionCanvas.style.top = selectionComponent.initialPosition.y + 'px';
            selectionComponent.previewSelectionCanvas.height = event.pointerPosition.y - selectionComponent.initialPosition.y;
        } else {
            // Mirrored to top
            selectionComponent.previewSelectionCanvas.style.top = event.pointerPosition.y + 'px';
            selectionComponent.previewSelectionCanvas.height = selectionComponent.initialPosition.y - event.pointerPosition.y;
        }
    }
}
