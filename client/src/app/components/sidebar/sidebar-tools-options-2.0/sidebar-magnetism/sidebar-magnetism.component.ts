import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import * as MagnestismConstants from '@app/constants/magnetism-constants';
import { MagnetismService } from '@app/services/magnetism/magnetism.service';

@Component({
    selector: 'app-sidebar-magnetism',
    templateUrl: './sidebar-magnetism.component.html',
    styleUrls: ['./sidebar-magnetism.component.scss'],
})
export class SidebarMagnetismComponent implements OnInit {
    @ViewChild('toggleMagnetism') private magnetismToggle: MatSlideToggle;

    isMagnetismOn: boolean;
    MAGNETISM_CORNERS: typeof MagnestismConstants.MagnetizedPoint;

    @Output() magnetismValueChanged: EventEmitter<boolean>;
    @Output() magnetizedPointChanged: EventEmitter<MagnestismConstants.MagnetizedPoint>;

    constructor(public magnetismService: MagnetismService) {
        this.magnetismValueChanged = new EventEmitter();
        this.magnetizedPointChanged = new EventEmitter();
    }

    ngOnInit(): void {
        this.isMagnetismOn = this.magnetismService.isMagnetismOn;
        this.MAGNETISM_CORNERS = MagnestismConstants.MagnetizedPoint;
        this.magnetismValueChanged.subscribe((isMagnetismOn: boolean) => {
            this.magnetismService.isMagnetismOn = isMagnetismOn;
        });
        this.magnetizedPointChanged.subscribe((newCorner: MagnestismConstants.MagnetizedPoint) => {
            this.magnetismService.magnetizedPoint = newCorner;
        });
        this.magnetismService.magnetismStateSubject.asObservable().subscribe((magnetismState) => {
            this.magnetismToggle.checked = magnetismState;
        });
    }

    emitMagnetismValue(): void {
        this.magnetismValueChanged.emit(this.isMagnetismOn);
    }

    emitReferencePoint(referenceCorner: MagnestismConstants.MagnetizedPoint): void {
        this.magnetizedPointChanged.emit(referenceCorner);
    }
}
