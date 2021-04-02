import { CdkDragMove } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { ResizeStrategy } from '@app/classes/resize-strategy';
import { SelectionComponent } from '@app/components/selection/selection.component';
import { ResizeLeft } from '@app/services/tools/selection/resizer/resize-strategy/resize-left';
import { ResizeTop } from '@app/services/tools/selection/resizer/resize-strategy/resize-top';

@Injectable({
    providedIn: 'root',
})
export class ResizeTopLeft extends ResizeStrategy {
    resizeWidth: ResizeLeft;
    resizeHeight: ResizeTop;

    constructor() {
        super();
        this.resizeWidth = new ResizeLeft();
        this.resizeHeight = new ResizeTop();
    }

    resize(selectionComponent: SelectionComponent, event: CdkDragMove): void {
        this.resizeWidth.resize(selectionComponent, event);
        this.resizeHeight.resize(selectionComponent, event);
    }
}
