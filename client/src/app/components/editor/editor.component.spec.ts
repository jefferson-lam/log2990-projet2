import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Tool } from '@app/classes/tool';
import { DrawingComponent } from '@app/components/drawing/drawing.component';
import { ExportDrawingComponent } from '@app/components/sidebar/export-drawing/export-drawing.component';
import { NewDrawingBoxComponent } from '@app/components/sidebar/new-drawing-box/new-drawing-box.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { MAX_HEIGHT_FORM, MAX_WIDTH_FORM } from '@app/constants/popup-constants';
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

    it('should prevent keydown default when ctrl is down', () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: true, code: '', key: '' });
        component.onKeyboardDown(eventSpy);

        expect(eventSpy.preventDefault).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(eventSpy);
    });

    it("should call openModalPopUp with argument 'new' when 'ctrl+o' key is down", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: true, code: 'KeyO', key: '' });
        const modalPopUpSpy = spyOn(component, 'openModalPopUp');
        component.onKeyboardDown(eventSpy);

        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(eventSpy);
        expect(modalPopUpSpy).toHaveBeenCalled();
        expect(modalPopUpSpy).toHaveBeenCalledWith('new');
    });

    it("should call openModalPopUp with argument 'export' when 'ctrl+e' key is down", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: true, code: 'KeyE', key: '' });
        const modalPopUpSpy = spyOn(component, 'openModalPopUp');
        component.onKeyboardDown(eventSpy);

        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(eventSpy);
        expect(modalPopUpSpy).toHaveBeenCalled();
        expect(modalPopUpSpy).toHaveBeenCalledWith('export');
    });

    it("should not call openModalPopUp when only 'ctrl' key is down", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: true, code: '', key: '' });
        const modalPopUpSpy = spyOn(component, 'openModalPopUp');
        component.onKeyboardDown(eventSpy);

        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(eventSpy);
        expect(modalPopUpSpy).not.toHaveBeenCalled();
    });
    it("should not call openModalPopUp when only 'o' key is down", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: false, code: 'KeyO', key: '' });
        const modalPopUpSpy = spyOn(component, 'openModalPopUp');
        component.onKeyboardDown(eventSpy);

        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(eventSpy);
        expect(modalPopUpSpy).not.toHaveBeenCalled();
    });

    it("should call undo when 'ctrl+z' keys are down and tool isn't used", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: true, code: 'KeyZ', key: '' });
        const undoSpy = spyOn(component.undoRedoService, 'undo');
        const redoSpy = spyOn(component.undoRedoService, 'redo');
        component.currentTool.mouseDown = false;
        component.onKeyboardDown(eventSpy);

        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(eventSpy);
        expect(undoSpy).toHaveBeenCalled();
        expect(redoSpy).not.toHaveBeenCalled();
    });

    it("should call redo when 'ctrl+shift+z' keys are down and tool isn't used", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: true, shiftKey: true, code: 'KeyZ', key: '' });
        const undoSpy = spyOn(component.undoRedoService, 'undo');
        const redoSpy = spyOn(component.undoRedoService, 'redo');
        component.currentTool.mouseDown = false;
        component.onKeyboardDown(eventSpy);

        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(eventSpy);
        expect(undoSpy).not.toHaveBeenCalled();
        expect(redoSpy).toHaveBeenCalled();
    });

    it("should not call undo when 'ctrl+z' keys are down and tool is used", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: true, code: 'KeyZ', key: '' });
        const undoSpy = spyOn(component.undoRedoService, 'undo');
        const redoSpy = spyOn(component.undoRedoService, 'redo');
        component.currentTool.inUse = true;
        component.onKeyboardDown(eventSpy);

        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(eventSpy);
        expect(undoSpy).not.toHaveBeenCalled();
        expect(redoSpy).not.toHaveBeenCalled();
    });

    it("should not call redo when 'ctrl+shift+z' keys are down and tool is used", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: true, shiftKey: true, code: 'KeyZ', key: '' });
        const undoSpy = spyOn(component.undoRedoService, 'undo');
        const redoSpy = spyOn(component.undoRedoService, 'redo');
        component.currentTool.inUse = true;
        component.onKeyboardDown(eventSpy);

        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(eventSpy);
        expect(undoSpy).not.toHaveBeenCalled();
        expect(redoSpy).not.toHaveBeenCalled();
    });

    it("should not call undo or redo when only 'z' key is down", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: false, code: 'KeyZ', key: '' });
        const undoSpy = spyOn(component.undoRedoService, 'undo');
        const redoSpy = spyOn(component.undoRedoService, 'redo');
        component.onKeyboardDown(eventSpy);

        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(eventSpy);
        expect(undoSpy).not.toHaveBeenCalled();
        expect(redoSpy).not.toHaveBeenCalled();
    });

    it("should not call undo or redo when only 'ctrl' key is down", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: true, code: '', key: '' });
        const undoSpy = spyOn(component.undoRedoService, 'undo');
        const redoSpy = spyOn(component.undoRedoService, 'redo');
        component.onKeyboardDown(eventSpy);

        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(eventSpy);
        expect(undoSpy).not.toHaveBeenCalled();
        expect(redoSpy).not.toHaveBeenCalled();
    });

    it("should not call undo or redo when only 'shift' key is down", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: false, shiftKey: true, code: '', key: '' });
        const undoSpy = spyOn(component.undoRedoService, 'undo');
        const redoSpy = spyOn(component.undoRedoService, 'redo');
        component.onKeyboardDown(eventSpy);

        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(eventSpy);
        expect(undoSpy).not.toHaveBeenCalled();
        expect(redoSpy).not.toHaveBeenCalled();
    });

    it('updateToolFromSidebarClick should set current tool', () => {
        component.updateToolFromSidebarClick(toolStub);
        expect(component.currentTool).toBe(toolStub);
    });

    it("openModalPopUp should open NewDrawingBoxComponent if canvas isn't empty and type of popUp is new", () => {
        const emptyCanvasSpy = spyOn(component, 'isCanvasEmpty').and.callFake(() => {
            return false;
        });
        const mockConfig = { width: '100px', height: '200px' };
        component.openModalPopUp('new');

        expect(emptyCanvasSpy).toHaveBeenCalled();
        expect(dialogSpy.open).toHaveBeenCalled();
        expect(dialogSpy.open).toHaveBeenCalledWith(NewDrawingBoxComponent, mockConfig);
    });

    it("openModalPopUp should open ExportDrawingComponent if canvas isn't empty and type of popUp is export", () => {
        const emptyCanvasSpy = spyOn(component, 'isCanvasEmpty').and.callFake(() => {
            return false;
        });
        const mockConfig = { maxWidth: MAX_WIDTH_FORM + 'px', maxHeight: MAX_HEIGHT_FORM + 'px' };
        component.openModalPopUp('export');

        expect(emptyCanvasSpy).toHaveBeenCalled();
        expect(dialogSpy.open).toHaveBeenCalled();
        expect(dialogSpy.open).toHaveBeenCalledWith(ExportDrawingComponent, mockConfig);
    });

    it('openModalPopUp should not open anything if canvas is empty', () => {
        const emptyCanvasSpy = spyOn(component, 'isCanvasEmpty').and.callFake(() => {
            return true;
        });
        component.openModalPopUp('export');

        expect(emptyCanvasSpy).toHaveBeenCalled();
        expect(dialogSpy.open).not.toHaveBeenCalled();
    });

    it('should not call selectTool if a non tool key is down.', () => {
        const event = { key: 'u' } as KeyboardEvent;
        component.onKeyboardDown(event);

        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(event);
        expect(toolManagerSpy.selectTool).not.toHaveBeenCalled();
    });

    it('isCanvasEmpty should return true if nothing has been drawn', () => {
        const isCanvasEmptySpy = spyOn(component, 'isCanvasEmpty').and.callThrough();
        const returnValue = component.isCanvasEmpty();

        expect(isCanvasEmptySpy).toHaveBeenCalled();
        expect(returnValue).toBeTrue();
    });

    it('isCanvasEmpty should return false if something has been drawn', () => {
        const isCanvasEmptySpy = spyOn(component, 'isCanvasEmpty').and.callThrough();
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, 1, 1);

        const returnValue = component.isCanvasEmpty();

        expect(isCanvasEmptySpy).toHaveBeenCalled();
        expect(returnValue).toBeFalse();
    });
});
