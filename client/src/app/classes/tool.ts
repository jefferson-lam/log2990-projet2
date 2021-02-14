import { DrawingService } from '@app/services/drawing/drawing.service';
import { Vec2 } from './vec2';

// Ceci est justifié vu qu'on a des fonctions qui seront gérés par les classes enfant
// tslint:disable:no-empty

enum FillMode {
    OUTLINE = 0,
    FILL_ONLY = 1,
    OUTLINE_FILL = 2,
}

export abstract class Tool {
    lineWidth?: number;
    fillMode?: FillMode;
    mouseDownCoord: Vec2;
    mouseDown: boolean = false;

    constructor(protected drawingService: DrawingService) {}

    onKeyboardDown(event: KeyboardEvent): void {}

    onKeyboardUp(event: KeyboardEvent): void {}

    onKeyboardPress(event: KeyboardEvent): void {}

    onMouseClick(event: MouseEvent): void {}

    onMouseDoubleClick(event: MouseEvent): void {}

    onMouseDown(event: MouseEvent): void {}

    onMouseUp(event: MouseEvent): void {}

    onMouseMove(event: MouseEvent): void {}

    setSize(width: number): void {}

    onMouseLeave(event: MouseEvent): void {}

    onMouseEnter(event: MouseEvent): void {}

    setFillMode(newFillMode: FillMode): void {}

    getPositionFromMouse(event: MouseEvent): Vec2 {
        return { x: event.offsetX, y: event.offsetY };
    }
}
