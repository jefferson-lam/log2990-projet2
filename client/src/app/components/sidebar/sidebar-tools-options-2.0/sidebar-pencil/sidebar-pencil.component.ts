import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { SettingsManagerService } from '@app/services/manager/settings-manager';

@Component({
    selector: 'app-sidebar-pencil',
    templateUrl: './sidebar-pencil.component.html',
    styleUrls: ['./sidebar-pencil.component.scss'],
})
export class SidebarPencilComponent implements OnInit {
    constructor(public settingsManager: SettingsManagerService) {}
    max: number = 200;
    min: number = 1;
    tickInterval: number = 1;
    toolSize: number | undefined;
    currentTool: Tool;

    @Input() newTool: Tool;
    @Input() selected: number;

    @Output() toolSizeChanged: EventEmitter<number> = new EventEmitter();

    ngOnInit(): void {
        this.toolSizeChanged.subscribe((newSize: number) => this.settingsManager.setLineWidth(newSize));
    }

    emitToolSize(): void {
        this.toolSizeChanged.emit(this.toolSize);
    }
}
