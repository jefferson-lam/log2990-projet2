import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatSlider } from '@angular/material/slider';
import { Stamp } from '@app/classes/stamp';
import { Tool } from '@app/classes/tool';
import * as StampConstants from '@app/constants/stamp-constants';
import { SettingsManagerService } from '@app/services/manager/settings-manager';
import { StampService } from '@app/services/tools/stamp/stamp-service';

@Component({
    selector: 'app-sidebar-stamp',
    templateUrl: './sidebar-stamp.component.html',
    styleUrls: ['./sidebar-stamp.component.scss'],
})
export class SidebarStampComponent implements OnInit, AfterViewInit {
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
    stamps: Map<number, Stamp>;

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

    ngAfterViewInit(): void {
        this.stamps = new Map<number, Stamp>();
        this.stamps
            .set(StampConstants.IMAGE_INDEX_1, { imageSource: 'assets/stamp_1.svg', element: this.relaxedEgg.nativeElement })
            .set(StampConstants.IMAGE_INDEX_2, { imageSource: 'assets/stamp_2.svg', element: this.sleepyEgg.nativeElement })
            .set(StampConstants.IMAGE_INDEX_3, { imageSource: 'assets/stamp_3.svg', element: this.hungryEgg.nativeElement })
            .set(StampConstants.IMAGE_INDEX_4, { imageSource: 'assets/stamp_4.svg', element: this.toastEgg.nativeElement })
            .set(StampConstants.IMAGE_INDEX_5, { imageSource: 'assets/stamp_5.svg', element: this.huskyPortrait.nativeElement })
            .set(StampConstants.IMAGE_INDEX_6, { imageSource: 'assets/stamp_6.svg', element: this.corgiPortrait.nativeElement });
        const stampSelected = Array.from(this.stamps.entries())
            .filter(([key, stamp]) => stamp.imageSource === this.stampService.imageSource)
            .map(([key]) => key)[0];
        this.changeBorderIndicator(stampSelected);
    }

    setStamp(stampNumber: number): void {
        this.changeStampSource(stampNumber);
        this.changeBorderIndicator(stampNumber);
        this.emitImageSrc();
        this.emitRotateAngle();
    }

    resetBorders(): void {
        this.relaxedEgg.nativeElement.style.border = '';
        this.sleepyEgg.nativeElement.style.border = '';
        this.hungryEgg.nativeElement.style.border = '';
        this.toastEgg.nativeElement.style.border = '';
        this.huskyPortrait.nativeElement.style.border = '';
        this.corgiPortrait.nativeElement.style.border = '';
    }

    changeBorderIndicator(imageIndex: number): void {
        this.resetBorders();
        (this.stamps.get(imageIndex) as Stamp).element.style.border = '2px dashed floralwhite';
    }

    changeStampSource(stampIndex: number): void {
        this.stampClickState = true;
        this.imageSource = (this.stamps.get(stampIndex) as Stamp).imageSource;
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
