import { CdkDragMove } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { ResizeStrategy } from '@app/classes/resize-strategy';
import { Vec2 } from '@app/classes/vec2';
import { SelectionComponent } from '@app/components/selection/selection.component';
import { ResizerDown } from '@app/constants/resize-constants';
import { BUTTON_OFFSET } from '@app/constants/selection-constants';
import { ResizeBottom } from '@app/services/tools/selection/resizer/resize-strategy/resize-bottom';
import { ResizeBottomLeft } from '@app/services/tools/selection/resizer/resize-strategy/resize-bottom-left';
import { ResizeBottomRight } from '@app/services/tools/selection/resizer/resize-strategy/resize-bottom-right';
import { ResizeLeft } from '@app/services/tools/selection/resizer/resize-strategy/resize-left';
import { ResizeRight } from '@app/services/tools/selection/resizer/resize-strategy/resize-right';
import { ResizeTop } from '@app/services/tools/selection/resizer/resize-strategy/resize-top';
import { ResizeTopLeft } from '@app/services/tools/selection/resizer/resize-strategy/resize-top-left';
import { ResizeTopRight } from '@app/services/tools/selection/resizer/resize-strategy/resize-top-right';

@Injectable({
    providedIn: 'root',
})
export class ResizerHandlerService {
    leftResizer: HTMLElement;
    rightResizer: HTMLElement;
    bottomResizer: HTMLElement;
    topResizer: HTMLElement;
    topLeftResizer: HTMLElement;
    topRightResizer: HTMLElement;
    bottomLeftResizer: HTMLElement;
    bottomRightResizer: HTMLElement;

    resizeStrategy: ResizeStrategy;
    resizerStrategies: Map<ResizerDown, ResizeStrategy>;
    resizers: Map<ResizerDown, HTMLElement>;

    isShiftDown: boolean;
    inUse: boolean;

    constructor() {
        this.resizers = new Map<ResizerDown, HTMLElement>();
        this.resizerStrategies = new Map<number, ResizeStrategy>();
        this.resizerStrategies
            .set(ResizerDown.TopLeft, new ResizeTopLeft())
            .set(ResizerDown.Left, new ResizeLeft())
            .set(ResizerDown.BottomLeft, new ResizeBottomLeft())
            .set(ResizerDown.Bottom, new ResizeBottom())
            .set(ResizerDown.BottomRight, new ResizeBottomRight())
            .set(ResizerDown.Right, new ResizeRight())
            .set(ResizerDown.TopRight, new ResizeTopRight())
            .set(ResizerDown.Top, new ResizeTop());
        this.inUse = false;
    }

    assignComponent(selectionComponent: SelectionComponent): void {
        this.resizerStrategies.forEach((strategy) => {
            strategy.assignComponent(selectionComponent);
        });
    }

    resize(event: CdkDragMove): void {
        this.resizeStrategy.resize(event, this.isShiftDown);
    }

    resizeSquare(): void {
        this.resizeStrategy.resizeSquare();
    }

    restoreLastDimensions(): void {
        this.resizeStrategy.restoreLastDimensions();
    }

    resetResizers(): void {
        const resizers = this.getAllResizers();
        resizers.forEach((resizer) => {
            resizer.style.top = '0px';
            resizer.style.left = '0px';
            resizer.style.visibility = 'hidden';
        });
    }

    setResizerPositions(canvas: HTMLCanvasElement): void {
        const canvasPosition = { x: parseInt(canvas.style.left, 10), y: parseInt(canvas.style.top, 10) };

        this.resizers.forEach((resizer) => {
            resizer.style.visibility = 'visible';
            resizer.style.transform = '';
        });

        const topLeftResizer = this.resizers.get(ResizerDown.TopLeft) as HTMLElement;
        topLeftResizer.style.left = canvasPosition.x + 'px';
        topLeftResizer.style.top = canvasPosition.y + 'px';

        const leftResizer = this.resizers.get(ResizerDown.Left) as HTMLElement;
        leftResizer.style.left = canvasPosition.x + 'px';
        leftResizer.style.top = canvasPosition.y + canvas.height / 2 - BUTTON_OFFSET / 2 + 'px';

        const bottomLeftResizer = this.resizers.get(ResizerDown.BottomLeft) as HTMLElement;
        bottomLeftResizer.style.left = canvasPosition.x + 'px';
        bottomLeftResizer.style.top = canvasPosition.y + canvas.height - BUTTON_OFFSET + 'px';

        const bottomResizer = this.resizers.get(ResizerDown.Bottom) as HTMLElement;
        bottomResizer.style.left = canvasPosition.x + canvas.width / 2 - BUTTON_OFFSET / 2 + 'px';
        bottomResizer.style.top = canvasPosition.y + canvas.height - BUTTON_OFFSET + 'px';

        const bottomRightResizer = this.resizers.get(ResizerDown.BottomRight) as HTMLElement;
        bottomRightResizer.style.left = canvasPosition.x + canvas.width - BUTTON_OFFSET + 'px';
        bottomRightResizer.style.top = canvasPosition.y + canvas.height - BUTTON_OFFSET + 'px';

        const rightResizer = this.resizers.get(ResizerDown.Right) as HTMLElement;
        rightResizer.style.left = canvasPosition.x + canvas.width - BUTTON_OFFSET + 'px';
        rightResizer.style.top = canvasPosition.y + canvas.height / 2 - BUTTON_OFFSET / 2 + 'px';

        const topRightResizer = this.resizers.get(ResizerDown.TopRight) as HTMLElement;
        topRightResizer.style.left = canvasPosition.x + canvas.width - BUTTON_OFFSET + 'px';
        topRightResizer.style.top = canvasPosition.y + 'px';

        const topResizer = this.resizers.get(ResizerDown.Top) as HTMLElement;
        topResizer.style.left = canvasPosition.x + canvas.width / 2 - BUTTON_OFFSET / 2 + 'px';
        topResizer.style.top = canvasPosition.y + 'px';
    }

    getTransformValues(element: HTMLElement): Vec2 {
        const style = window.getComputedStyle(element);
        const matrix = new WebKitCSSMatrix(style.transform);
        return {
            x: matrix.m41,
            y: matrix.m42,
        };
    }

    getAllResizers(): Map<ResizerDown, HTMLElement> {
        return this.resizers;
    }

    setResizeStrategy(resizer: ResizerDown): void {
        this.resizeStrategy = this.resizerStrategies.get(resizer) as ResizeStrategy;
    }
}
