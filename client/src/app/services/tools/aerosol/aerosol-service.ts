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
    randomAngle: number;
    randomRadius: number;
    emissionRate: number;
    primaryColor: string = '#2F2A36';

    previewCommand: AerosolCommand;

    constructor(drawingService: DrawingService, undoRedoService: UndoRedoService) {
        super(drawingService, undoRedoService);
        this.clearPath();
        this.lineWidth = AerosolConstants.INIT_LINE_WIDTH;
        this.emissionCount = AerosolConstants.INIT_EMISSION_COUNT;
        this.waterDropWidth = AerosolConstants.INIT_WATERDROP_WIDTH;
        this.previewCommand = new AerosolCommand(drawingService.previewCtx, this);
    }

    onMouseDown(event: MouseEvent): void {
        this.inUse = event.button === MouseConstants.MouseButton.Left;
        if (this.inUse) {
            this.clearPath();
            this.pathData.push(this.getRandomEmission(event, this.lineWidth / 2));
            this.previewCommand.setValues(this.drawingService.previewCtx, this);
            this.previewCommand.execute();

            this.aerosolRefresh = window.setInterval(() => {
                this.pathData.push(this.getRandomEmission(event, this.lineWidth / 2));
                this.previewCommand.setValues(this.drawingService.previewCtx, this);
                this.previewCommand.execute();
            }, this.getEmissionRate());
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.inUse) {
            this.pathData.push(this.getRandomEmission(event, this.lineWidth / 2));
            const command: Command = new AerosolCommand(this.drawingService.baseCtx, this);
            this.undoRedoService.executeCommand(command);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        }
        window.clearInterval(this.aerosolRefresh);
        this.inUse = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        window.clearInterval(this.aerosolRefresh);
        if (this.inUse) {
            this.pathData.push(this.getRandomEmission(event, this.lineWidth / 2));
            this.previewCommand.setValues(this.drawingService.previewCtx, this);
            this.previewCommand.execute();
            this.aerosolRefresh = window.setInterval(() => {
                this.pathData.push(this.getRandomEmission(event, this.lineWidth / 2));
                this.previewCommand.setValues(this.drawingService.previewCtx, this);
                this.previewCommand.execute();
            }, this.getEmissionRate());
        }
    }

    onMouseLeave(event: MouseEvent): void {
        this.onMouseUp(event);
    }

    private getRandomEmission(event: MouseEvent, radius: number): Vec2 {
        this.mouseDownCoord = this.getPositionFromMouse(event);
        this.randomAngle = Math.random() * (2 * Math.PI);
        this.randomRadius = Math.random() * radius;

        return {
            x: this.mouseDownCoord.x + Math.cos(this.randomAngle) * this.randomRadius,
            y: this.mouseDownCoord.y + Math.sin(this.randomAngle) * this.randomRadius,
        };
    }

    private getEmissionRate(): number {
        this.emissionRate = AerosolConstants.EMISSION_RATE / this.emissionCount;
        return this.emissionRate;
    }

    clearPath(): void {
        this.pathData = [];
    }

    setWaterDropWidth(width: number): void {
        this.waterDropWidth = width;
    }

    setEmissionCount(newEmissionCount: number): void {
        this.emissionCount = newEmissionCount;
    }

    setLineWidth(width: number): void {
        this.lineWidth = width;
    }

    setPrimaryColor(newColor: string): void {
        this.primaryColor = newColor;
    }

    onToolChange(): void {
        this.onMouseUp({} as MouseEvent);
    }
}
