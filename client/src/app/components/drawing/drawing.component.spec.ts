import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Tool } from '@app/classes/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EraserService } from '@app/services/tools/eraser-service';
import { PencilService } from '@app/services/tools/pencil-service';
import { DrawingComponent } from './drawing.component';

class ToolStub extends Tool {}

// TODO : Déplacer dans un fichier accessible à tous
const DEFAULT_WIDTH = 1000;
const DEFAULT_HEIGHT = 800;

@Component({ selector: 'app-eraser', template: '' })
class EraserStubComponent {}

describe('DrawingComponent', () => {
    let component: DrawingComponent;
    let fixture: ComponentFixture<DrawingComponent>;
    let pencilStub: ToolStub;
    let eraserStub: ToolStub;
    let drawingStub: DrawingService;

    beforeEach(async(() => {
        pencilStub = new ToolStub({} as DrawingService);
        eraserStub = new ToolStub({} as DrawingService);
        drawingStub = new DrawingService();

        TestBed.configureTestingModule({
            declarations: [DrawingComponent, EraserStubComponent],
            providers: [
                { provide: PencilService, useValue: pencilStub },
                { provide: EraserService, useValue: eraserStub },
                { provide: DrawingService, useValue: drawingStub },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DrawingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    // TODO : move to editor component spec
    it('should change to eraser tool when e key pressed', () => {
        const event = { key: 'e' } as KeyboardEvent;
        const keyboardEventSpy = spyOn(component, 'onKeyPress').and.callThrough();
        component.onKeyPress(event);

        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(event);
        expect(component.currentTool).toEqual(eraserStub);
    });
    it('should change to pencil tool when c key pressed', () => {
        const event = { key: 'c' } as KeyboardEvent;
        const keyboardEventSpy = spyOn(component, 'onKeyPress').and.callThrough();
        component.onKeyPress(event);

        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(event);
        expect(component.currentTool).toEqual(pencilStub);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have a default WIDTH and HEIGHT', () => {
        const height = component.height;
        const width = component.width;
        expect(height).toEqual(DEFAULT_HEIGHT);
        expect(width).toEqual(DEFAULT_WIDTH);
    });

    it('should get stubTool', () => {
        const currentTool = component.currentTool;
        expect(currentTool).toEqual(pencilStub);
    });

    it(" should call the tool's mouse move when receiving a mouse move event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(pencilStub, 'onMouseMove').and.callThrough();
        component.onMouseMove(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it(" should call the tool's mouse down when receiving a mouse down event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(pencilStub, 'onMouseDown').and.callThrough();
        component.onMouseDown(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it(" should call the tool's mouse up when receiving a mouse up event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(pencilStub, 'onMouseUp').and.callThrough();
        component.onMouseUp(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it("should call the tool's keyboard press when receiving a keyboard press event", () => {
        const keyboardEvent = {} as KeyboardEvent;
        const keyboardEventSpy = spyOn(toolStub, 'onKeyboardPress').and.callThrough();
        component.onKeyboardPress(keyboardEvent);

        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(keyboardEvent);
    });
});
