import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';
import * as DirectionalMovementConstants from '@app/constants/directional-movement-constants';
import { ShortcutManagerService } from '@app/services/manager/shortcut-manager.service';

@Directive({
    selector: '[appDirectionalMovement]',
})
export class DirectionalMovementDirective {
    keyPressed: Map<string, number> = new Map();
    hasMovedOnce: boolean = false;
    @Output() canvasMovement: EventEmitter<boolean> = new EventEmitter();

    constructor(private element: ElementRef, public shortcutManager: ShortcutManagerService) {}

    @HostListener('keydown.ArrowLeft', ['$event'])
    @HostListener('keydown.ArrowDown', ['$event'])
    @HostListener('keydown.ArrowRight', ['$event'])
    @HostListener('keydown.ArrowUp', ['$event'])
    async onKeyboardDown(event: KeyboardEvent): Promise<void> {
        this.shortcutManager.selectionMovementOnArrowDown(event, this);
    }

    @HostListener('keyup', ['$event'])
    onKeyboardUp(event: KeyboardEvent): void {
        this.shortcutManager.selectionMovementOnKeyboardUp(event, this);
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

    translateSelection(): void {
        if (this.keyPressed.get('ArrowLeft')) {
            this.translateLeft(DirectionalMovementConstants.NUM_PIXELS);
        }
        if (this.keyPressed.get('ArrowUp')) {
            this.translateUp(DirectionalMovementConstants.NUM_PIXELS);
        }
        if (this.keyPressed.get('ArrowRight')) {
            this.translateRight(DirectionalMovementConstants.NUM_PIXELS);
        }
        if (this.keyPressed.get('ArrowDown')) {
            this.translateDown(DirectionalMovementConstants.NUM_PIXELS);
        }
        this.canvasMovement.emit(true);
    }
}
