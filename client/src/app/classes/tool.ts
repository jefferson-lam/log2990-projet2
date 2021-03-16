import * as ToolConstants from '@app/constants/tool-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { Vec2 } from './vec2';

// Ceci est justifié vu qu'on a des fonctions qui seront gérés par les classes enfant
// tslint:disable:no-empty

export abstract class Tool {
    lineWidth?: number;
    fillMode?: ToolConstants.FillMode;
    primaryColor?: string;
    secondaryColor?: string;
    junctionRadius?: number;
    withJunction?: boolean;
    mouseDownCoord: Vec2;
    mouseDown: boolean = false;
    inUse: boolean = false;
    name: string;

    constructor(protected drawingService: DrawingService, protected undoRedoService: UndoRedoService) {}

    onKeyboardDown(event: KeyboardEvent): void {}

    onKeyboardUp(event: KeyboardEvent): void {}

    onKeyboardPress(event: KeyboardEvent): void {}

    onMouseClick(event: MouseEvent): void {}

    onMouseDoubleClick(event: MouseEvent): void {}

    onMouseDown(event: MouseEvent): void {}

    onMouseUp(event: MouseEvent): void {}

    onMouseMove(event: MouseEvent): void {}

    onMouseLeave(event: MouseEvent): void {}

    onMouseEnter(event: MouseEvent): void {}

    setLineWidth(width: number): void {}

    setFillMode(newFillMode: ToolConstants.FillMode): void {}

    setJunctionRadius(newJunctionRadius: number): void {}

    setWithJunction(hasJunction: boolean): void {}

    setPrimaryColor(primaryColor: string): void {}

    setSecondaryColor(secondaryColor: string): void {}

    getPositionFromMouse(event: MouseEvent): Vec2 {
        return { x: event.offsetX, y: event.offsetY };
    }
}
