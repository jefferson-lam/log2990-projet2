import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Tool } from '@app/classes/tool';
import { DrawingComponent } from '@app/components/drawing/drawing.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';
import { EditorComponent } from './editor.component';

class ToolStub extends Tool {}

describe('EditorComponent', () => {
    let component: EditorComponent;
    let fixture: ComponentFixture<EditorComponent>;
    let keyboardEventSpy: jasmine.Spy;
    let toolManagerServiceSpy: jasmine.SpyObj<ToolManagerService>;
    let dialogSpy: jasmine.SpyObj<MatDialog>;
    let toolStub: ToolStub;

    beforeEach(async(() => {
        toolManagerServiceSpy = jasmine.createSpyObj('ToolManagerService', ['selectTool']);
        dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

        TestBed.configureTestingModule({
            declarations: [EditorComponent, DrawingComponent, SidebarComponent],
            providers: [
                { provide: MatDialog, useValue: dialogSpy },
                { provide: ToolManagerService, useValue: toolManagerServiceSpy },
                { provide: Tool, useValue: toolStub },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        keyboardEventSpy = spyOn(component, 'onKeyboardPress').and.callThrough();
        toolStub = new ToolStub({} as DrawingService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it("should call select tool when '1' key pressed", () => {
        const event = { key: '1' } as KeyboardEvent;
        component.onKeyboardPress(event);

        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(event);
        expect(toolManagerServiceSpy.selectTool).toHaveBeenCalled();
        expect(toolManagerServiceSpy.selectTool).toHaveBeenCalledWith(event);
    });

    it("should call select tool when '2' key pressed", () => {
        const event = { key: '2' } as KeyboardEvent;
        component.onKeyboardPress(event);

        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(event);
        expect(toolManagerServiceSpy.selectTool).toHaveBeenCalled();
        expect(toolManagerServiceSpy.selectTool).toHaveBeenCalledWith(event);
    });

    it("should call select tool when 'c' key pressed", () => {
        const event = { key: 'c' } as KeyboardEvent;
        component.onKeyboardPress(event);

        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(event);
        expect(toolManagerServiceSpy.selectTool).toHaveBeenCalled();
        expect(toolManagerServiceSpy.selectTool).toHaveBeenCalledWith(event);
    });

    it("should call select tool when 'l' key pressed", () => {
        const event = { key: 'l' } as KeyboardEvent;
        component.onKeyboardPress(event);

        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(event);
        expect(toolManagerServiceSpy.selectTool).toHaveBeenCalled();
        expect(toolManagerServiceSpy.selectTool).toHaveBeenCalledWith(event);
    });

    it("should call select tool when 'e' key pressed", () => {
        const event = { key: 'e' } as KeyboardEvent;
        component.onKeyboardPress(event);

        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(event);
        expect(toolManagerServiceSpy.selectTool).toHaveBeenCalled();
        expect(toolManagerServiceSpy.selectTool).toHaveBeenCalledWith(event);
    });

    it("should call openModalPopUp when 'ctrl+o' key pressed", () => {
        const event = { ctrlKey: true, key: 'o' } as KeyboardEvent;
        const modalPopUpSpy = spyOn(component, 'openModalPopUp');
        component.onKeyboardPress(event);

        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(event);
        expect(modalPopUpSpy).toHaveBeenCalled();
    });

    it("should not call openModalPopUp when only 'ctrl' key pressed", () => {
        const event = { ctrlKey: true, key: '' } as KeyboardEvent;
        const modalPopUpSpy = spyOn(component, 'openModalPopUp');
        component.onKeyboardPress(event);

        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(event);
        expect(modalPopUpSpy).not.toHaveBeenCalled();
    });
    it("should not call openModalPopUp when only 'o' key pressed", () => {
        const event = { ctrlKey: false, key: 'o' } as KeyboardEvent;
        const modalPopUpSpy = spyOn(component, 'openModalPopUp');
        component.onKeyboardPress(event);

        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(event);
        expect(modalPopUpSpy).not.toHaveBeenCalled();
    });

    it('updateToolFromSidebarClick should set current tool', () => {
        component.updateToolFromSidebarClick(toolStub);

        expect(component.currentTool).toBe(toolStub);
    });

    it('toggleNewDrawing calls openModalPopUp', () => {
        const modalPopUpSpy = spyOn(component, 'openModalPopUp');
        component.toggleNewDrawing(true);

        expect(modalPopUpSpy).toHaveBeenCalled();
    });

    it('openModalPopUp should toggle newDrawingTrue', () => {
        component.isNewDrawing = true;
        component.openModalPopUp();

        expect(component.isNewDrawing).toBeFalse();
    });

    it('openModalPopUp should open newDialog if isNewDrawing', () => {
        component.isNewDrawing = false;
        component.openModalPopUp();

        expect(component.isNewDrawing).toBeTrue();
        expect(dialogSpy.open).toHaveBeenCalled();
    });
});
