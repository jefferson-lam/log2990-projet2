import { CdkDragMove } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { ResizeStrategy } from '@app/classes/resize-strategy';
import { SelectionComponent } from '@app/components/selection/selection.component';
import { ResizeRight } from '@app/services/resizer/resize-strategy/resize-right';
import { ResizeTop } from '@app/services/resizer/resize-strategy/resize-top';

@Injectable({
    providedIn: 'root',
})
export class ResizeTopRight extends ResizeStrategy {
    resizeWidth: ResizeRight;
    resizeHeight: ResizeTop;

    constructor() {
        super();
        this.resizeWidth = new ResizeRight();
        this.resizeHeight = new ResizeTop();
    }

    resize(selectionComponent: SelectionComponent, event: CdkDragMove): void {
        this.resizeWidth.resize(selectionComponent, event);
        this.resizeHeight.resize(selectionComponent, event);
    }
}
