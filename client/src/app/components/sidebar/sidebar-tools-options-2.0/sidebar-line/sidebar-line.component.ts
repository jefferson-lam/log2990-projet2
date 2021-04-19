import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as LineConstants from '@app/constants/line-constants';
import { SettingsManagerService } from '@app/services/manager/settings-manager';

@Component({
    selector: 'app-sidebar-line',
    templateUrl: './sidebar-line.component.html',
    styleUrls: ['./sidebar-line.component.scss'],
})
export class SidebarLineComponent implements OnInit {
    maxLineWidth: number;
    minLineWidth: number;
    maxJunctionRadius: number;
    minJunctionRadius: number;
    tickInterval: number;
    toolSize: number | undefined;
    withJunction: boolean;
    junctionRadius: number | undefined;

    @Output() private toolSizeChanged: EventEmitter<number>;
    @Output() private withJunctionChanged: EventEmitter<boolean>;
    @Output() junctionRadiusChanged: EventEmitter<number>;

    constructor(public settingsManager: SettingsManagerService) {
        this.minLineWidth = LineConstants.MIN_LINE_WIDTH;
        this.maxLineWidth = LineConstants.MAX_LINE_WIDTH;
        this.minJunctionRadius = LineConstants.MIN_JUNCTION_RADIUS;
        this.maxJunctionRadius = LineConstants.MAX_JUNCTION_RADIUS;
        this.tickInterval = LineConstants.TICK_INTERVAL;
        this.toolSizeChanged = new EventEmitter();
        this.withJunctionChanged = new EventEmitter();
        this.junctionRadiusChanged = new EventEmitter();
        this.toolSize = settingsManager.toolManager.lineService.lineWidth;
        this.withJunction = settingsManager.toolManager.lineService.withJunction;
        this.junctionRadius = settingsManager.toolManager.lineService.junctionRadius;
    }

    ngOnInit(): void {
        this.toolSizeChanged.subscribe((newSize: number) => this.settingsManager.setLineWidth(newSize));
        this.withJunctionChanged.subscribe((newWithJunction: boolean) => this.settingsManager.setWithJunction(newWithJunction));
        this.junctionRadiusChanged.subscribe((newJunctionRadius: number) => this.settingsManager.setJunctionRadius(newJunctionRadius));
    }

    emitToolSize(): void {
        this.toolSizeChanged.emit(this.toolSize);
    }

    emitWithJunction(): void {
        this.withJunction = !this.withJunction;
        this.withJunctionChanged.emit(this.withJunction);
    }

    emitJunctionRadius(): void {
        this.junctionRadiusChanged.emit(this.junctionRadius);
    }
}
