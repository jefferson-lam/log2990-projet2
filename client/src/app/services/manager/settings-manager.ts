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
            this.setPrimaryColorTools(colorService.convertRgbaToString(color));
        });
        colorService.secondaryObservable.subscribe((color: Rgba) => {
            this.setSecondaryColorTools(colorService.convertRgbaToString(color));
        });
    }

    setLineWidth(newWidth: number): void {
        this.toolManager.currentTool.setLineWidth(newWidth);
    }

    setFillMode(newFillMode: ToolConstants.FillMode): void {
        this.toolManager.currentTool.setFillMode(newFillMode);
    }

    setJunctionRadius(newJunctionRadius: number): void {
        this.toolManager.currentTool.setJunctionRadius(newJunctionRadius);
    }

    setWithJunction(withJunction: boolean): void {
        this.toolManager.currentTool.setWithJunction(withJunction);
    }

    setSidesCount(newSidesCount: number): void {
        this.toolManager.currentTool.setSidesCount(newSidesCount);
    }

    setWaterDropWidth(newSize: number): void {
        this.toolManager.currentTool.setWaterDropWidth(newSize);
    }

    setEmissionCount(newEmissionCount: number): void {
        this.toolManager.currentTool.setEmissionCount(newEmissionCount);
    }

    setToleranceValue(newToleranceValue: number): void {
        this.toolManager.currentTool.setToleranceValue(newToleranceValue);
    }

    setFontFamily(fontFamily: string): void {
        this.editorComponent.currentTool.setFontFamily(fontFamily);
    }

    setFontSize(fontSize: number): void {
        this.editorComponent.currentTool.setFontSize(fontSize);
    }

    setTextAlign(textAlign: string): void {
        this.editorComponent.currentTool.setTextAlign(textAlign);
    }

    setTextBold(fontWeight: string): void {
        this.editorComponent.currentTool.setTextBold(fontWeight);
    }

    setTextItalic(fontStyle: string): void {
        this.editorComponent.currentTool.setTextItalic(fontStyle);
    }

    setPrimaryColorTools(color: string): void {
        this.toolManager.setPrimaryColorTools(color);
    }

    setSecondaryColorTools(color: string): void {
        this.toolManager.setSecondaryColorTools(color);
    }
}
