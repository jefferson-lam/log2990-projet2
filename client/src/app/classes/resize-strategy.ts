import { CdkDragMove } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { SelectionComponent } from '@app/components/selection/selection.component';

// tslint:disable:no-empty
@Injectable({
    providedIn: 'root',
})
export class ResizeStrategy {
    selectionComponent: SelectionComponent;
    lastWidth: number;
    lastHeight: number;

    assignComponent(component: SelectionComponent): void {
        this.selectionComponent = component;
    }

    resize(event: CdkDragMove, isShiftDown?: boolean): void {}

    resizeSquare(): void {
        const shortestSide = Math.min(this.selectionComponent.previewSelectionCanvas.width, this.selectionComponent.previewSelectionCanvas.height);
        this.selectionComponent.previewSelectionCanvas.width = shortestSide;
        this.selectionComponent.previewSelectionCanvas.height = shortestSide;
    }

    restoreLastDimensions(): void {}
}
