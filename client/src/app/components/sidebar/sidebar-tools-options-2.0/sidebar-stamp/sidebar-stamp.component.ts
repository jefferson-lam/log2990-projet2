import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import * as StampConstants from '@app/constants/stamp-constants';
import { SettingsManagerService } from '@app/services/manager/settings-manager';
import { StampService } from '@app/services/tools/stamp/stamp-service';

@Component({
    selector: 'app-sidebar-stamp',
    templateUrl: './sidebar-stamp.component.html',
    styleUrls: ['./sidebar-stamp.component.scss'],
})
export class SidebarStampComponent implements OnInit {
    imageSource: string;
    stampClickState: boolean;
    rotationAngle: number = StampConstants.INIT_ROTATION_ANGLE;
    minFactor: number = StampConstants.MIN_ZOOM_FACTOR;
    maxFactor: number = StampConstants.MAX_ZOOM_FACTOR;
    minAngle: number = StampConstants.MIN_ANGLE;
    maxAngle: number = StampConstants.MAX_ANGLE;
    zoomFactor: number = StampConstants.INIT_ZOOM_FACTOR;
    tickInterval: number = StampConstants.TICK_INTERVAL;

    @ViewChild('stamp1', { static: false }) stamp1: ElementRef<HTMLElement>;
    @ViewChild('stamp2', { static: false }) stamp2: ElementRef<HTMLElement>;
    @ViewChild('stamp3', { static: false }) stamp3: ElementRef<HTMLElement>;
    @ViewChild('stamp4', { static: false }) stamp4: ElementRef<HTMLElement>;
    @ViewChild('stamp5', { static: false }) stamp5: ElementRef<HTMLElement>;
    @ViewChild('stamp6', { static: false }) stamp6: ElementRef<HTMLElement>;

    @Output() stampClicked: EventEmitter<boolean> = new EventEmitter();
    @Output() stampSourceChanged: EventEmitter<string> = new EventEmitter();
    @Output() zoomFactorChanged: EventEmitter<number> = new EventEmitter();
    @Output() rotationAngleChanged: EventEmitter<number> = new EventEmitter();

    constructor(public settingsManager: SettingsManagerService, public stampService: StampService) {}

    ngOnInit(): void {
        this.stampSourceChanged.subscribe((newSource: string) => this.settingsManager.setImageSource(newSource));
        this.zoomFactorChanged.subscribe((newFactor: number) => this.settingsManager.setImageZoomFactor(newFactor));
        this.rotationAngleChanged.subscribe((newAngle: number) => this.settingsManager.setAngleRotation(newAngle));
        this.stampClicked.subscribe((stampState: boolean) => this.stampService.setStampClickedState(stampState));
    }

    changeBorderIndicator(imageIndex: number): void {
        this.stamp1.nativeElement.style.border = '';
        this.stamp2.nativeElement.style.border = '';
        this.stamp3.nativeElement.style.border = '';
        this.stamp4.nativeElement.style.border = '';
        this.stamp5.nativeElement.style.border = '';
        this.stamp6.nativeElement.style.border = '';
        switch (imageIndex) {
            case StampConstants.IMAGE_INDEX_1:
                this.stamp1.nativeElement.style.border = '2px dashed floralwhite';
                break;
            case StampConstants.IMAGE_INDEX_2:
                this.stamp2.nativeElement.style.border = '2px dashed floralwhite';
                break;
            case StampConstants.IMAGE_INDEX_3:
                this.stamp3.nativeElement.style.border = '2px dashed floralwhite';
                break;
            case StampConstants.IMAGE_INDEX_4:
                this.stamp4.nativeElement.style.border = '2px dashed floralwhite';
                break;
            case StampConstants.IMAGE_INDEX_5:
                this.stamp5.nativeElement.style.border = '2px dashed floralwhite';
                break;
            case StampConstants.IMAGE_INDEX_6:
                this.stamp6.nativeElement.style.border = '2px dashed floralwhite';
                break;
        }
    }

    changeStampSource(stampIndex: number): void {
        this.stampClickState = true;
        switch (stampIndex) {
            case StampConstants.IMAGE_INDEX_1:
                this.imageSource = 'assets/stamp_1.svg';
                break;
            case StampConstants.IMAGE_INDEX_2:
                this.imageSource = 'assets/stamp_2.svg';
                break;
            case StampConstants.IMAGE_INDEX_3:
                this.imageSource = 'assets/stamp_3.svg';
                break;
            case StampConstants.IMAGE_INDEX_4:
                this.imageSource = 'assets/stamp_4.svg';
                break;
            case StampConstants.IMAGE_INDEX_5:
                this.imageSource = 'assets/stamp_5.svg';
                break;
            case StampConstants.IMAGE_INDEX_6:
                this.imageSource = 'assets/stamp_6.svg';
                break;
        }
        this.emitStampClickState();
    }

    emitStampClickState(): void {
        this.stampClicked.emit(this.stampClickState);
    }

    emitImageSrc(): void {
        this.stampSourceChanged.emit(this.imageSource);
    }

    emitZoomFactor(): void {
        this.zoomFactorChanged.emit(this.zoomFactor);
    }

    emitRotateAngle(): void {
        this.rotationAngleChanged.emit(this.rotationAngle);
    }
}
