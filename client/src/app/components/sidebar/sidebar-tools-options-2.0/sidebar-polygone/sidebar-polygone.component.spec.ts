import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as PolygoneConstants from '@app/constants/polygone-constants';
import * as ShapeConstants from '@app/constants/shapes-constants';
import * as ToolsConstants from '@app/constants/tool-constants';
import { SettingsManagerService } from '@app/services/manager/settings-manager';
import { SidebarPolygoneComponent } from './sidebar-polygone.component';

// tslint:disable: no-string-literal
describe('SidebarPolygoneComponent', () => {
    let polygoneComponent: SidebarPolygoneComponent;
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
        polygoneComponent = fixture.componentInstance;
        fixture.detectChanges();
        settingsManagerService = TestBed.inject(SettingsManagerService);
        toolSizeChangedSubscribeSpy = spyOn(polygoneComponent['toolSizeChanged'], 'subscribe');
        fillModeChangedSubscribeSpy = spyOn(polygoneComponent['fillModeChanged'], 'subscribe');
        numberOfSidesSpy = spyOn(polygoneComponent['numberOfPolySides'], 'subscribe');
    });

    it('should create', () => {
        expect(polygoneComponent).toBeTruthy();
    });

    it('emitToolSize should emit tool size', () => {
        const emitSpy = spyOn(polygoneComponent['toolSizeChanged'], 'emit');
        polygoneComponent.toolSize = ShapeConstants.INITIAL_BORDER_WIDTH;
        polygoneComponent.emitToolSize();
        expect(emitSpy).toHaveBeenCalled();
    });

    it('emitFillMode should emit fill mode', () => {
        const newFillMode = ToolsConstants.FillMode.FILL_ONLY;
        const emitSpy = spyOn(polygoneComponent['fillModeChanged'], 'emit');
        polygoneComponent.emitFillMode(newFillMode);
        expect(emitSpy).toHaveBeenCalled();
    });

    it('emitPolygoneSideNumber should emit sides number', () => {
        const emitSpy = spyOn(polygoneComponent['numberOfPolySides'], 'emit');
        polygoneComponent.polygoneSidesCount = PolygoneConstants.INIT_SIDES_COUNT;
        polygoneComponent.emitPolygoneSideNumber();
        expect(emitSpy).toHaveBeenCalled();
    });

    it('should call subscribe method when created at first', () => {
        polygoneComponent.ngOnInit();
        expect(toolSizeChangedSubscribeSpy).toHaveBeenCalled();
        expect(fillModeChangedSubscribeSpy).toHaveBeenCalled();
        expect(numberOfSidesSpy).toHaveBeenCalled();
    });

    it('should call setLineWidth() from settingsManager after tool size change', () => {
        const setLineWidthSpy = spyOn(settingsManagerService, 'setLineWidth');
        polygoneComponent.ngOnInit();
        polygoneComponent.emitToolSize();
        expect(setLineWidthSpy).toHaveBeenCalled();
    });

    it('should call setFillModeSpy() from settingsManager after fill mode change', () => {
        const setFillModeSpy = spyOn(settingsManagerService, 'setFillMode');
        const fillMode = ToolsConstants.FillMode.FILL_ONLY;
        polygoneComponent.ngOnInit();
        polygoneComponent.emitFillMode(fillMode);
        expect(setFillModeSpy).toHaveBeenCalled();
    });

    it('should call setSidesCount() from settingsManager after number of sides change', () => {
        const setNumberSpy = spyOn(settingsManagerService, 'setSidesCount');
        polygoneComponent.ngOnInit();
        polygoneComponent.emitPolygoneSideNumber();
        expect(setNumberSpy).toHaveBeenCalled();
    });
});
