import { Component, EventEmitter, Output } from '@angular/core';
import { EraserService } from '@app/services/tools/eraser-service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    @Output() eraserSizeChanged: EventEmitter<number> = new EventEmitter();

    /* TODO : use toolManager instead to subscribe to eventEmitters like following
    constructor(private toolManager: ToolManager) {
     this.toolManager.eraserSizeChanged.subscribe( (newSize: number) => this.toolManager.setToolSize(newSize));
    }*/
    constructor(private eraserService: EraserService) {
        this.eraserSizeChanged.subscribe((newSize: number) => this.eraserService.setSize(newSize));
    }

    changeEraserSize(value: number): void {
        this.eraserSizeChanged.emit(value);
    }
}
