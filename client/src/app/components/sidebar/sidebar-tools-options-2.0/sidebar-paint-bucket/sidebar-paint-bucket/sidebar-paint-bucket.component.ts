import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as PaintBucketConstants from '@app/constants/paint-bucket-constants';
import { SettingsManagerService } from '@app/services/manager/settings-manager';

@Component({
    selector: 'app-sidebar-paint-bucket',
    templateUrl: './sidebar-paint-bucket.component.html',
    styleUrls: ['./sidebar-paint-bucket.component.scss'],
})
export class SidebarPaintBucketComponent implements OnInit {
    maxToleranceValue: number;
    minToleranceValue: number;
    toleranceValue: number;
    tickInterval: number;

    @Output() toleranceValueChanged: EventEmitter<number> = new EventEmitter();

    constructor(public settingsManager: SettingsManagerService) {
        this.maxToleranceValue = PaintBucketConstants.MAX_TOLERANCE_VALUE;
        this.minToleranceValue = PaintBucketConstants.MIN_TOLERANCE_VALUE;
        this.tickInterval = 1;
        this.toleranceValue = settingsManager.toolManager.paintBucketService.toleranceValue;
    }

    ngOnInit(): void {
        this.toleranceValueChanged.subscribe((newToleranceValue: number) => this.settingsManager.setToleranceValue(newToleranceValue));
    }

    emitToleranceValue(): void {
        this.toleranceValueChanged.emit(this.toleranceValue);
    }
}
