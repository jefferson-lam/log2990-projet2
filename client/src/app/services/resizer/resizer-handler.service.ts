import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { BUTTON_OFFSET } from '@app/constants/selection-constants';

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

    resetResizers(): void {
        const resizers = this.getAllResizers();
        resizers.forEach((resizer) => {
            resizer.style.top = '0px';
            resizer.style.left = '0px';
            resizer.style.visibility = 'hidden';
        });
    }

    setResizerPosition(canvasPosition: Vec2, canvasWidth: number, canvasHeight: number): void {
        this.topLeftResizer.style.visibility = 'visible';
        this.topLeftResizer.style.left = canvasPosition.x + 'px';
        this.topLeftResizer.style.top = canvasPosition.y + 'px';

        this.topResizer.style.visibility = 'visible';
        this.topResizer.style.left = canvasPosition.x + canvasWidth / 2 - BUTTON_OFFSET / 2 + 'px';
        this.topResizer.style.top = canvasPosition.y + 'px';

        this.topRightResizer.style.visibility = 'visible';
        this.topRightResizer.style.left = canvasPosition.x + canvasWidth - BUTTON_OFFSET + 'px';
        this.topRightResizer.style.top = canvasPosition.y + 'px';

        this.rightResizer.style.visibility = 'visible';
        this.rightResizer.style.left = canvasPosition.x + canvasWidth - BUTTON_OFFSET + 'px';
        this.rightResizer.style.top = canvasPosition.y + canvasHeight / 2 - BUTTON_OFFSET / 2 + 'px';

        this.bottomRightResizer.style.visibility = 'visible';
        this.bottomRightResizer.style.left = canvasPosition.x + canvasWidth - BUTTON_OFFSET + 'px';
        this.bottomRightResizer.style.top = canvasPosition.y + canvasHeight - BUTTON_OFFSET + 'px';

        this.bottomResizer.style.visibility = 'visible';
        this.bottomResizer.style.left = canvasPosition.x + canvasWidth / 2 - BUTTON_OFFSET / 2 + 'px';
        this.bottomResizer.style.top = canvasPosition.y + canvasHeight - BUTTON_OFFSET + 'px';

        this.bottomLeftResizer.style.visibility = 'visible';
        this.bottomLeftResizer.style.left = canvasPosition.x + 'px';
        this.bottomLeftResizer.style.top = canvasPosition.y + canvasHeight - BUTTON_OFFSET + 'px';

        this.leftResizer.style.visibility = 'visible';
        this.leftResizer.style.left = canvasPosition.x + 'px';
        this.leftResizer.style.top = canvasPosition.y + canvasHeight / 2 - BUTTON_OFFSET / 2 + 'px';
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
}
