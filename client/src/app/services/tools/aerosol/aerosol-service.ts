import { Injectable } from '@angular/core';
import { Command } from '@app/classes/command';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import * as AerosolConstants from '@app/constants/aerosol-constants';
import * as MouseConstants from '@app/constants/mouse-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { AerosolCommand } from '@app/services/tools/aerosol/aerosol-command';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class AerosolService extends Tool {
    pathData: Vec2[];
    aerosolRefresh: number;
    lineWidth: number;
    waterDropWidth: number;
    emissionCount: number;
    primaryColor: string;
    private randomAngle: number;
    private randomRadius: number;
    private mousePosition: Vec2;
    private previewCommand: AerosolCommand;

    constructor(drawingService: DrawingService, undoRedoService: UndoRedoService) {
        super(drawingService, undoRedoService);
        this.clearPath();
        this.lineWidth = AerosolConstants.INIT_LINE_WIDTH;
        this.emissionCount = AerosolConstants.INIT_EMISSION_COUNT;
        this.waterDropWidth = AerosolConstants.INIT_WATERDROP_WIDTH;
        this.primaryColor = '#2F2A36';
        this.previewCommand = new AerosolCommand(drawingService.previewCtx, this);
    }

    onMouseDown(event: MouseEvent): void {
        this.inUse = event.button === MouseConstants.MouseButton.Left;
        if (!this.inUse) return;

        this.mousePosition = this.getPositionFromMouse(event);
        this.clearPath();
        this.addPointToPreview();

        this.aerosolRefresh = window.setInterval(() => {
            this.addPointToPreview();
        }, this.getEmissionRate());
    }

    onMouseUp(event: MouseEvent): void {
        if (this.inUse) {
            const command: Command = new AerosolCommand(this.drawingService.baseCtx, this);
            this.undoRedoService.executeCommand(command);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        }
        window.clearInterval(this.aerosolRefresh);
        this.inUse = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        if (!this.inUse) return;
        this.mousePosition = this.getPositionFromMouse(event);
    }

    onMouseLeave(event: MouseEvent): void {
        this.onMouseUp(event);
    }

    private addPointToPreview(): void {
        this.pathData.push(this.getRandomEmission());
        this.previewCommand.setValues(this.drawingService.previewCtx, this);
        this.previewCommand.execute();
    }

    private getRandomEmission(): Vec2 {
        const radius = this.lineWidth / 2;
        this.randomAngle = Math.random() * (2 * Math.PI);
        this.randomRadius = Math.random() * radius;

        return {
            x: this.mousePosition.x + Math.cos(this.randomAngle) * this.randomRadius,
            y: this.mousePosition.y + Math.sin(this.randomAngle) * this.randomRadius,
        };
    }

    private getEmissionRate(): number {
        return AerosolConstants.EMISSION_RATE / this.emissionCount;
    }

    clearPath(): void {
        this.pathData = [];
    }

    // This setter is here because the settings manager provides for the different implementations of setLineWidth
    setLineWidth(width: number): void {
        this.lineWidth = width;
    }

    onToolChange(): void {
        this.onMouseUp({} as MouseEvent);
    }
}
