import { Injectable } from '@angular/core';
import { Command } from '@app/classes/command';
import { Tool } from '@app/classes/tool';
import { MouseButton } from '@app/constants/mouse-constants';
import {
    ALPHA_INDEX,
    BASE_10,
    DEFAULT_TOLERANCE_VALUE,
    MAX_RGB_VALUE,
    MIN_RGB_VALUE,
    NORMALISATION_FACTOR,
} from '@app/constants/paint-bucket-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PaintBucketCommand } from '@app/services/tools/paint-bucket/paint-bucket-command';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

// tslint:disable:no-bitwise
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
    }

    // We convert the tolerance value from x/100 to x/255
    setToleranceValue(toleranceValue: number): void {
        this.toleranceValue = Math.round((toleranceValue * MAX_RGB_VALUE) / NORMALISATION_FACTOR);
    }

    onMouseDown(event: MouseEvent): void {
        this.startX = event.offsetX;
        this.startY = event.offsetY;
        this.mouseButtonClicked = event.button;
        const command: Command = new PaintBucketCommand(this.drawingService.baseCtx, this);
        this.undoRedoService.executeCommand(command);
    }

    onToolChange(): void {
        this.toleranceValue = DEFAULT_TOLERANCE_VALUE;
    }

    // regex matches for strings that have format: rgba(r,g,b,a)
    // and extracts into an array of length 4 containing each value
    getRgba(color: string): ColorRgba {
        const match = color.match(/[.?\d]+/g);
        if (match) {
            const rgba = {
                red: parseInt(match[0], BASE_10),
                green: parseInt(match[1], BASE_10),
                blue: parseInt(match[2], BASE_10),
                // Convert from (0..1) to 255
                alpha: Math.round(parseFloat(match[ALPHA_INDEX]) * MAX_RGB_VALUE),
            };
            return rgba;
        }
        return {
            red: MIN_RGB_VALUE,
            green: MIN_RGB_VALUE,
            blue: MIN_RGB_VALUE,
            alpha: MIN_RGB_VALUE,
        };
    }
}
