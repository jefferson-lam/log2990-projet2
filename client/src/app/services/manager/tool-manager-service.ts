import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import * as ToolManagerConstants from '@app/constants/tool-manager-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { AerosolService } from '@app/services/tools/aerosol/aerosol-service';
import { EllipseService } from '@app/services/tools/ellipse/ellipse-service';
import { EraserService } from '@app/services/tools/eraser/eraser-service';
import { LineService } from '@app/services/tools/line/line-service';
import { PaintBucketService } from '@app/services/tools/paint-bucket/paint-bucket-service';
import { PencilService } from '@app/services/tools/pencil/pencil-service';
import { PipetteService } from '@app/services/tools/pipette/pipette-service';
import { PolygoneService } from '@app/services/tools/polygone/polygone-service';
import { RectangleService } from '@app/services/tools/rectangle/rectangle-service';
import { EllipseSelectionService } from '@app/services/tools/selection/ellipse/ellipse-selection-service';
import { LassoSelectionService } from '@app/services/tools/selection/lasso/lasso-selection';
import { RectangleSelectionService } from '@app/services/tools/selection/rectangle/rectangle-selection-service';
import { StampService } from '@app/services/tools/stamp/stamp-service';
import { TextService } from '@app/services/tools/text/text-service';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ToolManagerService {
    private keyBindings: Map<string, Tool>;
    currentTool: Tool;
    currentToolSubject: Subject<Tool>;

    constructor(
        public pencilService: PencilService,
        public eraserService: EraserService,
        public lineService: LineService,
        public rectangleService: RectangleService,
        public ellipseService: EllipseService,
        public drawingService: DrawingService,
        public rectangleSelectionService: RectangleSelectionService,
        public ellipseSelectionService: EllipseSelectionService,
        public polygoneService: PolygoneService,
        public aerosolService: AerosolService,
        public pipetteService: PipetteService,
        public lassoSelectionService: LassoSelectionService,
        public paintBucketService: PaintBucketService,
        public stampService: StampService,
        public textService: TextService,
    ) {
        this.bindKeys();
        this.currentTool = this.pencilService;
        this.currentToolSubject = new BehaviorSubject<Tool>(this.currentTool);
    }

    selectTool(keyShortcut: string): Tool {
        if (this.keyBindings.has(keyShortcut)) {
            this.currentTool = this.onToolChange(this.keyBindings.get(keyShortcut) as Tool);
            this.currentToolSubject.next(this.currentTool);
        }
        return this.currentTool;
    }

    setPrimaryColorTools(color: string): void {
        this.rectangleService.setPrimaryColor(color);
        this.ellipseService.setPrimaryColor(color);
        this.polygoneService.setPrimaryColor(color);
        this.pencilService.setPrimaryColor(color);
        this.lineService.setPrimaryColor(color);
        this.aerosolService.setPrimaryColor(color);
        this.paintBucketService.setPrimaryColor(color);
        this.textService.setPrimaryColor(color);
    }

    setSecondaryColorTools(color: string): void {
        this.rectangleService.setSecondaryColor(color);
        this.ellipseService.setSecondaryColor(color);
        this.polygoneService.setSecondaryColor(color);
    }

    private onToolChange(newTool: Tool): Tool {
        if (this.currentTool !== newTool) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.currentTool.onToolChange();
            newTool.onToolEnter();
        }
        return newTool;
    }

    private bindKeys(): void {
        this.keyBindings = new Map<string, Tool>();
        this.keyBindings
            .set(ToolManagerConstants.PENCIL_KEY, this.pencilService)
            .set(ToolManagerConstants.ERASER_KEY, this.eraserService)
            .set(ToolManagerConstants.LINE_KEY, this.lineService)
            .set(ToolManagerConstants.RECTANGLE_KEY, this.rectangleService)
            .set(ToolManagerConstants.ELLIPSE_KEY, this.ellipseService)
            .set(ToolManagerConstants.RECTANGLE_SELECTION_KEY, this.rectangleSelectionService)
            .set(ToolManagerConstants.ELLIPSE_SELECTION_KEY, this.ellipseSelectionService)
            .set(ToolManagerConstants.POLYGONE_KEY, this.polygoneService)
            .set(ToolManagerConstants.AEROSOL_KEY, this.aerosolService)
            .set(ToolManagerConstants.PIPETTE_KEY, this.pipetteService)
            .set(ToolManagerConstants.LASSO_SELECTION_KEY, this.lassoSelectionService)
            .set(ToolManagerConstants.PAINT_BUCKET_KEY, this.paintBucketService)
            .set(ToolManagerConstants.STAMP_KEY, this.stampService)
            .set(ToolManagerConstants.TEXT_KEY, this.textService);
    }

    scrolled(top: number, left: number): void {
        this.keyBindings.forEach((tool) => {
            tool.onScroll(top, left);
        });
    }
}
