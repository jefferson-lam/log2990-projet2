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
    @ViewChild('toggleMagnetism') magnetismToggle: MatSlideToggle;

    isMagnetismOn: boolean;
    MAGNETISM_CORNERS: typeof MagnestismConstants.ResizerIndex;

    @Output() magnetismValueChanged: EventEmitter<boolean> = new EventEmitter();
    @Output() referenceCornerChanged: EventEmitter<MagnestismConstants.ResizerIndex> = new EventEmitter();

    constructor(public magnetismService: MagnetismService) {}

    ngOnInit(): void {
        this.isMagnetismOn = this.magnetismService.isMagnetismOn;
        this.MAGNETISM_CORNERS = MagnestismConstants.ResizerIndex;
        this.magnetismValueChanged.subscribe((isMagnetismOn: boolean) => {
            this.magnetismService.isMagnetismOn = isMagnetismOn;
        });
        this.referenceCornerChanged.subscribe((newCorner: MagnestismConstants.ResizerIndex) => {
            this.magnetismService.referenceResizerMode = newCorner;
        });
        this.magnetismService.magnetismStateSubject.asObservable().subscribe((magnetismState) => {
            this.magnetismToggle.checked = magnetismState;
        });
    }

    emitMagnetismValue(): void {
        this.magnetismValueChanged.emit(this.isMagnetismOn);
    }

    emitReferencePoint(referenceCorner: MagnestismConstants.ResizerIndex): void {
        this.referenceCornerChanged.emit(referenceCorner);
    }
}
