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
    maxWidth: number = AerosolConstants.MAX_LINE_WIDTH;
    minWidth: number = AerosolConstants.MIN_LINE_WIDTH;
    maxWidthWaterDrop: number = AerosolConstants.MAX_WATERDROP_WIDTH;
    minWidthWaterDrop: number = AerosolConstants.MIN_WATERDROP_WIDTH;
    maxEmission: number = AerosolConstants.MAX_EMISSION;
    minEmission: number = AerosolConstants.MIN_EMISSION;
    tickInterval: number = AerosolConstants.TICK_INTERVAL;
    toolSize: number = AerosolConstants.INIT_TOOL_SIZE;
    waterDropSize: number = AerosolConstants.INIT_WATERDROP_WIDTH;
    emissionCount: number = AerosolConstants.INIT_EMISSION_COUNT;
    currentTool: Tool;

    @Output() toolSizeChanged: EventEmitter<number> = new EventEmitter();
    @Output() waterDropSizeChanged: EventEmitter<number> = new EventEmitter();
    @Output() numberOfEmissions: EventEmitter<number> = new EventEmitter();

    constructor(public settingsManager: SettingsManagerService) {}

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
