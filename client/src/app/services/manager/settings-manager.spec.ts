import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Tool } from '@app/classes/tool';
import { EditorComponent } from '@app/components/editor/editor.component';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SettingsManagerService } from './settings-manager';
import { ToolManagerService } from './tool-manager-service';

class ToolStub extends Tool {}

// tslint:disable:no-any
describe('SettingsManagerService', () => {
    let service: SettingsManagerService;
    let editorComponent: EditorComponent;
    let toolStub: ToolStub;
    let setLineWidthSpy: jasmine.Spy<any>;
    let setFillModeSpy: jasmine.Spy<any>;
    let setJunctionRadiusSpy: jasmine.Spy<any>;
    let setWithJunctionSpy: jasmine.Spy<any>;
    let toolManagerServiceSpy: ToolManagerService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [EditorComponent],
            providers: [{ provide: EditorComponent, useValue: editorComponent }],
        }).compileComponents();
        service = TestBed.inject(SettingsManagerService);
        editorComponent = new EditorComponent({} as ToolManagerService, {} as MatDialog, service);
        toolStub = new ToolStub({} as DrawingService);
        editorComponent.currentTool = toolStub;
        setLineWidthSpy = spyOn<any>(service.editorComponent.currentTool, 'setLineWidth').and.callThrough();
        setFillModeSpy = spyOn<any>(service.editorComponent.currentTool, 'setFillMode').and.callThrough();
        setJunctionRadiusSpy = spyOn<any>(service.editorComponent.currentTool, 'setJunctionRadius');
        setWithJunctionSpy = spyOn<any>(service.editorComponent.currentTool, 'setWithJunction');
        toolManagerServiceSpy = jasmine.createSpyObj<any>(service.toolManagerService, ['setPrimaryColorTools', 'setSecondaryColorTools']);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('changeSizeTool should call setSize of current tool', () => {
        const EXPECTED_TOOL_SIZE = 17;
        service.setLineWidth(EXPECTED_TOOL_SIZE);
        expect(setLineWidthSpy).toHaveBeenCalled();
    });

    it('setFillMode should set the fill mode correctly of current tool', () => {
        const EXPECTED_FILL_MODE = 2;
        service.setFillMode(EXPECTED_FILL_MODE);
        expect(setFillModeSpy).toHaveBeenCalled();
    });

    it('setJunctionRadius should call setJunctionRadius of current tool', () => {
        const newJunctionRadius = 25;
        service.setJunctionRadius(newJunctionRadius);
        expect(setJunctionRadiusSpy).toHaveBeenCalled();
    });

    it('setWithJunction should call setWithJunction of current tool', () => {
        const hasJunction = true;
        service.setWithJunction(hasJunction);
        expect(setWithJunctionSpy).toHaveBeenCalled();
    });

    it('setPrimaryColorTools should call setPrimaryToolsColor of toolManager', () => {
        service.setPrimaryColorTools('blue');
        expect(toolManagerServiceSpy).toHaveBeenCalled();
    });
});
