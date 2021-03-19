import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Tool } from '@app/classes/tool';
import * as PolygoneConstants from '@app/constants/polygone-constants';
import { SettingsManagerService } from '@app/services/manager/settings-manager';

@Component({
    selector: 'app-sidebar-polygone',
    templateUrl: './sidebar-polygone.component.html',
    styleUrls: ['./sidebar-polygone.component.scss'],
})
export class SidebarPolygoneComponent implements OnInit {
    max: number = PolygoneConstants.MAX_LINE_WIDTH;
    min: number = PolygoneConstants.MIN_LINE_WIDTH;
    minPolygone: number = PolygoneConstants.MIN_SIDES_COUNT;
    maxPolygone: number = PolygoneConstants.MAX_SIDES_COUNT;
    tickInterval: number = PolygoneConstants.TICK_INTERVAL;
    toolSize: number = PolygoneConstants.INIT_TOOL_SIZE;
    polygoneSidesCount: number = PolygoneConstants.INIT_SIDES_COUNT;
    fillMode: number | undefined;
    currentTool: Tool;

    @Output() toolSizeChanged: EventEmitter<number> = new EventEmitter();
    @Output() fillModeChanged: EventEmitter<number> = new EventEmitter();
    @Output() numberOfPolySides: EventEmitter<number> = new EventEmitter();

    constructor(public settingsManager: SettingsManagerService) {}

    ngOnInit(): void {
        this.toolSizeChanged.subscribe((newSize: number) => this.settingsManager.setLineWidth(newSize));
        this.fillModeChanged.subscribe((newFillMode: number) => this.settingsManager.setFillMode(newFillMode));
        this.numberOfPolySides.subscribe((newSidesCount: number) => this.settingsManager.setSidesCount(newSidesCount));
    }

    emitToolSize(): void {
        this.toolSizeChanged.emit(this.toolSize);
    }

    emitPolygoneSideNumber(): void {
        this.numberOfPolySides.emit(this.polygoneSidesCount);
    }

    emitFillMode(newFillMode: number): void {
        this.fillModeChanged.emit(newFillMode);
    }
}
