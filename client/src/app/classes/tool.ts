import * as CanvasConstants from '@app/constants/canvas-constants';
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
    mouseDown: boolean;
    inUse: boolean;
    name: string;
    scroll: Vec2;

    constructor(protected drawingService: DrawingService, protected undoRedoService: UndoRedoService) {
        this.inUse = false;
        this.mouseDown = false;
        this.scroll = { x: 0, y: 0 };
    }

    onKeyboardDown(event: KeyboardEvent): void {}

    onKeyboardUp(event: KeyboardEvent): void {}

    onEscapeKeyDown(): void {}

    onMouseClick(): void {}

    onMouseDoubleClick(event: MouseEvent): void {}

    onMouseDown(event: MouseEvent): void {}

    onMouseUp(event: MouseEvent): void {}

    onMouseMove(event: MouseEvent): void {}

    onMouseLeave(event: MouseEvent): void {}

    onMouseEnter(event: MouseEvent): void {}

    onMouseWheel(event: WheelEvent): void {}

    onToolEnter(): void {}

    onToolChange(): void {}

    setLineWidth(width: number): void {}

    setFillMode(newFillMode: ToolConstants.FillMode): void {}

    setJunctionRadius(newJunctionRadius: number): void {}

    setWithJunction(hasJunction: boolean): void {}

    setPrimaryColor(primaryColor: string): void {}

    setSecondaryColor(secondaryColor: string): void {}

    setSidesCount(newSidesCount: number): void {}

    setWaterDropWidth(newSize: number): void {}

    setEmissionCount(newEmissionCount: number): void {}

    setToleranceValue(newToleranceValue: number): void {}

    setFontFamily(fontFamily: string): void {}

    setFontSize(fontSize: number): void {}

    setTextAlign(textAlign: string): void {}

    setTextBold(fontWeight: string): void {}

    setTextItalic(fontStyle: string): void {}

    setImageSource(newImageSource: string): void {}

    setImageZoomFactor(newFactor: number): void {}

    setAngleRotation(newAngle: number): void {}

    onScroll(left: number, top: number): void {
        this.scroll = { x: left, y: top };
    }

    getPositionFromMouse(event: MouseEvent): Vec2 {
        return { x: event.x - CanvasConstants.LEFT_MARGIN + this.scroll.x, y: event.y + this.scroll.y };
    }

    drawCursor(mousePosition: Vec2): void {}
}
