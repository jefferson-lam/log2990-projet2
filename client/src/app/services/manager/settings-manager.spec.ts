import { async, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Rgba } from '@app/classes/rgba';
import { Tool } from '@app/classes/tool';
import { EditorComponent } from '@app/components/editor/editor.component';
import { ColorService } from '@app/services/color/color.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { SettingsManagerService } from './settings-manager';
import { ToolManagerService } from './tool-manager-service';

// tslint:disable:no-any
describe('SettingsManagerService', () => {
    let service: SettingsManagerService;
    let editorComponent: EditorComponent;
    let toolSpy: jasmine.SpyObj<Tool>;
    let toolManagerSpy: jasmine.SpyObj<ToolManagerService>;

    beforeEach(() => {
        toolSpy = jasmine.createSpyObj('Tool', ['setLineWidth', 'setFillMode', 'setJunctionRadius', 'setWithJunction']);
        toolManagerSpy = jasmine.createSpyObj('ToolManagerService', ['setPrimaryColorTools', 'setSecondaryColorTools']);
        TestBed.configureTestingModule({
            declarations: [EditorComponent],
            providers: [
                { provide: EditorComponent, useValue: editorComponent },
                { provide: Tool, useValue: toolSpy },
                { provide: ToolManagerService, useValue: toolManagerSpy },
            ],
        }).compileComponents();
        service = TestBed.inject(SettingsManagerService);
        editorComponent = new EditorComponent({} as ToolManagerService, {} as MatDialog, service, {} as UndoRedoService);
        editorComponent.currentTool = toolSpy;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('changeSizeTool should call setSize of current tool', () => {
        const EXPECTED_TOOL_SIZE = 17;
        service.setLineWidth(EXPECTED_TOOL_SIZE);
        expect(toolSpy.setLineWidth).toHaveBeenCalled();
    });

    it('setFillMode should set the fill mode correctly of current tool', () => {
        const EXPECTED_FILL_MODE = 2;
        service.setFillMode(EXPECTED_FILL_MODE);
        expect(toolSpy.setFillMode).toHaveBeenCalled();
    });

    it('setJunctionRadius should call setJunctionRadius of current tool', () => {
        const newJunctionRadius = 25;
        service.setJunctionRadius(newJunctionRadius);
        expect(toolSpy.setJunctionRadius).toHaveBeenCalled();
    });

    it('setWithJunction should call setWithJunction of current tool', () => {
        const hasJunction = true;
        service.setWithJunction(hasJunction);
        expect(toolSpy.setWithJunction).toHaveBeenCalled();
    });

    it('setPrimaryColorTools should call setPrimaryToolsColor of toolManager', () => {
        service.setPrimaryColorTools('blue');
        expect(toolManagerSpy.setPrimaryColorTools).toHaveBeenCalled();
    });

    it('setSecondaryColorTools should call setPrimaryToolsColor of toolManager', () => {
        service.setSecondaryColorTools('blue');
        expect(toolManagerSpy.setSecondaryColorTools).toHaveBeenCalled();
    });

    it('calls setPrimaryColorsTools when size changed', async(() => {
        const mockColor = {
            red: '255',
            green: '10',
            blue: '2',
            alpha: 1,
        } as Rgba;
        const serviceSetter = spyOn(service, 'setPrimaryColorTools').and.callThrough();
        const colorService = TestBed.inject(ColorService);
        colorService.setPrimaryColor(mockColor);

        expect(serviceSetter).toHaveBeenCalled();
        expect(serviceSetter).toHaveBeenCalledWith(colorService.convertRgbaToString(mockColor));
    }));

    it('calls setSecondaryColorsTools when size changed', async(() => {
        const mockColor = {
            red: '255',
            green: '10',
            blue: '2',
            alpha: 1,
        } as Rgba;
        const serviceSetter = spyOn(service, 'setSecondaryColorTools').and.callThrough();
        const colorService = TestBed.inject(ColorService);
        colorService.setSecondaryColor(mockColor);

        expect(serviceSetter).toHaveBeenCalled();
        expect(serviceSetter).toHaveBeenCalledWith(colorService.convertRgbaToString(mockColor));
    }));
});
