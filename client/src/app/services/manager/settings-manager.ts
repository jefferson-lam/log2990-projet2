import { Injectable } from '@angular/core';
import { Rgba } from '@app/classes/rgba';
import { EditorComponent } from '@app/components/editor/editor.component';
import * as ToolConstants from '@app/constants/tool-constants';
import { ColorService } from '@app/services/color/color.service';
import { ToolManagerService } from './tool-manager-service';

@Injectable({
    providedIn: 'root',
})
export class SettingsManagerService {
    editorComponent: EditorComponent;

    constructor(public toolManagerService: ToolManagerService, colorService: ColorService) {
        colorService.primaryObservable.subscribe((color: Rgba) => {
            this.setPrimaryColorTools(colorService.convertRgbaToString(color));
        });
        colorService.secondaryObservable.subscribe((color: Rgba) => {
            this.setSecondaryColorTools(colorService.convertRgbaToString(color));
        });
    }

    setLineWidth(newWidth: number): void {
        this.editorComponent.currentTool.setLineWidth(newWidth);
    }

    setFillMode(newFillMode: ToolConstants.FillMode): void {
        this.editorComponent.currentTool.setFillMode(newFillMode);
    }

    setJunctionRadius(newJunctionRadius: number): void {
        this.editorComponent.currentTool.setJunctionRadius(newJunctionRadius);
    }

    setWithJunction(withJunction: boolean): void {
        this.editorComponent.currentTool.setWithJunction(withJunction);
    }

    setSidesCount(newSidesCount: number): void {
        this.editorComponent.currentTool.setSidesCount(newSidesCount);
    }

    setWaterDropWidth(newSize: number): void {
        this.editorComponent.currentTool.setWaterDropWidth(newSize);
    }

    setEmissionCount(newEmissionCount: number): void {
        this.editorComponent.currentTool.setEmissionCount(newEmissionCount);
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
        this.toolManagerService.setPrimaryColorTools(color);
    }

    setSecondaryColorTools(color: string): void {
        this.toolManagerService.setSecondaryColorTools(color);
    }
}
