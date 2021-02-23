import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import * as ToolManagerConstants from '@app/constants/tool-manager-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EllipseService } from '@app/services/tools/ellipse-service';
import { EraserService } from '@app/services/tools/eraser-service';
import { LineService } from '@app/services/tools/line-service';
import { PencilService } from '@app/services/tools/pencil-service';
import { RectangleService } from '@app/services/tools/rectangle-service';
import { PolygoneService } from '@app/services/tools/polygone-service';
import { AerosolService } from '@app/services/tools/aerosol-service';


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
        public polygoneService: PolygoneService,
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
            .set(ToolManagerConstants.POLYGONE_KEY, this.polygoneService)
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
        this.polygoneService.setPrimaryColor(color);
    }

    // TODO ADD TESTS
    setSecondaryColorTools(color: string): void {
        this.rectangleService.setSecondaryColor(color);
        this.ellipseService.setSecondaryColor(color);
        this.pencilService.setSecondaryColor(color);
        this.lineService.setSecondaryColor(color);
        this.polygoneService.setSecondaryColor(color);
        this.aerosolService.setSecondaryColor(color);
    }
}
