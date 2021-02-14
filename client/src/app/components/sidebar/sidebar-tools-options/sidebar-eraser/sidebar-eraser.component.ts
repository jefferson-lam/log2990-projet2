import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';
import * as EraserConstants from '@app/constants/eraser-constants';
import { EraserService } from '@app/services/tools/eraser-service';

@Component({
    selector: 'app-sidebar-eraser',
    templateUrl: './sidebar-eraser.component.html',
    styleUrls: ['./sidebar-eraser.component.scss'],
})
export class SidebarEraserComponent implements AfterViewInit {
    @Output() eraserSizeChanged: EventEmitter<number> = new EventEmitter();
    size: number = EraserConstants.MIN_SIZE_ERASER;
    private inputDiv: HTMLInputElement;

    /* TODO : use toolManager instead to subscribe to eventEmitters like following
      constructor(private toolManager: ToolManager) {
       this.toolManager.eraserSizeChanged.subscribe( (newSize: number) => this.toolManager.setToolSize(newSize));
      }*/
    constructor(eraserService: EraserService) {
        this.eraserSizeChanged.subscribe((newSize: number) => eraserService.setSize(newSize));
    }

    ngAfterViewInit(): void {
        this.inputDiv = document.getElementById('eraserSize') as HTMLInputElement;
    }

    changeEraserSize(value: number): void {
        if (value >= EraserConstants.MIN_SIZE_ERASER && value <= EraserConstants.MAX_SIZE_ERASER) {
            this.size = value;
        } else if (value >= EraserConstants.MAX_SIZE_ERASER) {
            this.size = EraserConstants.MAX_SIZE_ERASER;
        } else {
            this.size = EraserConstants.MIN_SIZE_ERASER;
        }
        this.eraserSizeChanged.emit(this.size);
        this.inputDiv.value = String(this.size);
    }
}
