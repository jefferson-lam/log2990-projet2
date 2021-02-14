import { TestBed } from '@angular/core/testing';
import { Tool } from '@app/classes/tool';
import { EditorComponent } from '@app/components/editor/editor.component';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SettingsManagerService } from './settings-manager';
import { ToolManagerService } from './tool-manager-service';

// TODO: put into new class common with editorcomponent
class ToolStub extends Tool {}

// tslint:disable:no-any
describe('SettingsManagerService', () => {
    let service: SettingsManagerService;
    let editorComponent: EditorComponent;
    let toolStub: ToolStub;
    let setSizeSpy: jasmine.Spy<any>;
    let changeFillModeSpy: jasmine.Spy<any>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [EditorComponent],
            providers: [{ provide: EditorComponent, useValue: editorComponent }],
        }).compileComponents();
        service = TestBed.inject(SettingsManagerService);

        editorComponent = new EditorComponent({} as ToolManagerService, service);
        toolStub = new ToolStub({} as DrawingService);
        editorComponent.currentTool = toolStub;
        setSizeSpy = spyOn<any>(service.editorComponent.currentTool, 'setSize').and.callThrough();
        changeFillModeSpy = spyOn<any>(service.editorComponent.currentTool, 'setFillMode').and.callThrough();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('changeSizeTool should call setSize of current tool', () => {
        const EXPECTED_FILL_MODE = 2;
        service.changeSizeTool(EXPECTED_FILL_MODE);
        expect(setSizeSpy).toHaveBeenCalled();
    });

    it('changeSizeTool should call setSize of current tool', () => {
        const EXPECTED_TOOL_SIZE = 17;
        service.changeFillMode(EXPECTED_TOOL_SIZE);
        expect(changeFillModeSpy).toHaveBeenCalled();
    });
});
