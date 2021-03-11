import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[appDirectionalMovement]',
})
export class DirectionalMovementDirective {
    constructor(private selectionCanvas: ElementRef) {}

    @HostListener('keydown', ['$event'])
    onKeyboardDown(event: KeyboardEvent) {
        event.preventDefault();
        if (event.key === 'ArrowLeft') {
            this.translateLeft(3);
        } else if (event.key === 'ArrowRight') {
            this.translateRight(3);
        }
        if (event.key === 'ArrowUp') {
            this.translateUp(3);
        } else if (event.key === 'ArrowDown') {
            this.translateDown(3);
        }
    }

    translateLeft(numPixels: number): void {
        this.selectionCanvas.nativeElement.style.left = parseInt(this.selectionCanvas.nativeElement.style.left) - numPixels + 'px';
    }

    translateRight(numPixels: number): void {
        this.selectionCanvas.nativeElement.style.left = parseInt(this.selectionCanvas.nativeElement.style.left) + numPixels + 'px';
    }

    translateUp(numPixels: number): void {
        this.selectionCanvas.nativeElement.style.top = parseInt(this.selectionCanvas.nativeElement.style.top) - numPixels + 'px';
    }

    translateDown(numPixels: number): void {
        this.selectionCanvas.nativeElement.style.top = parseInt(this.selectionCanvas.nativeElement.style.top) + numPixels + 'px';
    }
}
