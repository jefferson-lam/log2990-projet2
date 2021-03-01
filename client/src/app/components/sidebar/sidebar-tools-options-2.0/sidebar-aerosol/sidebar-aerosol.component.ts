import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { SettingsManagerService } from '@app/services/manager/settings-manager';

@Component({
    selector: 'app-sidebar-aerosol',
    templateUrl: './sidebar-aerosol.component.html',
    styleUrls: ['./sidebar-aerosol.component.scss'],
})
export class SidebarAerosolComponent implements OnInit {
    maxWidth: number = 200;
    minWidth: number = 1;
    maxWidthWaterDrop: number = 50;
    minWidthWaterDrop: number = 1;
    maxEmission: number = 100;
    minEmission: number = 1;
    tickInterval: number = 1;
    toolSize: number = 70;
    waterDropSize: number = 2;
    emissionCount: number = 50;
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

    setMax(numberInput: number): number {
        return numberInput;
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
