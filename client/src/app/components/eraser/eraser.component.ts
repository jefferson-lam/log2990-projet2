import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { EraserService, MIN_SIZE_ERASER } from '@app/services/tools/eraser-service';

@Component({
    selector: 'app-eraser',
    templateUrl: './eraser.component.html',
    styleUrls: ['./eraser.component.scss'],
})
export class EraserComponent implements AfterViewInit {
    @ViewChild('eraserCursor', { static: false }) cursorDiv: ElementRef<HTMLElement>;
    cursor: HTMLElement;
    size: number;

    constructor(eraserService: EraserService) {
        this.size = MIN_SIZE_ERASER;
        eraserService.eraserSizeChanged$.subscribe((newSize: number) => {
            this.setSize(newSize);
        });
        eraserService.eraserPosition$.subscribe((event: MouseEvent) => {
            this.setPosition(event);
        });
    }

    ngAfterViewInit(): void {
        this.cursor = this.cursorDiv.nativeElement;
        this.setSize(MIN_SIZE_ERASER);
        this.cursor.style.top = MIN_SIZE_ERASER / 2 + 'px';
        this.cursor.style.left = MIN_SIZE_ERASER / 2 + 'px';
    }

    setSize(newSize: number): void {
        if (newSize >= MIN_SIZE_ERASER) {
            this.size = newSize;
        } else {
            this.size = MIN_SIZE_ERASER;
        }
        this.cursor.style.height = this.size + 'px';
        this.cursor.style.width = this.size + 'px';
    }

    setPosition(event: MouseEvent): void {
        this.cursor.style.visibility = 'visible';
        this.cursor.style.top = event.offsetY - this.size / 2 + 'px';
        this.cursor.style.left = event.offsetX - this.size / 2 + 'px';
    }
}
