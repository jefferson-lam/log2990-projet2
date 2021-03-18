import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { SettingsManagerService } from '@app/services/manager/settings-manager';

@Component({
    selector: 'app-sidebar-eraser',
    templateUrl: './sidebar-eraser.component.html',
    styleUrls: ['./sidebar-eraser.component.scss'],
})
export class SidebarEraserComponent implements OnInit {
    constructor(public settingsManager: SettingsManagerService) {}
    max: number = 200;
    min: number = 5;
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
