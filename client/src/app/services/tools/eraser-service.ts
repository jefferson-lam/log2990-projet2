import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Observable, Subject } from 'rxjs';

// TODO : Constants in common file (common/constants.ts?)
export const MIN_SIZE_ERASER = 5;
export enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2,
    Back = 3,
    Forward = 4,
}

@Injectable({
    providedIn: 'root',
})
export class EraserService extends Tool {
    private pathData: Vec2[];
    size: number;

    // Observables
    private eraserSizeChangedSource: Subject<number> = new Subject<number>();
    eraserSizeChanged$: Observable<number> = this.eraserSizeChangedSource.asObservable();
    private eraserPositionSource: Subject<MouseEvent> = new Subject<MouseEvent>();
    eraserPosition$: Observable<MouseEvent> = this.eraserPositionSource.asObservable();

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.clearPath();
        this.size = MIN_SIZE_ERASER;
    }

    setSize(value: number): void {
        if (value >= MIN_SIZE_ERASER) {
            this.size = value;
        } else {
            this.size = MIN_SIZE_ERASER;
        }
        this.eraserSizeChangedSource.next(this.size);
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.clearPath();

            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.eraseSquare(this.drawingService.baseCtx, this.pathData);
        }
        this.mouseDown = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        this.eraserPositionSource.next(event);
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.eraseSquare(this.drawingService.baseCtx, this.pathData);
        }
    }

    private eraseSquare(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        for (const point of path) {
            ctx.clearRect(point.x - this.size / 2, point.y - this.size / 2, this.size, this.size);
        }
    }

    private clearPath(): void {
        this.pathData = [];
    }
}
