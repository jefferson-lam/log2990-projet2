import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SettingsManagerService } from '@app/services/manager/settings-manager';

@Component({
    selector: 'app-sidebar-line',
    templateUrl: './sidebar-line.component.html',
    styleUrls: ['./sidebar-line.component.scss'],
})
export class SidebarLineComponent implements OnInit {
    constructor(public settingsManager: SettingsManagerService) {}
    max: number = 200;
    min: number = 1;
    tickInterval: number = 1;
    toolSize: number | undefined;
    withJunction: boolean;
    junctionRadius: number | undefined;

    currentToolName: string = 'outil selectionné';

    @Output() toolSizeChanged: EventEmitter<number> = new EventEmitter();
    @Output() withJunctionChanged: EventEmitter<boolean> = new EventEmitter();
    @Output() junctionRadiusChanged: EventEmitter<number> = new EventEmitter();

    ngOnInit(): void {
        this.toolSizeChanged.subscribe((newSize: number) => this.settingsManager.setLineWidth(newSize));
        this.withJunctionChanged.subscribe((newWithJunction: boolean) => this.settingsManager.setWithJunction(newWithJunction));
        this.junctionRadiusChanged.subscribe((newJunctionRadius: number) => this.settingsManager.setJunctionRadius(newJunctionRadius));
    }

    emitToolSize(): void {
        this.toolSizeChanged.emit(this.toolSize);
    }
    emitWithJunction(): void {
        this.withJunctionChanged.emit(this.withJunction);
    }
    emitJunctionRadius(): void {
        this.junctionRadiusChanged.emit(this.junctionRadius);
    }
}
