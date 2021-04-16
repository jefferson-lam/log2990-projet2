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

    protected resizePreview(event: CdkDragMove, isShiftDown?: boolean): void {}

    resizeSquare(): void {
        const shortestSide = Math.min(this.selectionComponent.previewSelectionCanvas.width, this.selectionComponent.previewSelectionCanvas.height);
        this.selectionComponent.previewSelectionCanvas.width = shortestSide;
        this.selectionComponent.previewSelectionCanvas.height = shortestSide;

        // this.selectionComponent.borderCanvas.width = shortestSide;
        // this.selectionComponent.borderCanvas.height = shortestSide;
        this.recalibrateBorderCanvas();
    }

    restoreLastDimensions(): void {}

    resize(event: CdkDragMove, isShiftDown?: boolean): void {
        this.resizePreview(event, isShiftDown);
        this.recalibrateBorderCanvas();
    }

    protected recalibrateBorderCanvas(): void {
        this.selectionComponent.borderCanvas.height = this.selectionComponent.previewSelectionCanvas.height;
        this.selectionComponent.borderCanvas.style.top = this.selectionComponent.previewSelectionCanvas.style.top;
        this.selectionComponent.borderCanvas.width = this.selectionComponent.previewSelectionCanvas.width;
        this.selectionComponent.borderCanvas.style.left = this.selectionComponent.previewSelectionCanvas.style.left;
    }
}
