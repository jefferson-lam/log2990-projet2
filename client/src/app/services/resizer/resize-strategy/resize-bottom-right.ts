import { CdkDragMove } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { ResizeStrategy } from '@app/classes/resize-strategy';
import { SelectionComponent } from '@app/components/selection/selection.component';
import { ResizeBottom } from '@app/services/resizer/resize-strategy/resize-bottom';
import { ResizeRight } from '@app/services/resizer/resize-strategy/resize-right';

@Injectable({
    providedIn: 'root',
})
export class ResizeBottomRight extends ResizeStrategy {
    resizeWidth: ResizeRight;
    resizeHeight: ResizeBottom;

    constructor() {
        super();
        this.resizeWidth = new ResizeRight();
        this.resizeHeight = new ResizeBottom();
    }

    resize(selectionComponent: SelectionComponent, event: CdkDragMove): void {
        this.resizeWidth.resize(selectionComponent, event);
        this.resizeHeight.resize(selectionComponent, event);
    }
}
