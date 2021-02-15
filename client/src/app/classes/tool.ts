import * as ToolConstants from '@app/constants/tool-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Vec2 } from './vec2';

// Ceci est justifié vu qu'on a des fonctions qui seront gérés par les classes enfant
// tslint:disable:no-empty

export abstract class Tool {
    lineWidth?: number;
    fillMode?: ToolConstants.FillMode;
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

    setLineWidth(width: number): void {}

    onMouseLeave(event: MouseEvent): void {}

    onMouseEnter(event: MouseEvent): void {}

    setFillMode(newFillMode: ToolConstants.FillMode): void {}

    getPositionFromMouse(event: MouseEvent): Vec2 {
        return { x: event.offsetX, y: event.offsetY };
    }
}
