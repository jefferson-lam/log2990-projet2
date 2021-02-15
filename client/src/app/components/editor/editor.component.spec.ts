import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { DrawingComponent } from '@app/components/drawing/drawing.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';
import { EditorComponent } from './editor.component';

describe('EditorComponent', () => {
    let component: EditorComponent;
    let fixture: ComponentFixture<EditorComponent>;
    let keyboardEventSpy: jasmine.Spy;
    let toolManagerServiceSpy: jasmine.SpyObj<ToolManagerService>;
    let dialogSpy: jasmine.SpyObj<MatDialog>;

    beforeEach(async(() => {
        toolManagerServiceSpy = jasmine.createSpyObj('ToolManagerService', ['selectTool']);
        dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

        TestBed.configureTestingModule({
            declarations: [EditorComponent, DrawingComponent, SidebarComponent],
            providers: [
                { provide: MatDialog, useValue: dialogSpy },
                { provide: ToolManagerService, useValue: toolManagerServiceSpy },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        keyboardEventSpy = spyOn(component, 'onKeyboardPress').and.callThrough();
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
});
