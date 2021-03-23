import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

const NUM_PIXELS = 3;
const FIRST_PRESS_DELAY_MS = 500;
const CONTINUOUS_PRESS_DELAY_MS = 100;
@Directive({
    selector: '[appDirectionalMovement]',
})
export class DirectionalMovementDirective {
    keyPressed: Map<string, number> = new Map();
    leftMovement: number;
    private hasMovedOnce: boolean = false;
    @Output() canvasMovement: EventEmitter<boolean> = new EventEmitter();

    constructor(private element: ElementRef) {}

    @HostListener('keydown', ['$event'])
    async onKeyboardDown(event: KeyboardEvent): Promise<void> {
        event.preventDefault();
        if (!this.keyPressed.get(event.key)) {
            // First press
            this.keyPressed.set(event.key, event.timeStamp);
            this.translateSelection();
            await this.delay(FIRST_PRESS_DELAY_MS);
        }

        if (this.hasMovedOnce) {
            return;
        }

        this.hasMovedOnce = true;
        await this.delay(CONTINUOUS_PRESS_DELAY_MS);
        this.translateSelection();
        this.hasMovedOnce = false;
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

    async delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    private translateSelection(): void {
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
        this.canvasMovement.emit(true);
    }
}
