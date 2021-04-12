import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Tool } from '@app/classes/tool';
import * as AerosolConstants from '@app/constants/aerosol-constants';
import { SettingsManagerService } from '@app/services/manager/settings-manager';

@Component({
    selector: 'app-sidebar-aerosol',
    templateUrl: './sidebar-aerosol.component.html',
    styleUrls: ['./sidebar-aerosol.component.scss'],
})
export class SidebarAerosolComponent implements OnInit {
    maxWidth: number;
    minWidth: number;
    maxWidthWaterDrop: number;
    minWidthWaterDrop: number;
    maxEmission: number;
    minEmission: number;
    tickInterval: number;
    toolSize: number;
    waterDropSize: number;
    emissionCount: number;
    currentTool: Tool;

    @Output() toolSizeChanged: EventEmitter<number>;
    @Output() waterDropSizeChanged: EventEmitter<number>;
    @Output() numberOfEmissions: EventEmitter<number>;

    constructor(public settingsManager: SettingsManagerService) {
        this.maxWidth = AerosolConstants.MAX_LINE_WIDTH;
        this.minWidth = AerosolConstants.MIN_LINE_WIDTH;
        this.maxWidthWaterDrop = AerosolConstants.MAX_WATERDROP_WIDTH;
        this.minWidthWaterDrop = AerosolConstants.MIN_WATERDROP_WIDTH;
        this.maxEmission = AerosolConstants.MAX_EMISSION;
        this.minEmission = AerosolConstants.MIN_EMISSION;
        this.tickInterval = AerosolConstants.TICK_INTERVAL;
        this.toolSize = AerosolConstants.INIT_TOOL_SIZE;
        this.waterDropSize = AerosolConstants.INIT_WATERDROP_WIDTH;
        this.emissionCount = AerosolConstants.INIT_EMISSION_COUNT;
        this.toolSizeChanged = new EventEmitter();
        this.waterDropSizeChanged = new EventEmitter();
        this.numberOfEmissions = new EventEmitter();
    }

    ngOnInit(): void {
        this.toolSizeChanged.subscribe((newSize: number) => this.settingsManager.setLineWidth(newSize));
        this.waterDropSizeChanged.subscribe((newSize: number) => this.settingsManager.setWaterDropWidth(newSize));
        this.numberOfEmissions.subscribe((newEmissionCount: number) => this.settingsManager.setEmissionCount(newEmissionCount));
    }

    emitToolSize(): void {
        this.toolSizeChanged.emit(this.toolSize);
    }

    emitWaterDropSize(): void {
        this.waterDropSizeChanged.emit(this.waterDropSize);
    }

    emitEmissionNumber(): void {
        this.numberOfEmissions.emit(this.emissionCount);
    }
}
