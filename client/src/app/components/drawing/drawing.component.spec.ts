import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Tool } from '@app/classes/tool';
import * as CanvasConstants from '@app/constants/canvas-constants';
import { WHITE_RGBA_DECIMAL } from '@app/constants/color-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EraserService } from '@app/services/tools/eraser/eraser-service';
import { LineService } from '@app/services/tools/line/line-service';
import { PencilService } from '@app/services/tools/pencil/pencil-service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { DrawingComponent } from './drawing.component';

class ToolStub extends Tool {}

describe('DrawingComponent', () => {
    let component: DrawingComponent;
    let fixture: ComponentFixture<DrawingComponent>;
    let drawingStub: DrawingService;
    let undoRedoStub: UndoRedoService;
    let pencilStub: ToolStub;
    let eraserStub: ToolStub;
    let lineStub: ToolStub;

    beforeEach(async(() => {
        drawingStub = new DrawingService();
        undoRedoStub = new UndoRedoService(drawingStub);
        pencilStub = new ToolStub({} as DrawingService, {} as UndoRedoService);
        eraserStub = new ToolStub({} as DrawingService, {} as UndoRedoService);
        lineStub = new ToolStub({} as DrawingService, {} as UndoRedoService);

        TestBed.configureTestingModule({
            declarations: [DrawingComponent],
            providers: [
                { provide: DrawingService, useValue: drawingStub },
                { provide: UndoRedoService, useValue: undoRedoStub },
                { provide: PencilService, useValue: pencilStub },
                { provide: EraserService, useValue: eraserStub },
                { provide: LineService, useValue: lineStub },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DrawingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize baseCanvas with a white background', () => {
        const baseCtx: CanvasRenderingContext2D = component.baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        const pixelBuffer = new Uint32Array(baseCtx.getImageData(0, 0, component.baseWidth, component.baseHeight).data.buffer);
        const isWhite = !pixelBuffer.some((color) => color !== WHITE_RGBA_DECIMAL);
        expect(isWhite).toBeTrue();
    });

    it('should have a default WIDTH and HEIGHT', () => {
        const height = component.baseHeight;
        const width = component.baseWidth;
        expect(height).toEqual(CanvasConstants.DEFAULT_HEIGHT);
        expect(width).toEqual(CanvasConstants.DEFAULT_WIDTH);
    });

    it('previewCanvas should have a default WIDTH and HEIGHT', () => {
        const height = component.previewHeight;
        const width = component.previewWidth;
        expect(height).toEqual(CanvasConstants.DEFAULT_HEIGHT);
        expect(width).toEqual(CanvasConstants.DEFAULT_WIDTH);
    });

    it('should get pencilStub', () => {
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
        const keyboardEventSpy = spyOn(pencilStub, 'onKeyboardPress').and.callThrough();
        component.onKeyboardPress(keyboardEvent);

        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(keyboardEvent);
    });

    it("should call the tool's keyboard down when receiving a keyboard down event", () => {
        const keyboardEvent = {} as KeyboardEvent;
        const keyboardEventSpy = spyOn(pencilStub, 'onKeyboardDown').and.callThrough();
        component.onKeyboardDown(keyboardEvent);

        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(keyboardEvent);
    });

    it("should call the tool's keyboard up when receiving a keyboard up event", () => {
        const keyboardEvent = {} as KeyboardEvent;
        const keyboardEventSpy = spyOn(pencilStub, 'onKeyboardUp').and.callThrough();
        component.onKeyboardUp(keyboardEvent);

        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(keyboardEvent);
    });

    it("should call the tool's mouse click when receiving a mouse click event", () => {
        const mouseEvent = {} as MouseEvent;
        const mouseEventSpy = spyOn(pencilStub, 'onMouseClick').and.callThrough();
        component.onMouseClick(mouseEvent);

        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(mouseEvent);
    });

    it("should call the tool's mouse double click when receiving a mouse double click event", () => {
        const mouseEvent = {} as MouseEvent;
        const mouseEventSpy = spyOn(pencilStub, 'onMouseDoubleClick').and.callThrough();
        component.onMouseDoubleClick(mouseEvent);

        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(mouseEvent);
    });

    it("should call the tool's mouse leave when receiving a mouse leave event", () => {
        const mouseEvent = {} as MouseEvent;
        const mouseEventSpy = spyOn(pencilStub, 'onMouseLeave').and.callThrough();
        component.onMouseLeave(mouseEvent);

        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(mouseEvent);
    });

    it("should call the tool's mouse enter when receiving a mouse leave event", () => {
        const mouseEvent = {} as MouseEvent;
        const mouseEventSpy = spyOn(pencilStub, 'onMouseEnter').and.callThrough();
        component.onMouseEnter(mouseEvent);

        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(mouseEvent);
    });

    it('should call onContextmenu when receiving a contextmenu event', () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault']);
        component.onContextMenu(eventSpy);

        expect(eventSpy.preventDefault).toHaveBeenCalled();
    });

    it('changeCursor should set cursor to none if eraserService selected', () => {
        const canvasStyle = component.previewCanvas.nativeElement.style;
        component.changeCursor(eraserStub);
        expect(canvasStyle.cursor).toBe('none');
    });

    it('changeCursor should set cursor to pencil-icon if pencilService selected', () => {
        const canvasStyle = component.previewCanvas.nativeElement.style;
        component.changeCursor(pencilStub);
        expect(canvasStyle.cursor).toBe('url("assets/pencil.png") 0 15, auto');
    });

    it('changeCursor should set cursor to crosshair if not eraser or pencil selected', () => {
        const canvasStyle = component.previewCanvas.nativeElement.style;
        component.changeCursor(lineStub);
        expect(canvasStyle.cursor).toBe('crosshair');
    });
});
