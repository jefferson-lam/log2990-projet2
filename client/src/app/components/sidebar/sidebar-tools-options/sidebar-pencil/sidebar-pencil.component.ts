import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';
import { MAX_SIZE_PENCIL, MIN_SIZE_PENCIL, PencilService } from '@app/services/tools/pencil-service';

@Component({
    selector: 'app-sidebar-pencil',
    templateUrl: './sidebar-pencil.component.html',
    styleUrls: ['./sidebar-pencil.component.scss'],
})
export class SidebarPencilComponent implements AfterViewInit {
    @Output() pencilSizeChanged: EventEmitter<number> = new EventEmitter();
    size: number = MIN_SIZE_PENCIL;
    private inputDiv: HTMLInputElement;

    /* TODO : use toolManager instead to subscribe to eventEmitters like following
    constructor(private toolManager: ToolManager) {
     this.toolManager.pencilSizeChanged.subscribe( (newSize: number) => this.toolManager.setToolSize(newSize));
    }*/
    constructor(pencilService: PencilService) {
        this.pencilSizeChanged.subscribe((newSize: number) => pencilService.setSize(newSize));
    }

    ngAfterViewInit(): void {
        this.inputDiv = document.getElementById('pencilSize') as HTMLInputElement;
    }

    changePencilSize(value: number): void {
        if (value >= MIN_SIZE_PENCIL && value <= MAX_SIZE_PENCIL) {
            this.size = value;
        } else if (value >= MAX_SIZE_PENCIL) {
            this.size = MAX_SIZE_PENCIL;
        } else {
            this.size = MIN_SIZE_PENCIL;
        }
        this.pencilSizeChanged.emit(this.size);
        this.inputDiv.value = String(this.size);
    }
}
