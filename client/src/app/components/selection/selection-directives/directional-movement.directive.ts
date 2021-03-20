import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';
import { ResizerHandlerService } from '@app/services/resizer/resizer-handler.service';

const NUM_PIXELS = 3;
@Directive({
    selector: '[appDirectionalMovement]',
    providers: [ResizerHandlerService],
})
export class DirectionalMovementDirective {
    keyPressed: Map<string, number> = new Map();
    leftMovement: number;
    @Output() onCanvasMovement = new EventEmitter();

    constructor(private element: ElementRef) {}

    @HostListener('keydown', ['$event'])
    onKeyboardDown(event: KeyboardEvent): void {
        event.preventDefault();
        if (!this.keyPressed.get(event.key)) {
            // First press
            this.keyPressed.set(event.key, event.timeStamp);
        }
        if (this.keyPressed.get('ArrowLeft')) {
            this.translateLeft(NUM_PIXELS);
        }
        if (this.keyPressed.get('ArrowUp')) {
            this.translateUp(NUM_PIXELS);
        }
        if (this.keyPressed.get('ArrowRight')) {
            this.translateRight(NUM_PIXELS);
        }
        if (this.keyPressed.get('ArrowDown')) {
            this.translateDown(NUM_PIXELS);
        }
        this.onCanvasMovement.emit(true);
    }

    @HostListener('keyup', ['$event'])
    onKeyboardUp(event: KeyboardEvent): void {
        this.keyPressed.set(event.key, 0);
    }

    translateLeft(numPixels: number): void {
        this.element.nativeElement.style.left = parseInt(this.element.nativeElement.style.left, 10) - numPixels + 'px';
    }

    translateRight(numPixels: number): void {
        this.element.nativeElement.style.left = parseInt(this.element.nativeElement.style.left, 10) + numPixels + 'px';
    }

    translateUp(numPixels: number): void {
        this.element.nativeElement.style.top = parseInt(this.element.nativeElement.style.top, 10) - numPixels + 'px';
    }

    translateDown(numPixels: number): void {
        this.element.nativeElement.style.top = parseInt(this.element.nativeElement.style.top, 10) + numPixels + 'px';
    }
}
