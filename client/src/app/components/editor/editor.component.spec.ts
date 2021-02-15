import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Tool } from '@app/classes/tool';
import { DrawingComponent } from '@app/components/drawing/drawing.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';
import { EllipseService } from '@app/services/tools/ellipse-service';
import { EraserService } from '@app/services/tools/eraser-service';
import { LineService } from '@app/services/tools/line-service';
import { PencilService } from '@app/services/tools/pencil-service';
import { RectangleService } from '@app/services/tools/rectangle-service';
import { EditorComponent } from './editor.component';

class ToolStub extends Tool {}

describe('EditorComponent', () => {
    let component: EditorComponent;
    let fixture: ComponentFixture<EditorComponent>;
    let pencilStub: ToolStub;
    let ellipseStub: ToolStub;
    let eraserStub: ToolStub;
    let lineStub: ToolStub;
    let rectangleStub: ToolStub;
    let toolManagerStub: ToolManagerService;

    beforeEach(async(() => {
        pencilStub = new ToolStub({} as DrawingService);
        eraserStub = new ToolStub({} as DrawingService);
        lineStub = new ToolStub({} as DrawingService);
        rectangleStub = new ToolStub({} as DrawingService);
        ellipseStub = new ToolStub({} as DrawingService);
        toolManagerStub = new ToolManagerService(
            pencilStub as PencilService,
            eraserStub as EraserService,
            lineStub as LineService,
            rectangleStub as RectangleService,
            ellipseStub as EllipseService,
        );
        TestBed.configureTestingModule({
            declarations: [EditorComponent, DrawingComponent, SidebarComponent],
            providers: [
                { provide: ToolManagerService, useValue: toolManagerStub },
                { provide: EllipseService, useValue: ellipseStub },
                { provide: RectangleService, useValue: rectangleStub },
                { provide: PencilService, useValue: pencilStub },
                { provide: EraserService, useValue: eraserStub },
                { provide: MatDialog },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
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

    it('should change to ellipse tool when 2 key pressed', () => {
        const event = { key: '2' } as KeyboardEvent;
        const keyboardEventSpy = spyOn(component, 'onKeyboardPress').and.callThrough();
        component.onKeyboardPress(event);

        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(event);
        expect(component.currentTool).toEqual(ellipseStub);
    });

    it('should change to eraser tool when e key pressed', () => {
        const event = { key: 'e' } as KeyboardEvent;
        const keyboardEventSpy = spyOn(component, 'onKeyboardPress').and.callThrough();
        component.onKeyboardPress(event);

        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(event);
        expect(component.currentTool).toEqual(eraserStub);
    });

    it('should change to pencil tool when c key pressed', () => {
        const event = { key: 'c' } as KeyboardEvent;
        const keyboardEventSpy = spyOn(component, 'onKeyboardPress').and.callThrough();
        component.onKeyboardPress(event);

        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(event);
        expect(component.currentTool).toEqual(pencilStub);
    });

    it('should change to rectangle tool when 1 key pressed', () => {
        const event = { key: '1' } as KeyboardEvent;
        const keyboardEventSpy = spyOn(component, 'onKeyboardPress').and.callThrough();
        component.onKeyboardPress(event);

        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(event);
        expect(component.currentTool).toEqual(rectangleStub);
    });

    it('should not change to any tools if a non tool key is pressed.', () => {
        const event = { key: 'u' } as KeyboardEvent;
        const keyboardEventSpy = spyOn(component, 'onKeyboardPress').and.callThrough();
        const toolSwitchSpy = spyOn(component.toolManager, 'selectTool').and.callThrough();
        component.onKeyboardPress(event);

        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(event);
        expect(toolSwitchSpy).not.toHaveBeenCalled();
    });
});
