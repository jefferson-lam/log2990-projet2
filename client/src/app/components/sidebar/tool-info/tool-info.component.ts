import { Component } from '@angular/core';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';

@Component({
    selector: 'app-tool-info',
    templateUrl: './tool-info.component.html',
    styleUrls: ['./tool-info.component.scss'],
})
export class ToolInfoComponent {
    constructor(public toolManager: ToolManagerService) {}
}
