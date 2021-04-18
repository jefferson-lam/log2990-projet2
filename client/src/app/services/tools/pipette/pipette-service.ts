import { Injectable } from '@angular/core';
import { Rgba } from '@app/classes/rgba';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import * as MouseConstants from '@app/constants/mouse-constants';
import * as PipetteConstants from '@app/constants/pipette-constants';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class PipetteService extends Tool {
    mousePosition: Vec2;
    ctx: CanvasRenderingContext2D;
    toolManager: ToolManagerService;

    inBound: boolean;
    inBoundSource: Subject<boolean>;
    inBoundObservable: Observable<boolean>;

    previewData: ImageData;
    previewDataSource: Subject<ImageData>;
    previewDataObservable: Observable<ImageData>;

    constructor(drawingService: DrawingService, undoRedoService: UndoRedoService, public colorService: ColorService) {
        super(drawingService, undoRedoService);
        this.inBound = false;
        this.inBoundSource = new BehaviorSubject<boolean>(this.inBound);
        this.inBoundObservable = this.inBoundSource.asObservable();
        this.previewData = new ImageData(PipetteConstants.RAWDATA_SIZE, PipetteConstants.RAWDATA_SIZE);
        this.previewDataSource = new BehaviorSubject<ImageData>(this.previewData);
        this.previewDataObservable = this.previewDataSource.asObservable();
    }

    onMouseMove(event: MouseEvent): void {
        if (!this.inBound) {
            this.setInBound(true);
        }

        this.ctx = this.drawingService.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.mousePosition = this.getPositionFromMouse(event);
        const pixelData = new Uint32Array(this.ctx.getImageData(this.mousePosition.x, this.mousePosition.y, 1, 1).data.buffer)[0];

        if (pixelData !== 0) this.setInBound(true);
        else this.setInBound(false);

        this.mousePosition = this.getPositionFromMouse(event);
        this.setPreviewData();
    }

    onMouseDown(event: MouseEvent): void {
        this.ctx = this.drawingService.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.mousePosition = this.getPositionFromMouse(event);
        const pixelData = this.ctx.getImageData(this.mousePosition.x, this.mousePosition.y, 1, 1);

        if (event.button === MouseConstants.MouseButton.Left && this.inBound) {
            this.setPrimaryColorAsRgba(this.pixelDataToRgba(pixelData));
        }
        if (event.button === MouseConstants.MouseButton.Right && this.inBound) {
            this.setSecondaryColorAsRgba(this.pixelDataToRgba(pixelData));
        }
    }

    onMouseLeave(): void {
        this.setInBound(false);
    }

    onMouseEnter(): void {
        this.setInBound(true);
    }

    pixelDataToRgba(data: ImageData): Rgba {
        const redPixel = data.data[PipetteConstants.RED_POSTITION];
        const greenPixel = data.data[PipetteConstants.GREEN_POSTITION];
        const bluePixel = data.data[PipetteConstants.BLUE_POSTITION];
        const alphaPixel = data.data[PipetteConstants.ALPHA_POSTITION];

        const color = { red: redPixel, green: greenPixel, blue: bluePixel, alpha: alphaPixel };
        return color;
    }

    setPrimaryColorAsRgba(color: Rgba): void {
        if (color.alpha !== 0) {
            this.colorService.setPrimaryColor(color);
            this.colorService.saveColor(color);
        }
    }

    setSecondaryColorAsRgba(color: Rgba): void {
        if (color.alpha !== 0) {
            this.colorService.setSecondaryColor(color);
            this.colorService.saveColor(color);
        }
    }

    private setPreviewData(): void {
        this.previewData = this.drawingService.baseCtx.getImageData(
            this.mousePosition.x - PipetteConstants.OFFSET,
            this.mousePosition.y - PipetteConstants.OFFSET,
            PipetteConstants.RAWDATA_SIZE,
            PipetteConstants.RAWDATA_SIZE,
        );
        this.previewDataSource.next(this.previewData);
    }

    setInBound(bool: boolean): void {
        this.inBound = bool;
        this.inBoundSource.next(this.inBound);
    }

    onToolChange(): void {
        this.setInBound(false);
    }
}
