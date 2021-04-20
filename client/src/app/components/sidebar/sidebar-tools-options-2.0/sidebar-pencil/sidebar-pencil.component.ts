import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Tool } from '@app/classes/tool';
import * as PencilConstants from '@app/constants/pencil-constants';
import { SettingsManagerService } from '@app/services/manager/settings-manager';

@Component({
    selector: 'app-sidebar-pencil',
    templateUrl: './sidebar-pencil.component.html',
    styleUrls: ['./sidebar-pencil.component.scss'],
})
export class SidebarPencilComponent implements OnInit {
    max: number;
    min: number;
    tickInterval: number;
    toolSize: number | undefined;

    @Input() newTool: Tool;
    @Input() selected: number;

    @Output() toolSizeChanged: EventEmitter<number>;

    constructor(public settingsManager: SettingsManagerService) {
        this.max = PencilConstants.MAX_SIZE_PENCIL;
        this.min = PencilConstants.MIN_SIZE_PENCIL;
        this.tickInterval = PencilConstants.TICK_INTERVAL;
        this.toolSizeChanged = new EventEmitter();
        this.toolSize = settingsManager.toolManager.pencilService.lineWidth;
    }

    ngOnInit(): void {
        this.toolSizeChanged.subscribe((newSize: number) => this.settingsManager.setLineWidth(newSize));
    }

    emitToolSize(): void {
        this.toolSizeChanged.emit(this.toolSize);
    }
}
