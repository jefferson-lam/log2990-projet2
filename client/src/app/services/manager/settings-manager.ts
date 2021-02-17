import { Injectable } from '@angular/core';
import { EditorComponent } from '@app/components/editor/editor.component';
import * as ToolConstants from '@app/constants/tool-constants';

@Injectable({
    providedIn: 'root',
})
export class SettingsManagerService {
    editorComponent: EditorComponent;

    setLineWidth(newWidth: number): void {
        this.editorComponent.currentTool.setLineWidth(newWidth);
        console.log(this.editorComponent.currentTool);
    }

    setFillMode(newFillMode: ToolConstants.FillMode): void {
        this.editorComponent.currentTool.setFillMode(newFillMode);
        console.log(this.editorComponent.currentTool);
    }

    setJunctionRadius(newJunctionRadius: number): void {
        this.editorComponent.currentTool.setJunctionRadius(newJunctionRadius);
        console.log(this.editorComponent.currentTool);
    }

    setWithJunction(withJunction: boolean): void {
        this.editorComponent.currentTool.setWithJunction(withJunction);
        console.log(this.editorComponent.currentTool);
    }

    getToolSize() {
        return this.editorComponent.currentTool.lineWidth;
    }

    getFillMode() {
        return this.editorComponent.currentTool.fillMode?.valueOf();
    }

    getJunctionRadius() {
        return this.editorComponent.currentTool.junctionRadius;
    }

    getWithJunction() {
        return this.editorComponent.currentTool.withJunction;
    }
    // TODO: Put these lines in the component containing the event emitter
    // @Output() eraserSizeChanged: EventEmitter<number> = new EventEmitter(); // in the attributes
    //  this.eraserSizeChanged.subscribe((newSize: number) => settingsManager.setLineWidths(newSize)); // in the constructor
    // this.eraserSizeChanged.emit(this.size); // when the size has changed
}
