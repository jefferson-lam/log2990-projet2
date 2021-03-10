import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import * as ToolManagerConstants from '@app/constants/tool-manager-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { AerosolService } from '@app/services/tools/aerosol/aerosol-service';
import { EllipseService } from '@app/services/tools/ellipse/ellipse-service';
import { EraserService } from '@app/services/tools/eraser/eraser-service';
import { LineService } from '@app/services/tools/line/line-service';
import { PencilService } from '@app/services/tools/pencil/pencil-service';
import { RectangleService } from '@app/services/tools/rectangle/rectangle-service';

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
        public aerosolService: AerosolService,
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
            .set(ToolManagerConstants.ELLIPSE_KEY, this.ellipseService)
            .set(ToolManagerConstants.AEROSOL_KEY, this.aerosolService);
    }

    selectTool(event: KeyboardEvent): Tool {
        return this.getTool(event.key);
    }

    getTool(keyShortcut: string): Tool {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.currentTool.onMouseUp({} as MouseEvent);
        if (this.keyBindings.has(keyShortcut)) {
            this.currentTool = this.keyBindings.get(keyShortcut) as Tool;
            return this.currentTool;
        } else {
            return this.currentTool;
        }
    }

    // TODO ADD TESTS
    setPrimaryColorTools(color: string): void {
        this.rectangleService.setPrimaryColor(color);
        this.ellipseService.setPrimaryColor(color);
        this.lineService.setPrimaryColor(color);
        this.aerosolService.setPrimaryColor(color);
        this.pencilService.setPrimaryColor(color);
    }

    // TODO ADD TESTS
    setSecondaryColorTools(color: string): void {
        this.rectangleService.setSecondaryColor(color);
        this.ellipseService.setSecondaryColor(color);
    }
}
