import { Injectable } from '@angular/core';
import { Rgba } from '@app/classes/rgba';
import * as ToolConstants from '@app/constants/tool-constants';
import { ColorService } from '@app/services/color/color.service';
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
            toolManager.setSecondaryColorTools(colorService.convertRgbaToString(color));
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
        this.toolManager.currentTool.numberSides = newSidesCount;
    }

    setWaterDropWidth(newSize: number): void {
        this.toolManager.currentTool.waterDropWidth = newSize;
    }

    setEmissionCount(newEmissionCount: number): void {
        this.toolManager.currentTool.emissionCount = newEmissionCount;
    }

    setToleranceValue(newToleranceValue: number): void {
        this.toolManager.currentTool.setToleranceValue(newToleranceValue);
    }

    setImageSource(newSource: string): void {
        this.toolManager.currentTool.imageSource = newSource;
    }

    setImageZoomFactor(newFactor: number): void {
        this.toolManager.currentTool.imageZoomFactor = newFactor;
    }

    setAngleRotation(newAngle: number): void {
        this.toolManager.currentTool.setAngleRotation(newAngle);
    }

    setFontFamily(fontFamily: string): void {
        this.toolManager.currentTool.setFontFamily(fontFamily);
    }

    setFontSize(fontSize: number): void {
        this.toolManager.currentTool.setFontSize(fontSize);
    }

    setTextAlign(textAlign: string): void {
        this.toolManager.currentTool.setTextAlign(textAlign);
    }

    setTextBold(fontWeight: string): void {
        this.toolManager.currentTool.setTextBold(fontWeight);
    }

    setTextItalic(fontStyle: string): void {
        this.toolManager.currentTool.setTextItalic(fontStyle);
    }
}
