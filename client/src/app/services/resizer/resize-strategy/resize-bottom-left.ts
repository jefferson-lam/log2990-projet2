import { CdkDragMove } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { ResizeStrategy } from '@app/classes/resize-strategy';
import { SelectionComponent } from '@app/components/selection/selection.component';
import { ResizeBottom } from '@app/services/resizer/resize-strategy/resize-bottom';
import { ResizeLeft } from '@app/services/resizer/resize-strategy/resize-left';

@Injectable({
    providedIn: 'root',
})
export class ResizeBottomLeft extends ResizeStrategy {
    resizeWidth: ResizeLeft;
    resizeHeight: ResizeBottom;

    constructor() {
        super();
        this.resizeWidth = new ResizeLeft();
        this.resizeHeight = new ResizeBottom();
    }

    resize(selectionComponent: SelectionComponent, event: CdkDragMove): void {
        this.resizeWidth.resize(selectionComponent, event);
        this.resizeHeight.resize(selectionComponent, event);
    }
}
