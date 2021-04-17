import { Injectable } from '@angular/core';
import { Rgba } from '@app/classes/rgba';
import * as ToolConstants from '@app/constants/tool-constants';
import { ColorService } from '@app/services/color/color.service';
import { AerosolService } from '../tools/aerosol/aerosol-service';
import { PolygoneService } from '../tools/polygone/polygone-service';
import { ToolManagerService } from './tool-manager-service';

@Injectable({
    providedIn: 'root',
})
export class SettingsManagerService {
    constructor(public toolManager: ToolManagerService, colorService: ColorService) {
        colorService.primaryObservable.subscribe((color: Rgba) => {
            toolManager.setPrimaryColorTools(colorService.convertRgbaToString(color));
        });
        colorService.secondaryObservable.subscribe((color: Rgba) => {
            this.toolManager.setSecondaryColorTools(colorService.convertRgbaToString(color));
        });
    }

    setLineWidth(newWidth: number): void {
        this.toolManager.currentTool.setLineWidth(newWidth);
    }

    setFillMode(newFillMode: ToolConstants.FillMode): void {
        this.toolManager.currentTool.fillMode = newFillMode;
    }

    setJunctionRadius(newJunctionRadius: number): void {
        this.toolManager.currentTool.setJunctionRadius(newJunctionRadius);
    }

    setWithJunction(withJunction: boolean): void {
        this.toolManager.currentTool.withJunction = withJunction;
    }

    setSidesCount(newSidesCount: number): void {
        if (this.toolManager.currentTool instanceof PolygoneService) {
            this.toolManager.currentTool.initNumberSides = newSidesCount;
        }
    }

    setWaterDropWidth(newSize: number): void {
        if (this.toolManager.currentTool instanceof AerosolService) {
            this.toolManager.currentTool.waterDropWidth = newSize;
        }
    }

    setEmissionCount(newEmissionCount: number): void {
        if (this.toolManager.currentTool instanceof AerosolService) {
            this.toolManager.currentTool.emissionCount = newEmissionCount;
        }
    }

    setToleranceValue(newToleranceValue: number): void {
        this.toolManager.currentTool.setToleranceValue(newToleranceValue);
    }
}
