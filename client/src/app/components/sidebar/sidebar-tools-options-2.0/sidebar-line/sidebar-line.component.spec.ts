import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsManagerService } from '@app/services/manager/settings-manager';
import { SidebarLineComponent } from './sidebar-line.component';

// tslint:disable:no-any
// tslint:disable: no-string-literal
describe('SidebarLineComponent', () => {
    let component: SidebarLineComponent;
    let fixture: ComponentFixture<SidebarLineComponent>;
    let toolSizeChangedSubscribeSpy: jasmine.Spy<any>;
    let withJunctionChangedSubcribeSpy: jasmine.Spy<any>;
    let junctionRadiusChangedSubscribeSpy: jasmine.Spy<any>;
    let settingsManagerService: SettingsManagerService;

    const NO_JUNCTION_RADIUS = 0;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SidebarLineComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarLineComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        settingsManagerService = TestBed.inject(SettingsManagerService);
        toolSizeChangedSubscribeSpy = spyOn(component['toolSizeChanged'], 'subscribe');
        withJunctionChangedSubcribeSpy = spyOn(component['withJunctionChanged'], 'subscribe');
        junctionRadiusChangedSubscribeSpy = spyOn(component.junctionRadiusChanged, 'subscribe');
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('emitJunctionRadius should emit junction radius', () => {
        const emitSpy = spyOn(component.junctionRadiusChanged, 'emit');
        component.junctionRadius = 0;
        component.emitJunctionRadius();
        expect(emitSpy).toHaveBeenCalled();
    });

    it('emitWithJunction should set boolean ', () => {
        const emitSpy = spyOn(component['withJunctionChanged'], 'emit');
        component.emitWithJunction();
        expect(emitSpy).toHaveBeenCalled();
    });

    it('emitToolSize should emit tool size', () => {
        const emitSpy = spyOn(component['toolSizeChanged'], 'emit');
        component.toolSize = NO_JUNCTION_RADIUS;
        component.emitToolSize();
        expect(emitSpy).toHaveBeenCalled();
    });

    it('should call subscribe method when created', () => {
        component.ngOnInit();
        expect(toolSizeChangedSubscribeSpy).toHaveBeenCalled();
        expect(withJunctionChangedSubcribeSpy).toHaveBeenCalled();
        expect(junctionRadiusChangedSubscribeSpy).toHaveBeenCalled();
    });

    it('should call call settingsManager setLineWidth() after tool size change', () => {
        const setLineWidthSpy = spyOn(settingsManagerService, 'setLineWidth');
        component.ngOnInit();
        component.emitToolSize();
        expect(setLineWidthSpy).toHaveBeenCalled();
    });

    it('should call call settingsManager setWithJunction() after junction option change', () => {
        const setWithJunctionSpy = spyOn(settingsManagerService, 'setWithJunction');
        component.ngOnInit();
        component.emitWithJunction();
        expect(setWithJunctionSpy).toHaveBeenCalled();
    });

    it('should call call settingsManager setJunctionRadius() after junction radius change', () => {
        const setJunctionRadiusSpy = spyOn(settingsManagerService, 'setJunctionRadius');
        component.ngOnInit();
        component.emitJunctionRadius();
        expect(setJunctionRadiusSpy).toHaveBeenCalled();
    });
});
