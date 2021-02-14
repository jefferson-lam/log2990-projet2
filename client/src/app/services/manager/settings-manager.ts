import { Injectable } from '@angular/core';
import { EditorComponent } from '@app/components/editor/editor.component';

// TODO: Find way to get fill mode
enum FillMode {
    OUTLINE = 0,
    FILL_ONLY = 1,
    OUTLINE_FILL = 2,
}

@Injectable({
    providedIn: 'root',
})
export class SettingsManagerService {
    lineWidth: number;
    fillMode: FillMode;
    editorComponent: EditorComponent;

    changeSizeTool(newWidth: number): void {
        this.editorComponent.currentTool.setSize(newWidth);
    }

    changeFillMode(newFillMode: FillMode): void {
        this.editorComponent.currentTool.setFillMode(newFillMode);
    }
    // TODO: Put these lines in the component containing the event emitter
    // @Output() eraserSizeChanged: EventEmitter<number> = new EventEmitter(); // in the attributes
    //  this.eraserSizeChanged.subscribe((newSize: number) => settingsManager.changeSizeTools(newSize)); // in the constructor
    // this.eraserSizeChanged.emit(this.size); // when the size has changed
}
