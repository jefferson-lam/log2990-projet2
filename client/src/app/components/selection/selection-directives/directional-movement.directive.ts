import { Directive, ElementRef, HostListener } from '@angular/core';
import { ResizerHandlerService } from '@app/services/resizer/resizer-handler.service';

const NUM_PIXELS = 3;
@Directive({
    selector: '[appDirectionalMovement]',
    providers: [ResizerHandlerService],
})
export class DirectionalMovementDirective {
    constructor(private selectionCanvas: ElementRef, public resizerHandlerService: ResizerHandlerService) {}

    @HostListener('keydown', ['$event'])
    onKeyboardDown(event: KeyboardEvent): void {
        event.preventDefault();
        if (event.key === 'ArrowLeft') {
            this.translateLeft(NUM_PIXELS);
        } else if (event.key === 'ArrowRight') {
            this.translateRight(NUM_PIXELS);
        }
        if (event.key === 'ArrowUp') {
            this.translateUp(NUM_PIXELS);
        } else if (event.key === 'ArrowDown') {
            this.translateDown(NUM_PIXELS);
        }
    }

    @HostListener('keydown.control.z', ['$event'])
    onCtrlZDown(event: KeyboardEvent): void {
        event.stopPropagation();
        console.log('Essayer');
    }

    @HostListener('keydown.escape', ['$event'])
    onEscapeDown(event: KeyboardEvent): void {
        console.log('Escape called from directive.');
    }

    translateLeft(numPixels: number): void {
        this.selectionCanvas.nativeElement.style.left = parseInt(this.selectionCanvas.nativeElement.style.left, 10) - numPixels + 'px';
        this.resizerHandlerService.translateLeft(NUM_PIXELS);
    }

    translateRight(numPixels: number): void {
        this.selectionCanvas.nativeElement.style.left = parseInt(this.selectionCanvas.nativeElement.style.left, 10) + numPixels + 'px';
        this.resizerHandlerService.translateRight(NUM_PIXELS);
    }

    translateUp(numPixels: number): void {
        this.selectionCanvas.nativeElement.style.top = parseInt(this.selectionCanvas.nativeElement.style.top, 10) - numPixels + 'px';
        this.resizerHandlerService.translateUp(NUM_PIXELS);
    }

    translateDown(numPixels: number): void {
        this.selectionCanvas.nativeElement.style.top = parseInt(this.selectionCanvas.nativeElement.style.top, 10) + numPixels + 'px';
        this.resizerHandlerService.translateDown(NUM_PIXELS);
    }
}
