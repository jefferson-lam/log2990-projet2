import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import * as ToolManagerConstants from '@app/constants/tool-manager-constants';
import { EllipseService } from '@app/services/tools/ellipse-service';
import { EraserService } from '@app/services/tools/eraser-service';
import { LineService } from '@app/services/tools/line-service';
import { PencilService } from '@app/services/tools/pencil-service';
import { RectangleService } from '@app/services/tools/rectangle-service';

@Injectable({
    providedIn: 'root',
})
export class ToolManagerService {
    keyBindings: Map<string, Tool> = new Map();
    activeTool: Tool;
    constructor(
        public pencilService: PencilService,
        public eraserService: EraserService,
        public lineService: LineService,
        public rectangleService: RectangleService,
        public ellipseService: EllipseService,
    ) {
        this.bindKeys();
        this.activeTool = this.pencilService;
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
        if (this.keyBindings.has(keyShortcut)) {
            return this.keyBindings.get(keyShortcut) as Tool;
        } else {
            return this.pencilService;
        }
    }
}
