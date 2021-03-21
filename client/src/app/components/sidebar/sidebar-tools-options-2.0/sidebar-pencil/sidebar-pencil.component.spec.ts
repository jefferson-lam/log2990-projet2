import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsManagerService } from '@app/services/manager/settings-manager';
import { SidebarPencilComponent } from './sidebar-pencil.component';

// tslint:disable:no-any
describe('SidebarPencilComponent', () => {
    let component: SidebarPencilComponent;
    let fixture: ComponentFixture<SidebarPencilComponent>;
    let toolSizeChangedSubscribeSpy: jasmine.Spy<any>;
    let settingsManagerService: SettingsManagerService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SidebarPencilComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarPencilComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        settingsManagerService = TestBed.inject(SettingsManagerService);
        toolSizeChangedSubscribeSpy = spyOn(component.toolSizeChanged, 'subscribe');
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call subscribe method when created', () => {
        component.ngOnInit();
        expect(toolSizeChangedSubscribeSpy).toHaveBeenCalled();
    });

    it('emitToolSize should emit tool size', () => {
        const emitSpy = spyOn(component.toolSizeChanged, 'emit');
        component.toolSize = 1;
        component.emitToolSize();
        expect(emitSpy).toHaveBeenCalled();
    });

    it('should call settingsManager setLineWidth() after tool size change', () => {
        const setLineWidthSpy = spyOn(settingsManagerService, 'setLineWidth');
        component.ngOnInit();
        component.emitToolSize();
        expect(setLineWidthSpy).toHaveBeenCalled();
    });
});
