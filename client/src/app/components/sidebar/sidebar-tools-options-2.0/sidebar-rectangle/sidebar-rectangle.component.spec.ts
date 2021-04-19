import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsManagerService } from '@app/services/manager/settings-manager';
import { SidebarRectangleComponent } from './sidebar-rectangle.component';

// tslint:disable:no-any
// tslint:disable: no-string-literal
describe('SidebarRectangleComponent', () => {
    let component: SidebarRectangleComponent;
    let fixture: ComponentFixture<SidebarRectangleComponent>;
    let toolSizeChangedSubscribeSpy: jasmine.Spy<any>;
    let fillModeChangedSubscribeSpy: jasmine.Spy<any>;
    let settingsManagerService: SettingsManagerService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SidebarRectangleComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarRectangleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        settingsManagerService = TestBed.inject(SettingsManagerService);
        toolSizeChangedSubscribeSpy = spyOn(component['toolSizeChanged'], 'subscribe');
        fillModeChangedSubscribeSpy = spyOn(component.fillModeChanged, 'subscribe');
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('emitToolSize should emit tool size', () => {
        const emitSpy = spyOn(component['toolSizeChanged'], 'emit');
        component.toolSize = 0;
        component.emitToolSize();
        expect(emitSpy).toHaveBeenCalled();
    });

    it('emitFillMode should emit fill mode', () => {
        const newFillMode = 1;
        const emitSpy = spyOn(component.fillModeChanged, 'emit');
        component.emitFillMode(newFillMode);
        expect(emitSpy).toHaveBeenCalled();
    });

    it('should call subscribe method when created', () => {
        component.ngOnInit();
        expect(toolSizeChangedSubscribeSpy).toHaveBeenCalled();
        expect(fillModeChangedSubscribeSpy).toHaveBeenCalled();
    });

    it('should call call settingsManager setLineWidth() after tool size change', () => {
        const setLineWidthSpy = spyOn(settingsManagerService, 'setLineWidth');
        component.ngOnInit();
        component.emitToolSize();
        expect(setLineWidthSpy).toHaveBeenCalled();
    });

    it('should call call settingsManager setFillModeSpy() after fill mode change', () => {
        const setFillModeSpy = spyOn(settingsManagerService, 'setFillMode');
        const fillMode = 1;
        component.ngOnInit();
        component.emitFillMode(fillMode);
        expect(setFillModeSpy).toHaveBeenCalled();
    });
});
