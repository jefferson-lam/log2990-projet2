import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as StampConstants from '@app/constants/stamp-constants';
import { SettingsManagerService } from '@app/services/manager/settings-manager';
import { StampService } from '@app/services/tools/stamp/stamp-service';
import { Subject } from 'rxjs';
import { SidebarStampComponent } from './sidebar-stamp.component';

// tslint:disable: no-string-literal
// tslint:disable: no-any
describe('SidebarStampComponent', () => {
    let stampServiceSpy: jasmine.SpyObj<StampService>;
    let stampComponent: SidebarStampComponent;
    let fixture: ComponentFixture<SidebarStampComponent>;
    let stampSourceSpy: jasmine.Spy;
    let zoomFactorSpy: jasmine.Spy;
    let rotationAngleSpy: jasmine.Spy;
    let settingsManagerService: SettingsManagerService;

    beforeEach(async(() => {
        stampServiceSpy = jasmine.createSpyObj('StampService', ['setAngleRotation'], {
            angleSubject: new Subject<number>(),
            imageSource: 'assets/stamp_1.svg',
        });

        TestBed.configureTestingModule({
            declarations: [SidebarStampComponent],
            providers: [{ provide: StampService, useValue: stampServiceSpy }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarStampComponent);
        stampComponent = fixture.componentInstance;
        settingsManagerService = TestBed.inject(SettingsManagerService);
        stampSourceSpy = spyOn(stampComponent['stampSourceChanged'], 'subscribe').and.callThrough();
        zoomFactorSpy = spyOn(stampComponent['zoomFactorChanged'], 'subscribe').and.callThrough();
        rotationAngleSpy = spyOn(stampComponent['rotationAngleChanged'], 'subscribe').and.callThrough();

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(stampComponent).toBeTruthy();
    });

    it('should call subscribe method when created at first', () => {
        stampServiceSpy.rotationAngle = 0;
        stampComponent.imageSource = 'hello.svg';
        stampComponent.ngOnInit();
        expect(stampSourceSpy).toHaveBeenCalled();
        expect(zoomFactorSpy).toHaveBeenCalled();
        expect(rotationAngleSpy).toHaveBeenCalled();
    });

    it('should call setImageSource() from settingsManager after image source change', () => {
        stampComponent.imageSource = 'hello.svg';
        const setImageSourceSpy = spyOn(settingsManagerService, 'setImageSource');
        stampComponent.ngOnInit();
        stampComponent.emitImageSrc();
        expect(setImageSourceSpy).toHaveBeenCalled();
    });

    it('should call setImageZoomFactor() from settingsManager after zoom change', () => {
        const setImageZoomFactorSpy = spyOn(settingsManagerService, 'setImageZoomFactor');
        stampComponent.ngOnInit();
        stampComponent.emitZoomFactor();
        expect(setImageZoomFactorSpy).toHaveBeenCalled();
    });

    it('should call setAngleRotation() from settingsManager after rotation change', () => {
        const setAngleRotationSpy = spyOn(settingsManagerService, 'setAngleRotation');
        stampComponent.ngOnInit();
        stampComponent.emitRotateAngle();
        expect(setAngleRotationSpy).toHaveBeenCalled();
    });

    it('setAngleRotation() should set its rotation value emitted from stampService', () => {
        const EXPECTED_ANGLE = 34;
        stampComponent.stampService.angleSubject.next(EXPECTED_ANGLE);
        expect(stampComponent.angleSlider.value).toEqual(EXPECTED_ANGLE);
    });

    it('ngAfterViewInit should set map', () => {
        stampComponent.ngAfterViewInit();
        expect(stampComponent.stamps.size).not.toBe(0);
    });

    it('setStamp should call changeStampSource, changeBorderIndicator, emitImageSrc and emitRotateAngle', () => {
        const changeStampSourceSpy = spyOn<any>(stampComponent, 'changeStampSource');
        const changeBorderIndicatorSpy = spyOn<any>(stampComponent, 'changeBorderIndicator');
        const emitImageSrcSpy = spyOn(stampComponent, 'emitImageSrc');
        const emitRotateAngleSpy = spyOn(stampComponent, 'emitRotateAngle');

        stampComponent.setStamp(StampConstants.IMAGE_INDEX_1);

        expect(changeStampSourceSpy).toHaveBeenCalled();
        expect(changeStampSourceSpy).toHaveBeenCalledWith(1);
        expect(changeBorderIndicatorSpy).toHaveBeenCalled();
        expect(changeBorderIndicatorSpy).toHaveBeenCalledWith(1);
        expect(emitImageSrcSpy).toHaveBeenCalled();
        expect(emitRotateAngleSpy).toHaveBeenCalled();
    });

    it('changeBorderIndicator should call resetBorders', () => {
        const resetBorderSpy = spyOn<any>(stampComponent, 'resetBorders');
        stampComponent['changeBorderIndicator'](StampConstants.IMAGE_INDEX_6);
        expect(resetBorderSpy).toHaveBeenCalled();
    });

    it("resetBorders should set all border styles to ''", () => {
        stampComponent['resetBorders']();
        // tslint:disable-next-line: no-string-literal
        expect(stampComponent['relaxedEgg'].nativeElement.style.border).toBe('');
        expect(stampComponent['sleepyEgg'].nativeElement.style.border).toBe('');
        expect(stampComponent['hungryEgg'].nativeElement.style.border).toBe('');
        expect(stampComponent['toastEgg'].nativeElement.style.border).toBe('');
        expect(stampComponent['huskyPortrait'].nativeElement.style.border).toBe('');
        expect(stampComponent['corgiPortrait'].nativeElement.style.border).toBe('');
    });

    it('changeBorderIndicator should call resetBorders', () => {
        const resetBorderSpy = spyOn<any>(stampComponent, 'resetBorders');
        stampComponent['changeBorderIndicator'](StampConstants.IMAGE_INDEX_6);
        expect(resetBorderSpy).toHaveBeenCalled();
    });

    it('changeBorderIndicator should change border style', () => {
        stampComponent['changeBorderIndicator'](StampConstants.IMAGE_INDEX_6);
        expect(stampComponent['corgiPortrait'].nativeElement.style.border).toEqual('2px dashed floralwhite');
    });

    it('changeBorderIndicator should change border style', () => {
        stampComponent['changeBorderIndicator'](StampConstants.IMAGE_INDEX_5);
        expect(stampComponent['huskyPortrait'].nativeElement.style.border).toEqual('2px dashed floralwhite');
    });

    it('changeBorderIndicator should change border style', () => {
        stampComponent['changeBorderIndicator'](StampConstants.IMAGE_INDEX_4);
        expect(stampComponent['toastEgg'].nativeElement.style.border).toEqual('2px dashed floralwhite');
    });

    it('changeBorderIndicator should change border style', () => {
        stampComponent['changeBorderIndicator'](StampConstants.IMAGE_INDEX_3);
        expect(stampComponent['hungryEgg'].nativeElement.style.border).toEqual('2px dashed floralwhite');
    });

    it('changeBorderIndicator should change border style', () => {
        stampComponent['changeBorderIndicator'](StampConstants.IMAGE_INDEX_2);
        expect(stampComponent['sleepyEgg'].nativeElement.style.border).toEqual('2px dashed floralwhite');
    });

    it('changeBorderIndicator should change border style', () => {
        stampComponent['changeBorderIndicator'](StampConstants.IMAGE_INDEX_1);
        expect(stampComponent['relaxedEgg'].nativeElement.style.border).toEqual('2px dashed floralwhite');
    });

    it('changeStampSource should change imageSource value of index 1', () => {
        stampComponent.imageSource = 'hello.svg';
        stampComponent['changeStampSource'](StampConstants.IMAGE_INDEX_1);

        expect(stampComponent.imageSource).toEqual('assets/stamp_1.svg');
    });

    it('changeStampSource should change imageSource value of index 2', () => {
        stampComponent.imageSource = 'hello.svg';
        stampComponent['changeStampSource'](StampConstants.IMAGE_INDEX_2);

        expect(stampComponent.imageSource).toEqual('assets/stamp_2.svg');
    });

    it('changeStampSource should change imageSource value of index 3', () => {
        stampComponent.imageSource = 'hello.svg';
        stampComponent['changeStampSource'](StampConstants.IMAGE_INDEX_3);

        expect(stampComponent.imageSource).toEqual('assets/stamp_3.svg');
    });

    it('changeStampSource should change imageSource value of index 4', () => {
        stampComponent.imageSource = 'hello.svg';
        stampComponent['changeStampSource'](StampConstants.IMAGE_INDEX_4);

        expect(stampComponent.imageSource).toEqual('assets/stamp_4.svg');
    });

    it('changeStampSource should change imageSource value of index 5', () => {
        stampComponent.imageSource = 'hello.svg';
        stampComponent['changeStampSource'](StampConstants.IMAGE_INDEX_5);

        expect(stampComponent.imageSource).toEqual('assets/stamp_5.svg');
    });

    it('changeStampSource should change imageSource value of index 6', () => {
        stampComponent.imageSource = 'hello.svg';
        stampComponent['changeStampSource'](StampConstants.IMAGE_INDEX_6);

        expect(stampComponent.imageSource).toEqual('assets/stamp_6.svg');
    });

    it('emitImageSrc should emit image source', () => {
        const emitSpy = spyOn(stampComponent['stampSourceChanged'], 'emit');
        stampComponent.imageSource = 'hello.svg';
        stampComponent.emitImageSrc();

        expect(emitSpy).toHaveBeenCalled();
    });

    it('emitImageSrc should change image source', () => {
        const emitSpy = spyOn(stampComponent['stampSourceChanged'], 'emit');
        stampComponent.imageSource = 'hello.svg';
        stampComponent.emitImageSrc();

        expect(emitSpy).toHaveBeenCalled();
        expect(stampComponent.imageSource).toEqual('hello.svg');
    });

    it('emitZoomFactor should emit zoom factor', () => {
        const emitSpy = spyOn(stampComponent['zoomFactorChanged'], 'emit');
        stampComponent.zoomFactor = StampConstants.INIT_ZOOM_FACTOR;
        stampComponent.emitZoomFactor();
        expect(emitSpy).toHaveBeenCalled();
    });

    it('emitRotateAngle should emit rotating angle', () => {
        const emitSpy = spyOn(stampComponent['rotationAngleChanged'], 'emit');
        stampComponent.rotationAngle = StampConstants.INIT_ROTATION_ANGLE;
        stampComponent.emitRotateAngle();
        expect(emitSpy).toHaveBeenCalled();
    });
});
