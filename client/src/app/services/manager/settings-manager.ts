import { Injectable } from '@angular/core';
import { EditorComponent } from '@app/components/editor/editor.component';
import * as ToolConstants from '@app/constants/tool-constants';

@Injectable({
    providedIn: 'root',
})
export class SettingsManagerService {
    lineWidth: number;
    fillMode: FillMode;
    editorComponent: EditorComponent;

    changeSizeTool(newWidth: number): void {
        this.editorComponent.currentTool.setLineWidth(newWidth);
    }

    changeFillMode(newFillMode: ToolConstants.FillMode): void {
        this.editorComponent.currentTool.setFillMode(newFillMode);
    }
    // TODO: Put these lines in the component containing the event emitter
    // @Output() eraserSizeChanged: EventEmitter<number> = new EventEmitter(); // in the attributes
    //  this.eraserSizeChanged.subscribe((newSize: number) => settingsManager.changeSizeTools(newSize)); // in the constructor
    // this.eraserSizeChanged.emit(this.size); // when the size has changed
}
