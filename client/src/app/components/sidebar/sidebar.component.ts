import { Component } from '@angular/core';
import { EraserService } from '@app/services/tools/eraser-service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    constructor(private eraserService: EraserService) {}
    changeEraserWidth(value: number): void {
        this.eraserService.setWidth(value);
    }
}
