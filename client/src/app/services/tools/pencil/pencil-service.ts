import { Injectable } from '@angular/core';
import { Command } from '@app/classes/command';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import * as MouseConstants from '@app/constants/mouse-constants';
import * as PencilConstants from '@app/constants/pencil-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PencilCommand } from '@app/services/tools/pencil/pencil-command';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class PencilService extends Tool {
    pathData: Vec2[];
    lineWidth: number;
    primaryColor: string = 'black';

    // Observables
    private pencilSizeChangedSource: Subject<number> = new Subject<number>();
    pencilSizeChanged$: Observable<number> = this.pencilSizeChangedSource.asObservable();

    constructor(drawingService: DrawingService, undoRedoService: UndoRedoService) {
        super(drawingService, undoRedoService);
        this.clearPath();
        this.lineWidth = PencilConstants.MIN_SIZE_PENCIL;
    }

    setPrimaryColor(color: string): void {
        this.primaryColor = color;
    }

    setLineWidth(width: number): void {
        if (width >= PencilConstants.MIN_SIZE_PENCIL && width <= PencilConstants.MAX_SIZE_PENCIL) {
            this.lineWidth = width;
        } else if (width >= PencilConstants.MAX_SIZE_PENCIL) {
            this.lineWidth = PencilConstants.MAX_SIZE_PENCIL;
        } else {
            this.lineWidth = PencilConstants.MIN_SIZE_PENCIL;
        }
        this.pencilSizeChangedSource.next(this.lineWidth);
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseConstants.MouseButton.Left;
        if (this.mouseDown) {
            this.clearPath();

            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            const command: Command = new PencilCommand(this.drawingService.baseCtx, this);
            this.undoRedoService.executeCommand(command);
            // this.drawLine(this.drawingService.baseCtx, this.pathData);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        }
        this.mouseDown = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);

            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.previewCtx, this.pathData);
        }
    }

    onMouseLeave(event: MouseEvent): void {
        if (this.mouseDown) {
            this.drawLine(this.drawingService.baseCtx, this.pathData);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        }
        this.clearPath();
    }

    onMouseEnter(event: MouseEvent): void {
        if (event.buttons === MouseConstants.MouseButton.Left) {
            this.mouseDown = false;
        }
    }

    drawLine(ctx: CanvasRenderingContext2D, path: Vec2[], lineWidth?: number, primaryColor?: string): void {
        if (!lineWidth) lineWidth = this.lineWidth;
        if (!primaryColor) primaryColor = this.primaryColor;

        ctx.beginPath();

        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        for (const point of path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.strokeStyle = primaryColor;
        ctx.stroke();
    }

    private clearPath(): void {
        this.pathData = [];
    }
}
