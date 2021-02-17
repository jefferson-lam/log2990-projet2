import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import * as ToolManagerConstants from '@app/constants/tool-manager-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EllipseService } from '@app/services/tools/ellipse-service';
import { EraserService } from '@app/services/tools/eraser-service';
import { LineService } from '@app/services/tools/line-service';
import { PencilService } from '@app/services/tools/pencil-service';
import { RectangleService } from '@app/services/tools/rectangle-service';
//import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ToolManagerService {
    keyBindings: Map<string, Tool> = new Map();
    currentTool: Tool;
    constructor(
        public pencilService: PencilService,
        public eraserService: EraserService,
        public lineService: LineService,
        public rectangleService: RectangleService,
        public ellipseService: EllipseService,
        public drawingService: DrawingService,
    ) {
        this.bindKeys();
        this.currentTool = this.pencilService;
    }

    private bindKeys(): void {
        this.keyBindings
            .set(ToolManagerConstants.PENCIL_KEY, this.pencilService)
            .set(ToolManagerConstants.ERASER_KEY, this.eraserService)
            .set(ToolManagerConstants.LINE_KEY, this.lineService)
            .set(ToolManagerConstants.RECTANGLE_KEY, this.rectangleService)
            .set(ToolManagerConstants.ELLIPSE_KEY, this.ellipseService);
    }

    selectTool(event: KeyboardEvent): Tool {
        return this.getTool(event.key);
    }

    getTool(keyShortcut: string): Tool {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.currentTool.onMouseUp({} as MouseEvent);
        if (this.keyBindings.has(keyShortcut)) {
            return this.keyBindings.get(keyShortcut) as Tool;
        } else {
            return this.pencilService;
        }
    }
}
