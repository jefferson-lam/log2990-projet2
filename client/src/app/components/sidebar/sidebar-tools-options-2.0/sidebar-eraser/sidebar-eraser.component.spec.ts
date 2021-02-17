import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsManagerService } from '@app/services/manager/settings-manager';
import { SidebarEraserComponent } from './sidebar-eraser.component';

// tslint:disable:no-any
describe('SidebarEraserComponent', () => {
    let component: SidebarEraserComponent;
    let fixture: ComponentFixture<SidebarEraserComponent>;
    let toolSizeChangedSubscribeSpy: jasmine.Spy<any>;
    let settingsManagerService: SettingsManagerService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SidebarEraserComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarEraserComponent);
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

    it('should call settingsManager setLineWidth() after tool size change', () => {
        const setLineWidthSpy = spyOn(settingsManagerService, 'setLineWidth');
        component.ngOnInit();
        component.emitToolSize();
        expect(setLineWidthSpy).toHaveBeenCalled();
    });

    it('emitToolSize should emit tool size', () => {
        const emitSpy = spyOn(component.toolSizeChanged, 'emit');
        component.toolSize = 1;
        component.emitToolSize();
        expect(emitSpy).toHaveBeenCalled();
    });

    it('setMax should return input value if it is equal or under MAXWIDTH', () => {
        const MAX_WIDTH_RANDOM = 200;
        const newWitdh = MAX_WIDTH_RANDOM;
        const returnValue = component.setMax(newWitdh);
        expect(returnValue).toEqual(newWitdh);
    });
});
