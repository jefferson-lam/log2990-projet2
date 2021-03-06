import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as EraserConstants from '@app/constants/eraser-constants';
import { SettingsManagerService } from '@app/services/manager/settings-manager';

@Component({
    selector: 'app-sidebar-eraser',
    templateUrl: './sidebar-eraser.component.html',
    styleUrls: ['./sidebar-eraser.component.scss'],
})
export class SidebarEraserComponent implements OnInit {
    max: number;
    min: number;
    tickInterval: number;
    toolSize: number | undefined;

    @Output() private toolSizeChanged: EventEmitter<number>;

    constructor(public settingsManager: SettingsManagerService) {
        this.max = EraserConstants.MAX_ERASER_WIDTH;
        this.min = EraserConstants.MIN_ERASER_WIDTH;
        this.tickInterval = EraserConstants.TICK_INTERVAL;
        this.toolSizeChanged = new EventEmitter();
        this.toolSize = settingsManager.toolManager.eraserService.lineWidth;
    }

    ngOnInit(): void {
        this.toolSizeChanged.subscribe((newSize: number) => this.settingsManager.setLineWidth(newSize));
    }

    emitToolSize(): void {
        this.toolSizeChanged.emit(this.toolSize);
    }
}
