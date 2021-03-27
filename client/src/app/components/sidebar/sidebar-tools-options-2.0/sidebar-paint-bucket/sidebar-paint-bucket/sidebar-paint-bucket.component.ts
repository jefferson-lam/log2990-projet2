import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as PaintBucketConstants from '@app/constants/paint-bucket-constants';
import { SettingsManagerService } from '@app/services/manager/settings-manager';

@Component({
    selector: 'app-sidebar-paint-bucket',
    templateUrl: './sidebar-paint-bucket.component.html',
    styleUrls: ['./sidebar-paint-bucket.component.scss'],
})
export class SidebarPaintBucketComponent implements OnInit {
    maxToleranceValue: number = PaintBucketConstants.MAX_TOLERANCE_VALUE;
    minToleranceValue: number = PaintBucketConstants.MIN_TOLERANCE_VALUE;
    toleranceValue: number = PaintBucketConstants.DEFAULT_TOLERANCE_VALUE;
    tickInterval: number = 1;

    @Output() toleranceValueChanged: EventEmitter<number> = new EventEmitter();

    constructor(public settingsManager: SettingsManagerService) {}

    ngOnInit(): void {
        this.toleranceValueChanged.subscribe((newToleranceValue: number) => this.settingsManager.setToleranceValue(newToleranceValue));
    }

    emitToleranceValue(): void {
        this.toleranceValueChanged.emit(this.toleranceValue);
    }
}
