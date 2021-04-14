import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsManagerService } from '@app/services/manager/settings-manager';
import { SidebarPaintBucketComponent } from './sidebar-paint-bucket.component';

describe('SidebarPaintBucketComponent', () => {
    let component: SidebarPaintBucketComponent;
    let fixture: ComponentFixture<SidebarPaintBucketComponent>;
    let settingsManagerService: SettingsManagerService;
    let toleranceValueChangedSubscribeSpy: jasmine.Spy;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SidebarPaintBucketComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarPaintBucketComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        settingsManagerService = TestBed.inject(SettingsManagerService);
        toleranceValueChangedSubscribeSpy = spyOn(component.toleranceValueChanged, 'subscribe');
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('emitToleranceValue should emit tolerance value', () => {
        const emitSpy = spyOn(component.toleranceValueChanged, 'emit');
        const toleranceValue = 75;
        component.toleranceValue = toleranceValue;
        component.emitToleranceValue();
        expect(emitSpy).toHaveBeenCalled();
    });

    it('should call subscribe method when created', () => {
        component.ngOnInit();
        expect(toleranceValueChangedSubscribeSpy).toHaveBeenCalled();
    });

    it('should call settingsManager setToleranceValue after', () => {
        const setToleranceValueSpy = spyOn(settingsManagerService, 'setToleranceValue');
        const toleranceValue = 52;
        component.toleranceValue = toleranceValue;
        component.ngOnInit();
        component.emitToleranceValue();
        expect(setToleranceValueSpy).toHaveBeenCalled();
    });
});
