import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Tool } from '@app/classes/tool';
import * as PolygoneConstants from '@app/constants/polygone-constants';
import * as ShapeConstants from '@app/constants/shapes-constants';
import { SettingsManagerService } from '@app/services/manager/settings-manager';

@Component({
    selector: 'app-sidebar-polygone',
    templateUrl: './sidebar-polygone.component.html',
    styleUrls: ['./sidebar-polygone.component.scss'],
})
export class SidebarPolygoneComponent implements OnInit {
    max: number;
    min: number;
    minPolygone: number;
    maxPolygone: number;
    tickInterval: number;
    toolSize: number;
    polygoneSidesCount: number;
    fillMode: number | undefined;
    currentTool: Tool;

    @Output() toolSizeChanged: EventEmitter<number>;
    @Output() fillModeChanged: EventEmitter<number>;
    @Output() numberOfPolySides: EventEmitter<number>;

    constructor(public settingsManager: SettingsManagerService) {
        this.max = ShapeConstants.MAX_BORDER_WIDTH;
        this.min = ShapeConstants.MIN_BORDER_WIDTH;
        this.minPolygone = PolygoneConstants.MIN_SIDES_COUNT;
        this.maxPolygone = PolygoneConstants.MAX_SIDES_COUNT;
        this.tickInterval = ShapeConstants.TICK_INTERVAL;
        this.toolSizeChanged = new EventEmitter();
        this.fillModeChanged = new EventEmitter();
        this.numberOfPolySides = new EventEmitter();
    }

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
