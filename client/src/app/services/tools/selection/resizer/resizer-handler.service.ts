import { CdkDragMove } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { ResizeStrategy } from '@app/classes/resize-strategy';
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

    isShiftDown: boolean;

    constructor() {
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
    }

    resetResizers(): void {
        const resizers = this.getAllResizers();
        resizers.forEach((resizer) => {
            resizer.style.top = '0px';
            resizer.style.left = '0px';
            resizer.style.visibility = 'hidden';
        });
    }

    setResizerPosition(canvas: HTMLCanvasElement): void {
        const canvasPosition = { x: parseInt(canvas.style.left, 10), y: parseInt(canvas.style.top, 10) };

        this.topLeftResizer.style.visibility = 'visible';
        this.topLeftResizer.style.left = canvasPosition.x + 'px';
        this.topLeftResizer.style.top = canvasPosition.y + 'px';

        this.topResizer.style.visibility = 'visible';
        this.topResizer.style.left = canvasPosition.x + canvas.width / 2 - BUTTON_OFFSET / 2 + 'px';
        this.topResizer.style.top = canvasPosition.y + 'px';

        this.topRightResizer.style.visibility = 'visible';
        this.topRightResizer.style.left = canvasPosition.x + canvas.width - BUTTON_OFFSET + 'px';
        this.topRightResizer.style.top = canvasPosition.y + 'px';

        this.rightResizer.style.visibility = 'visible';
        this.rightResizer.style.left = canvasPosition.x + canvas.width - BUTTON_OFFSET + 'px';
        this.rightResizer.style.top = canvasPosition.y + canvas.height / 2 - BUTTON_OFFSET / 2 + 'px';

        this.bottomRightResizer.style.visibility = 'visible';
        this.bottomRightResizer.style.left = canvasPosition.x + canvas.width - BUTTON_OFFSET + 'px';
        this.bottomRightResizer.style.top = canvasPosition.y + canvas.height - BUTTON_OFFSET + 'px';

        this.bottomResizer.style.visibility = 'visible';
        this.bottomResizer.style.left = canvasPosition.x + canvas.width / 2 - BUTTON_OFFSET / 2 + 'px';
        this.bottomResizer.style.top = canvasPosition.y + canvas.height - BUTTON_OFFSET + 'px';

        this.bottomLeftResizer.style.visibility = 'visible';
        this.bottomLeftResizer.style.left = canvasPosition.x + 'px';
        this.bottomLeftResizer.style.top = canvasPosition.y + canvas.height - BUTTON_OFFSET + 'px';

        this.leftResizer.style.visibility = 'visible';
        this.leftResizer.style.left = canvasPosition.x + 'px';
        this.leftResizer.style.top = canvasPosition.y + canvas.height / 2 - BUTTON_OFFSET / 2 + 'px';
    }

    getAllResizers(): HTMLElement[] {
        return [
            this.topLeftResizer,
            this.topResizer,
            this.topRightResizer,
            this.rightResizer,
            this.bottomRightResizer,
            this.bottomResizer,
            this.bottomLeftResizer,
            this.leftResizer,
        ];
    }

    setResizeStrategy(resizer: ResizerDown): void {
        this.resizeStrategy = this.resizerStrategies.get(resizer) as ResizeStrategy;
    }

    resize(selectionComponent: SelectionComponent, event: CdkDragMove): void {
        this.resizeStrategy.resize(selectionComponent, event);
    }
}
