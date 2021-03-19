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

    resetResizers() {
        this.topLeftResizer.style.left = 0 + 'px';
        this.topLeftResizer.style.top = 0 + 'px';
        this.leftResizer.style.left = 0 + 'px';
        this.leftResizer.style.top = 0 + 'px';
        this.bottomLeftResizer.style.left = 0 + 'px';
        this.bottomLeftResizer.style.top = 0 + 'px';
        this.bottomResizer.style.left = 0 + 'px';
        this.bottomResizer.style.top = 0 + 'px';
        this.topResizer.style.left = 0 + 'px';
        this.topResizer.style.top = 0 + 'px';
        this.topRightResizer.style.left = 0 + 'px';
        this.topRightResizer.style.top = 0 + 'px';
        this.rightResizer.style.left = 0 + 'px';
        this.rightResizer.style.top = 0 + 'px';
        this.bottomRightResizer.style.left = 0 + 'px';
        this.bottomRightResizer.style.top = 0 + 'px';
    }

    setResizerPosition(canvasPosition: Vec2, canvasWidth: number, canvasHeight: number) {
        this.topLeftResizer.style.left = canvasPosition.x + 'px';
        this.topLeftResizer.style.top = canvasPosition.y + 'px';

        this.topResizer.style.left = canvasPosition.x + canvasWidth / 2 + 'px';
        this.topResizer.style.top = canvasPosition.y + 'px';

        this.topRightResizer.style.left = canvasPosition.x + canvasWidth - BUTTON_OFFSET + 'px';
        this.topRightResizer.style.top = canvasPosition.y + 'px';

        this.rightResizer.style.left = canvasPosition.x + canvasWidth - BUTTON_OFFSET + 'px';
        this.rightResizer.style.top = canvasPosition.y + canvasHeight / 2 + 'px';

        this.bottomRightResizer.style.left = canvasPosition.x + canvasWidth - BUTTON_OFFSET + 'px';
        this.bottomRightResizer.style.top = canvasPosition.y + canvasHeight - BUTTON_OFFSET + 'px';

        this.bottomResizer.style.left = canvasPosition.x + canvasWidth / 2 + 'px';
        this.bottomResizer.style.top = canvasPosition.y + canvasHeight - BUTTON_OFFSET + 'px';

        this.bottomLeftResizer.style.left = canvasPosition.x + 'px';
        this.bottomLeftResizer.style.top = canvasPosition.y + canvasHeight - BUTTON_OFFSET + 'px';

        this.leftResizer.style.left = canvasPosition.x + 'px';
        this.leftResizer.style.top = canvasPosition.y + canvasHeight / 2 + 'px';
    }

    translateLeft(numPixels: number) {}

    translateUp(numPixels: number) {}

    translateDown(numPixels: number) {}

    translateRight(numPixels: number) {}
}
