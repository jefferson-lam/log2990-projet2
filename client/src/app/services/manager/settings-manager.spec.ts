import { async, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Rgba } from '@app/classes/rgba';
import { Tool } from '@app/classes/tool';
import { EditorComponent } from '@app/components/editor/editor.component';
import { ColorService } from '@app/services/color/color.service';
import { SettingsManagerService } from '@app/services/manager/settings-manager';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';
import { ClipboardService } from '@app/services/tools/selection/clipboard/clipboard.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

// tslint:disable:no-any
describe('SettingsManagerService', () => {
    let service: SettingsManagerService;
    let editorComponent: EditorComponent;
    let toolSpy: jasmine.SpyObj<Tool>;
    let toolManagerSpy: jasmine.SpyObj<ToolManagerService>;

    beforeEach(() => {
        toolSpy = jasmine.createSpyObj('Tool', [
            'setLineWidth',
            'setFillMode',
            'setJunctionRadius',
            'setWithJunction',
            'setSidesCount',
            'setWaterDropWidth',
            'setEmissionCount',
        ]);
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
        editorComponent = new EditorComponent({} as ToolManagerService, {} as MatDialog, service, {} as UndoRedoService, {} as ClipboardService);
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

    it('setSidesCount should set the sides count correctly of current tool', () => {
        const EXPECTED_SIDES_COUNT = 10;
        service.setSidesCount(EXPECTED_SIDES_COUNT);
        expect(toolSpy.setSidesCount).toHaveBeenCalled();
    });

    it('setPrimaryColorTools should call setPrimaryToolsColor of toolManager', () => {
        service.setPrimaryColorTools('blue');
        expect(toolManagerSpy.setPrimaryColorTools).toHaveBeenCalled();
    });

    it('setSecondaryColorTools should call setPrimaryToolsColor of toolManager', () => {
        service.setSecondaryColorTools('blue');
        expect(toolManagerSpy.setSecondaryColorTools).toHaveBeenCalled();
    });

    it('setWaterDropWidth should call setWaterDropWidth of toolManager', () => {
        const EXPECTED_WATER_DROP_WIDTH = 50;
        service.setWaterDropWidth(EXPECTED_WATER_DROP_WIDTH);
        expect(toolSpy.setWaterDropWidth).toHaveBeenCalled();
    });

    it('setEmissionCount should call setEmissionCount of toolManager', () => {
        const EXPECTED_EMISSION_COUNT = 50;
        service.setEmissionCount(EXPECTED_EMISSION_COUNT);
        expect(toolSpy.setEmissionCount).toHaveBeenCalled();
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
