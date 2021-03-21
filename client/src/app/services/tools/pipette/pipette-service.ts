import { Injectable } from '@angular/core';
import { Rgba } from '@app/classes/rgba';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import * as MouseConstants from '@app/constants/mouse-constants';
import * as PipetteConstants from '@app/constants/pipette-constants';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ToolManagerService } from '../../manager/tool-manager-service';
import { UndoRedoService } from '../../undo-redo/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class PipetteService extends Tool {
    mousePosition: Vec2;
    ctx: CanvasRenderingContext2D;
    toolManager: ToolManagerService;

    inBound: boolean = false;
    inBoundSource: Subject<boolean> = new BehaviorSubject<boolean>(this.inBound);
    inBoundObservable: Observable<boolean> = this.inBoundSource.asObservable();

    previewData: ImageData = new ImageData(PipetteConstants.RAWDATA_SIZE, PipetteConstants.RAWDATA_SIZE);
    previewDataSource: Subject<ImageData> = new BehaviorSubject<ImageData>(this.previewData);
    previewDataObservable: Observable<ImageData> = this.previewDataSource.asObservable();

    constructor(drawingService: DrawingService, undoRedoService: UndoRedoService, public colorService: ColorService) {
        super(drawingService, undoRedoService);
    }

    onMouseMove(event: MouseEvent): void {
        if (this.inBound) {
            this.mousePosition = this.getPositionFromMouse(event);
            const contextData = this.drawingService.baseCtx.getImageData(
                this.mousePosition.x - 5,
                this.mousePosition.y - 5,
                PipetteConstants.RAWDATA_SIZE,
                PipetteConstants.RAWDATA_SIZE,
            );
            this.setPreviewData(contextData);
        }
    }

    onMouseDown(event: MouseEvent): void {
        this.ctx = this.drawingService.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.mousePosition = this.getPositionFromMouse(event);
        const pixelData = this.ctx.getImageData(this.mousePosition.x, this.mousePosition.y, 1, 1);

        if (event.button === MouseConstants.MouseButton.Left && this.inBound) {
            this.setPrimaryColor(this.pixelDataToRgba(pixelData));
        }
        if (event.button === MouseConstants.MouseButton.Right && this.inBound) {
            this.setSecondaryColor(this.pixelDataToRgba(pixelData));
        }
    }

    onMouseLeave(): void {
        this.setInBound(false);
    }

    onMouseEnter(): void {
        this.setInBound(true);
    }

    pixelDataToRgba(data: ImageData): Rgba {
        const red = data.data[PipetteConstants.RED_POSTITION];
        const green = data.data[PipetteConstants.GREEN_POSTITION];
        const blue = data.data[PipetteConstants.BLUE_POSTITION];
        const alpha = data.data[PipetteConstants.ALPHA_POSTITION];

        const color = { red: red.toString(), green: green.toString(), blue: blue.toString(), alpha };
        return color;
    }

    setPrimaryColor(color: Rgba): void {
        if (color.alpha != 0) {
            this.colorService.setPrimaryColor(color);
        }
    }

    setSecondaryColor(color: Rgba): void {
        if (color.alpha != 0) {
            this.colorService.setSecondaryColor(color);
        }
    }

    setPreviewData(data: ImageData): void {
        this.previewData = data;
        this.previewDataSource.next(this.previewData);
    }

    setInBound(bool: boolean): void {
        this.inBound = bool;
        this.inBoundSource.next(this.inBound);
    }
}
