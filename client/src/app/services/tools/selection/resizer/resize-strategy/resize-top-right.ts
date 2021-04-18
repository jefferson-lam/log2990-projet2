import { CdkDragMove } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { ResizeStrategy } from '@app/classes/resize-strategy';
import { Vec2 } from '@app/classes/vec2';
import { SelectionComponent } from '@app/components/selection/selection.component';
import { ResizeRight } from '@app/services/tools/selection/resizer/resize-strategy/resize-right';
import { ResizeTop } from '@app/services/tools/selection/resizer/resize-strategy/resize-top';

@Injectable({
    providedIn: 'root',
})
export class ResizeTopRight extends ResizeStrategy {
    resizeWidth: ResizeRight;
    resizeHeight: ResizeTop;
    oppositePoint: Vec2;

    constructor() {
        super();
        this.resizeWidth = new ResizeRight();
        this.resizeHeight = new ResizeTop();
    }

    resizePreview(event: CdkDragMove, isShiftDown: boolean): void {
        if (isShiftDown) {
            this.oppositePoint = { x: this.selectionComponent.initialPosition.x, y: this.selectionComponent.bottomRight.y };
            this.resizeWidth.resizeWidth(event, this.oppositePoint);
            this.resizeHeight.resizeHeight(event, this.oppositePoint);
        } else {
            this.resizeWidth.resizePreview(event);
            this.resizeHeight.resizePreview(event);
        }
    }

    resizeSquare(length?: number): void {
        this.resizeWidth.resizeSquare(true);
        this.resizeHeight.resizeSquare(true);
        super.resizeSquare();
    }

    assignComponent(component: SelectionComponent): void {
        this.selectionComponent = component;
        this.resizeHeight.assignComponent(component);
        this.resizeWidth.assignComponent(component);
    }

    restoreLastDimensions(): void {
        this.resizeWidth.restoreLastDimensions();
        this.resizeHeight.restoreLastDimensions();
    }
}
