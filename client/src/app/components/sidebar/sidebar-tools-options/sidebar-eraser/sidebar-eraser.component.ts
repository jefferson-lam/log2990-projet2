import { Component, EventEmitter, Output } from '@angular/core';
import { EraserService } from '@app/services/tools/eraser-service';

@Component({
    selector: 'app-sidebar-eraser',
    templateUrl: './sidebar-eraser.component.html',
    styleUrls: ['./sidebar-eraser.component.scss'],
})
export class SidebarEraserComponent {
    @Output() eraserSizeChanged: EventEmitter<number> = new EventEmitter();

    /* TODO : use toolManager instead to subscribe to eventEmitters like following
      constructor(private toolManager: ToolManager) {
       this.toolManager.eraserSizeChanged.subscribe( (newSize: number) => this.toolManager.setToolSize(newSize));
      }*/
    constructor(eraserService: EraserService) {
        this.eraserSizeChanged.subscribe((newSize: number) => eraserService.setSize(newSize));
    }

    changeEraserSize(value: number): void {
        this.eraserSizeChanged.emit(value);
    }
}
