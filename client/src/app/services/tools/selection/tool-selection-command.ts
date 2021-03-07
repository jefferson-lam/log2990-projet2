import { Injectable } from '@angular/core';
import { Command } from '@app/classes/command';
import { Vec2 } from '@app/classes/vec2';
import { ToolSelectionService } from './tool-selection-service';

@Injectable({
    providedIn: 'root',
})
export class ToolSelectionCommand extends Command {
    cornerCoords: Vec2[] = [];
    constructor(canvasContext: CanvasRenderingContext2D, toolSelectionService: ToolSelectionService) {
        super();
        this.setValues(canvasContext, toolSelectionService);
    }

    setValues(canvasContext: CanvasRenderingContext2D, toolSelectionService: ToolSelectionService) {
        this.ctx = canvasContext;
        this.cornerCoords = Object.assign([], toolSelectionService.cornerCoords);
    }

    execute() {}
}
