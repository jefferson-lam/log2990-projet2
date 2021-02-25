import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Tool } from '@app/classes/tool';
import { DrawingComponent } from '@app/components/drawing/drawing.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { EditorComponent } from './editor.component';

class ToolStub extends Tool {}

describe('EditorComponent', () => {
    let component: EditorComponent;
    let fixture: ComponentFixture<EditorComponent>;
    let toolStub: ToolStub;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let keyboardEventSpy: jasmine.Spy;
    let dialogSpy: jasmine.SpyObj<MatDialog>;
    let toolManagerSpy: jasmine.SpyObj<ToolManagerService>;

    beforeEach(async(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        toolStub = new ToolStub(drawServiceSpy as DrawingService, {} as UndoRedoService);
        toolManagerSpy = jasmine.createSpyObj('ToolManagerService', ['getTool', 'selectTool', 'setPrimaryColorTools', 'setSecondaryColorTools']);
        dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
        TestBed.configureTestingModule({
            declarations: [EditorComponent, DrawingComponent, SidebarComponent],
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: MatDialog, useValue: dialogSpy },
                { provide: ToolManagerService, useValue: toolManagerSpy },
                { provide: Tool, useValue: toolStub },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        keyboardEventSpy = spyOn(component, 'onKeyboardDown').and.callThrough();
        component.currentTool = toolStub;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it("should call select tool when '1' key is down", () => {
        const event = { key: '1' } as KeyboardEvent;
        component.onKeyboardDown(event);

        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(event);
        expect(toolManagerSpy.selectTool).toHaveBeenCalled();
        expect(toolManagerSpy.selectTool).toHaveBeenCalledWith(event);
    });

    it("should call select tool when '2' key is down", () => {
        const event = { key: '2' } as KeyboardEvent;
        component.onKeyboardDown(event);

        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(event);
        expect(toolManagerSpy.selectTool).toHaveBeenCalled();
        expect(toolManagerSpy.selectTool).toHaveBeenCalledWith(event);
    });

    it("should call select tool when 'c' key is down", () => {
        const event = { key: 'c' } as KeyboardEvent;
        component.onKeyboardDown(event);

        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(event);
        expect(toolManagerSpy.selectTool).toHaveBeenCalled();
        expect(toolManagerSpy.selectTool).toHaveBeenCalledWith(event);
    });

    it("should call select tool when 'l' key is down", () => {
        const event = { key: 'l' } as KeyboardEvent;
        component.onKeyboardDown(event);

        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(event);
        expect(toolManagerSpy.selectTool).toHaveBeenCalled();
        expect(toolManagerSpy.selectTool).toHaveBeenCalledWith(event);
    });

    it("should call select tool when 'e' key is down", () => {
        const event = { key: 'e' } as KeyboardEvent;
        component.onKeyboardDown(event);

        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(event);
        expect(toolManagerSpy.selectTool).toHaveBeenCalled();
        expect(toolManagerSpy.selectTool).toHaveBeenCalledWith(event);
    });

    it('should prevent keydown default when ctrl+o is down', () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: true, code: 'KeyO', key: '' });
        component.onKeyboardDown(eventSpy);

        expect(eventSpy.preventDefault).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(eventSpy);
    });

    it("should call openModalPopUp when 'ctrl+o' key is down", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: true, code: 'KeyO', key: '' });
        const modalPopUpSpy = spyOn(component, 'openModalPopUp');
        component.onKeyboardDown(eventSpy);

        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(eventSpy);
        expect(modalPopUpSpy).toHaveBeenCalled();
    });

    it("should not call openModalPopUp when only 'ctrl' key is down", () => {
        const event = { ctrlKey: true, code: '', key: '' } as KeyboardEvent;
        const modalPopUpSpy = spyOn(component, 'openModalPopUp');
        component.onKeyboardDown(event);

        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(event);
        expect(modalPopUpSpy).not.toHaveBeenCalled();
    });
    it("should not call openModalPopUp when only 'o' key is down", () => {
        const event = { ctrlKey: false, code: 'KeyO', key: '' } as KeyboardEvent;
        const modalPopUpSpy = spyOn(component, 'openModalPopUp');
        component.onKeyboardDown(event);

        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(event);
        expect(modalPopUpSpy).not.toHaveBeenCalled();
    });

    it("should call undo when 'ctrl+z' keys are down and tool isn't used", () => {
        const event = { ctrlKey: true, code: 'KeyZ', key: '' } as KeyboardEvent;
        const undoSpy = spyOn(component.undoRedoService, 'undo');
        const redoSpy = spyOn(component.undoRedoService, 'redo');
        component.currentTool.mouseDown = false;
        component.onKeyboardDown(event);

        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(event);
        expect(undoSpy).toHaveBeenCalled();
        expect(redoSpy).not.toHaveBeenCalled();
    });

    it("should call redo when 'ctrl+shift+z' keys are down and tool isn't used", () => {
        const event = { ctrlKey: true, shiftKey: true, code: 'KeyZ', key: '' } as KeyboardEvent;
        const undoSpy = spyOn(component.undoRedoService, 'undo');
        const redoSpy = spyOn(component.undoRedoService, 'redo');
        component.currentTool.mouseDown = false;
        component.onKeyboardDown(event);

        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(event);
        expect(undoSpy).not.toHaveBeenCalled();
        expect(redoSpy).toHaveBeenCalled();
    });

    it("should not call undo when 'ctrl+z' keys are down and tool is used", () => {
        const event = { ctrlKey: true, code: 'KeyZ', key: '' } as KeyboardEvent;
        const undoSpy = spyOn(component.undoRedoService, 'undo');
        const redoSpy = spyOn(component.undoRedoService, 'redo');
        component.currentTool.mouseDown = true;
        component.onKeyboardDown(event);

        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(event);
        expect(undoSpy).not.toHaveBeenCalled();
        expect(redoSpy).not.toHaveBeenCalled();
    });

    it("should not call redo when 'ctrl+shift+z' keys are down and tool is used", () => {
        const event = { ctrlKey: true, shiftKey: true, code: 'KeyZ', key: '' } as KeyboardEvent;
        const undoSpy = spyOn(component.undoRedoService, 'undo');
        const redoSpy = spyOn(component.undoRedoService, 'redo');
        component.currentTool.mouseDown = true;
        component.onKeyboardDown(event);

        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(event);
        expect(undoSpy).not.toHaveBeenCalled();
        expect(redoSpy).not.toHaveBeenCalled();
    });

    it("should not call undo or redo when only 'z' key is down", () => {
        const event = { ctrlKey: false, code: 'KeyZ', key: '' } as KeyboardEvent;
        const undoSpy = spyOn(component.undoRedoService, 'undo');
        const redoSpy = spyOn(component.undoRedoService, 'redo');
        component.onKeyboardDown(event);

        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(event);
        expect(undoSpy).not.toHaveBeenCalled();
        expect(redoSpy).not.toHaveBeenCalled();
    });

    it("should not call undo or redo when only 'ctrl' key is down", () => {
        const event = { ctrlKey: true, code: '', key: '' } as KeyboardEvent;
        const undoSpy = spyOn(component.undoRedoService, 'undo');
        const redoSpy = spyOn(component.undoRedoService, 'redo');
        component.onKeyboardDown(event);

        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(event);
        expect(undoSpy).not.toHaveBeenCalled();
        expect(redoSpy).not.toHaveBeenCalled();
    });

    it("should not call undo or redo when only 'shift' key is down", () => {
        const event = { ctrlKey: false, shiftKey: true, code: '', key: '' } as KeyboardEvent;
        const undoSpy = spyOn(component.undoRedoService, 'undo');
        const redoSpy = spyOn(component.undoRedoService, 'redo');
        component.onKeyboardDown(event);

        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(event);
        expect(undoSpy).not.toHaveBeenCalled();
        expect(redoSpy).not.toHaveBeenCalled();
    });

    it('updateToolFromSidebarClick should set current tool', () => {
        component.updateToolFromSidebarClick(toolStub);
        expect(component.currentTool).toBe(toolStub);
    });

    it("openModalPopUp should open newDialog if canvas isn't empty", () => {
        const emptyCanvasSpy = spyOn(component, 'isCanvasEmpty').and.callFake(() => {
            return false;
        });
        component.openModalPopUp();

        expect(emptyCanvasSpy).toHaveBeenCalled();
        expect(dialogSpy.open).toHaveBeenCalled();
    });

    it('should not call selectTool if a non tool key is down.', () => {
        const event = { key: 'u' } as KeyboardEvent;
        component.onKeyboardDown(event);

        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(event);
        expect(toolManagerSpy.selectTool).not.toHaveBeenCalled();
    });
});
