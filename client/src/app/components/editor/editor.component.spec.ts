import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Tool } from '@app/classes/tool';
import { DrawingComponent } from '@app/components/drawing/drawing.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';
import { PencilService } from '@app/services/tools/pencil-service';
import { EditorComponent } from './editor.component';

class ToolStub extends Tool {}

describe('EditorComponent', () => {
    let component: EditorComponent;
    let fixture: ComponentFixture<EditorComponent>;
    let toolStub: ToolStub;
    let toolManagerStub: ToolManagerService;
    let drawingStub: DrawingService;

    beforeEach(async(() => {
        toolStub = new ToolStub({} as DrawingService);
        toolManagerStub = new ToolManagerService(new PencilService(drawingStub));
        TestBed.configureTestingModule({
            declarations: [EditorComponent, DrawingComponent, SidebarComponent],
            providers: [
                { provide: ToolManagerService, useValue: toolManagerStub },
                { provide: PencilService, useValue: toolStub },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call tool manager select tool when receiving a keyboard event', () => {
        const keyboardEvent = { key: 'c' } as KeyboardEvent;
        const keyboardEventSpy = spyOn(toolManagerStub, 'selectTool').and.callThrough();
        component.onKeyboardPress(keyboardEvent);
        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(keyboardEvent);
    });
});
