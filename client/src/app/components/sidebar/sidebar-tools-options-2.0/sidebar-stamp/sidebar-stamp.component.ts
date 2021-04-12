import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatSlider } from '@angular/material/slider';
import { Tool } from '@app/classes/tool';
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
    rotationAngle: number;
    minFactor: number;
    maxFactor: number;
    minAngle: number;
    maxAngle: number;
    zoomFactor: number;
    tickInterval: number;
    currentTool: Tool;

    @ViewChild('relaxedEgg', { static: false }) relaxedEgg: ElementRef<HTMLElement>;
    @ViewChild('sleepyEgg', { static: false }) sleepyEgg: ElementRef<HTMLElement>;
    @ViewChild('hungryEgg', { static: false }) hungryEgg: ElementRef<HTMLElement>;
    @ViewChild('toastEgg', { static: false }) toastEgg: ElementRef<HTMLElement>;
    @ViewChild('huskyPortrait', { static: false }) huskyPortrait: ElementRef<HTMLElement>;
    @ViewChild('corgiPortrait', { static: false }) corgiPortrait: ElementRef<HTMLElement>;
    @ViewChild('angleSlider') angleSlider: MatSlider;

    @Output() stampSourceChanged: EventEmitter<string> = new EventEmitter();
    @Output() zoomFactorChanged: EventEmitter<number> = new EventEmitter();
    @Output() rotationAngleChanged: EventEmitter<number> = new EventEmitter();

    constructor(public settingsManager: SettingsManagerService, public stampService: StampService) {
        this.rotationAngle = StampConstants.INIT_ROTATION_ANGLE;
        this.minFactor = StampConstants.MIN_ZOOM_FACTOR;
        this.maxFactor = StampConstants.MAX_ZOOM_FACTOR;
        this.minAngle = StampConstants.MIN_ANGLE;
        this.maxAngle = StampConstants.MAX_ANGLE;
        this.zoomFactor = StampConstants.INIT_ZOOM_FACTOR;
        this.tickInterval = StampConstants.TICK_INTERVAL;
    }

    ngOnInit(): void {
        this.stampSourceChanged.subscribe((newSource: string) => this.settingsManager.setImageSource(newSource));
        this.zoomFactorChanged.subscribe((newFactor: number) => this.settingsManager.setImageZoomFactor(newFactor));
        this.rotationAngleChanged.subscribe((newAngle: number) => this.settingsManager.setAngleRotation(newAngle));

        this.stampService.angleSubject.asObservable().subscribe((angle: number) => {
            this.angleSlider.value = angle;
            this.rotationAngle = angle;
        });
    }

    changeBorderIndicator(imageIndex: number): void {
        this.relaxedEgg.nativeElement.style.border = '';
        this.sleepyEgg.nativeElement.style.border = '';
        this.hungryEgg.nativeElement.style.border = '';
        this.toastEgg.nativeElement.style.border = '';
        this.huskyPortrait.nativeElement.style.border = '';
        this.corgiPortrait.nativeElement.style.border = '';
        switch (imageIndex) {
            case StampConstants.IMAGE_INDEX_1:
                this.relaxedEgg.nativeElement.style.border = '2px dashed floralwhite';
                break;
            case StampConstants.IMAGE_INDEX_2:
                this.sleepyEgg.nativeElement.style.border = '2px dashed floralwhite';
                break;
            case StampConstants.IMAGE_INDEX_3:
                this.hungryEgg.nativeElement.style.border = '2px dashed floralwhite';
                break;
            case StampConstants.IMAGE_INDEX_4:
                this.toastEgg.nativeElement.style.border = '2px dashed floralwhite';
                break;
            case StampConstants.IMAGE_INDEX_5:
                this.huskyPortrait.nativeElement.style.border = '2px dashed floralwhite';
                break;
            case StampConstants.IMAGE_INDEX_6:
                this.corgiPortrait.nativeElement.style.border = '2px dashed floralwhite';
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
