import { CdkDragMove } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { ResizeStrategy } from '@app/classes/resize-strategy';
import { Vec2 } from '@app/classes/vec2';
import { SelectionComponent } from '@app/components/selection/selection.component';
import { ResizeBottom } from '@app/services/tools/selection/resizer/resize-strategy/resize-bottom';
import { ResizeLeft } from '@app/services/tools/selection/resizer/resize-strategy/resize-left';

@Injectable({
    providedIn: 'root',
})
export class ResizeBottomLeft extends ResizeStrategy {
    resizeWidth: ResizeLeft;
    resizeHeight: ResizeBottom;
    oppositePoint: Vec2;

    constructor() {
        super();
        this.resizeWidth = new ResizeLeft();
        this.resizeHeight = new ResizeBottom();
    }

    resize(event: CdkDragMove, isShiftDown: boolean): void {
        if (isShiftDown) {
            this.oppositePoint = { x: this.selectionComponent.bottomRight.x, y: this.selectionComponent.initialPosition.y };
            this.resizeWidth.resizeWidth(event, this.oppositePoint);
            this.resizeHeight.resizeHeight(event, this.oppositePoint);
        } else {
            this.resizeWidth.resize(event);
            this.resizeHeight.resize(event);
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
