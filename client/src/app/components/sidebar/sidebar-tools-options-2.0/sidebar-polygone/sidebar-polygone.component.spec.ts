import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as PolygoneConstants from '@app/constants/polygone-constants';
import * as ToolsConstants from '@app/constants/tool-constants';
import { SettingsManagerService } from '@app/services/manager/settings-manager';
import { SidebarPolygoneComponent } from './sidebar-polygone.component';

describe('SidebarPolygoneComponent', () => {
    let component: SidebarPolygoneComponent;
    let fixture: ComponentFixture<SidebarPolygoneComponent>;
    let toolSizeChangedSubscribeSpy: jasmine.Spy;
    let fillModeChangedSubscribeSpy: jasmine.Spy;
    let numberOfSidesSpy: jasmine.Spy;
    let settingsManagerService: SettingsManagerService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SidebarPolygoneComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarPolygoneComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        settingsManagerService = TestBed.inject(SettingsManagerService);
        toolSizeChangedSubscribeSpy = spyOn(component.toolSizeChanged, 'subscribe');
        fillModeChangedSubscribeSpy = spyOn(component.fillModeChanged, 'subscribe');
        numberOfSidesSpy = spyOn(component.numberOfPolySides, 'subscribe');
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('emitToolSize should emit tool size', () => {
        const emitSpy = spyOn(component.toolSizeChanged, 'emit');
        component.toolSize = PolygoneConstants.INIT_LINE_WIDTH;
        component.emitToolSize();
        expect(emitSpy).toHaveBeenCalled();
    });

    it('emitFillMode should emit fill mode', () => {
        const newFillMode = ToolsConstants.FillMode.FILL_ONLY;
        const emitSpy = spyOn(component.fillModeChanged, 'emit');
        component.emitFillMode(newFillMode);
        expect(emitSpy).toHaveBeenCalled();
    });

    it('emitPolygoneSideNumber should emit sides number', () => {
        const emitSpy = spyOn(component.numberOfPolySides, 'emit');
        component.polygoneSidesCount = PolygoneConstants.MIN_SIDES_COUNT;
        component.emitPolygoneSideNumber();
        expect(emitSpy).toHaveBeenCalled();
    });

    it('should call subscribe method when created', () => {
        component.ngOnInit();
        expect(toolSizeChangedSubscribeSpy).toHaveBeenCalled();
        expect(fillModeChangedSubscribeSpy).toHaveBeenCalled();
        expect(numberOfSidesSpy).toHaveBeenCalled();
    });

    it('should call setLineWidth() from settingsManager after tool size change', () => {
        const setLineWidthSpy = spyOn(settingsManagerService, 'setLineWidth');
        component.ngOnInit();
        component.emitToolSize();
        expect(setLineWidthSpy).toHaveBeenCalled();
    });

    it('should call setFillModeSpy() from settingsManager after fill mode change', () => {
        const setFillModeSpy = spyOn(settingsManagerService, 'setFillMode');
        const fillMode = ToolsConstants.FillMode.FILL_ONLY;
        component.ngOnInit();
        component.emitFillMode(fillMode);
        expect(setFillModeSpy).toHaveBeenCalled();
    });

    it('should call setSidesCount() from settingsManager after number of sides change', () => {
        const setNumberSpy = spyOn(settingsManagerService, 'setSidesCount');
        component.ngOnInit();
        component.emitPolygoneSideNumber();
        expect(setNumberSpy).toHaveBeenCalled();
    });
});
