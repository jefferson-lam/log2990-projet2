import { Injectable } from '@angular/core';
import { EditorComponent } from '@app/components/editor/editor.component';
import * as ToolConstants from '@app/constants/tool-constants';
import { ToolManagerService } from './tool-manager-service';

@Injectable({
    providedIn: 'root',
})
export class SettingsManagerService {
    editorComponent: EditorComponent;

    constructor(public toolManagerService: ToolManagerService) {}

    setLineWidth(newWidth: number): void {
        this.editorComponent.currentTool.setLineWidth(newWidth);
    }

    setFillMode(newFillMode: ToolConstants.FillMode): void {
        this.editorComponent.currentTool.setFillMode(newFillMode);
    }

    setJunctionRadius(newJunctionRadius: number): void {
        this.editorComponent.currentTool.setJunctionRadius(newJunctionRadius);
    }

    setWithJunction(hasJunction: boolean): void {
        this.editorComponent.currentTool.setWithJunction(hasJunction);
    }

    setPrimaryColorTools(color: string): void {
        this.toolManagerService.setPrimaryColorTools(color);
    }

    setSecondaryColorTools(color: string): void {
        this.toolManagerService.setSecondaryColorTools(color);
    }
}
