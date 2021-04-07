import { Injectable } from '@angular/core';
import { Command } from '@app/classes/command';
import { Tool } from '@app/classes/tool';
import { MouseButton } from '@app/constants/mouse-constants';
import { DEFAULT_TOLERANCE_VALUE } from '@app/constants/paint-bucket-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PaintBucketCommand } from '@app/services/tools/paint-bucket/paint-bucket-command';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

export interface ColorRgba {
    red: number;
    green: number;
    blue: number;
    alpha: number;
}
@Injectable({
    providedIn: 'root',
})
export class PaintBucketService extends Tool {
    primaryColor: string;
    primaryColorRgba: ColorRgba;
    toleranceValue: number = DEFAULT_TOLERANCE_VALUE;
    startX: number;
    startY: number;
    mouseButtonClicked: MouseButton;

    constructor(drawingService: DrawingService, undoRedoService: UndoRedoService) {
        super(drawingService, undoRedoService);
    }

    setPrimaryColor(newColor: string): void {
        this.primaryColorRgba = this.getRgba(newColor);
        this.primaryColor = newColor;
        console.log(this.primaryColor);
    }

    setToleranceValue(toleranceValue: number): void {
        this.toleranceValue = (toleranceValue * 255) / 100;
    }

    onMouseDown(event: MouseEvent) {
        this.startX = event.offsetX;
        this.startY = event.offsetY;
        this.mouseButtonClicked = event.button;
        const command: Command = new PaintBucketCommand(this.drawingService.baseCtx, this);
        this.undoRedoService.executeCommand(command);
    }

    private getRgba(color: string): ColorRgba {
        const match = color.match(/[.?\d]+/g)!;
        const rgba = {
            red: parseInt(match[0]),
            green: parseInt(match[1]),
            blue: parseInt(match[2]),
            // Convert to 255
            alpha: Math.round(parseInt(match[3]) * 255),
        };
        return rgba;
    }

    number2rgba(color: number): ColorRgba {
        const rgba = {
            red: color & 0xff,
            green: (color >> 8) & 0xff,
            blue: (color >> 16) & 0xff,
            alpha: ((color >> 24) & 0xff) / 255,
        };
        return rgba;
    }

    onToolChange() {
        this.toleranceValue = 25;
    }
}
