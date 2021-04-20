import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Tool } from '@app/classes/tool';
import * as CanvasConstants from '@app/constants/canvas-constants';
import { AutoSaveService } from '@app/services/auto-save/auto-save.service';
import { CanvasGridService } from '@app/services/canvas-grid/canvas-grid.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { CursorManagerService } from '@app/services/manager/cursor-manager.service';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';
import { EraserService } from '@app/services/tools/eraser/eraser-service';
import { LineService } from '@app/services/tools/line/line-service';
import { PencilService } from '@app/services/tools/pencil/pencil-service';
import { LassoSelectionService } from '@app/services/tools/selection/lasso/lasso-selection';
import { StampService } from '@app/services/tools/stamp/stamp-service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { Subject } from 'rxjs';
import { DrawingComponent } from './drawing.component';

class ToolStub extends Tool {}

// tslint:disable:no-string-literal
// tslint:disable:no-any
describe('DrawingComponent', () => {
    let component: DrawingComponent;
    let fixture: ComponentFixture<DrawingComponent>;
    let autoSaveServiceSpy: jasmine.SpyObj<AutoSaveService>;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;
    let undoRedoServiceSpy: jasmine.SpyObj<UndoRedoService>;
    let cursorManagerSpy: jasmine.SpyObj<CursorManagerService>;
    let gridServiceSpy: jasmine.SpyObj<CanvasGridService>;
    let toolManagerSpy: jasmine.SpyObj<ToolManagerService>;

    let pencilStub: ToolStub;
    let eraserStub: ToolStub;
    let lineStub: ToolStub;
    let lassoSelectionStub: ToolStub;
    let stampStub: ToolStub;

    beforeEach(async(() => {
        autoSaveServiceSpy = jasmine.createSpyObj('AutoSaveService', ['loadDrawing']);
        autoSaveServiceSpy.loadDrawing.and.stub();
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', [''], { canvasSizeSubject: new Subject() });
        undoRedoServiceSpy = jasmine.createSpyObj('UndoRedoService', ['updateActionsAllowed']);
        cursorManagerSpy = jasmine.createSpyObj('CursorManagerService', ['changeCursor', 'onMouseEnter', 'onMouseMove', 'onMouseLeave']);
        gridServiceSpy = jasmine.createSpyObj('CanvasGridService', ['resize']);
        toolManagerSpy = jasmine.createSpyObj('ToolManagerService', [''], { currentToolSubject: new Subject() });

        // drawingStub = new DrawingService();
        pencilStub = new ToolStub(drawingServiceSpy, undoRedoServiceSpy);
        eraserStub = new ToolStub(drawingServiceSpy, undoRedoServiceSpy);
        lineStub = new ToolStub(drawingServiceSpy, undoRedoServiceSpy);
        lassoSelectionStub = new ToolStub(drawingServiceSpy, undoRedoServiceSpy);
        stampStub = new ToolStub(drawingServiceSpy, undoRedoServiceSpy);

        TestBed.configureTestingModule({
            declarations: [DrawingComponent],
            providers: [
                { provide: DrawingService, useValue: drawingServiceSpy },
                { provide: UndoRedoService, useValue: undoRedoServiceSpy },
                { provide: UndoRedoService, useValue: undoRedoServiceSpy },
                { provide: PencilService, useValue: pencilStub },
                { provide: EraserService, useValue: eraserStub },
                { provide: LineService, useValue: lineStub },
                { provide: LassoSelectionService, useValue: lassoSelectionStub },
                { provide: StampService, useValue: stampStub },
                { provide: AutoSaveService, useValue: autoSaveServiceSpy },
                { provide: CanvasGridService, useValue: gridServiceSpy },
                { provide: CursorManagerService, useValue: cursorManagerSpy },
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

    it('ngAfterViewInit should call loadDrawing of autoSaveService and private functions', () => {
        const assignContextValuesSpy = spyOn<any>(component, 'assignContextValues');
        const propagateToServiceSpy = spyOn<any>(component, 'propagateValuesToDrawingService');
        const resizeGridCanvasSpy = spyOn<any>(component, 'resizeGridCanvasOnSizeChange');
        const changeCursorSpy = spyOn<any>(component, 'changeCursorOnToolChange');
        component.ngAfterViewInit();

        expect(assignContextValuesSpy).toHaveBeenCalled();
        expect(propagateToServiceSpy).toHaveBeenCalled();
        expect(resizeGridCanvasSpy).toHaveBeenCalled();
        expect(changeCursorSpy).toHaveBeenCalled();
    });

    it('ngAfterViewInit should call autoSaveService.loadDrawing', () => {
        component.ngAfterViewInit();

        expect(autoSaveServiceSpy.loadDrawing).toHaveBeenCalled();
    });

    it('should have a default WIDTH and HEIGHT', () => {
        expect(component.defaultHeight).toEqual(CanvasConstants.DEFAULT_HEIGHT);
        expect(component.defaultWidth).toEqual(CanvasConstants.DEFAULT_WIDTH);
    });

    it('should get pencilStub', () => {
        expect(component.currentTool).toEqual(pencilStub);
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

    it("should call the tool's mouse double click when receiving a mouse double click event", () => {
        const mouseEvent = {} as MouseEvent;
        const mouseEventSpy = spyOn(pencilStub, 'onMouseDoubleClick').and.callThrough();
        component.onMouseDoubleClick(mouseEvent);

        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(mouseEvent);
    });

    it(" should call the tool's mouse move when receiving a mouse move event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(pencilStub, 'onMouseMove').and.callThrough();
        component.onMouseMove(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it('should call the cursorManager on mouse move when receiving a mouse move event', () => {
        const event = {} as MouseEvent;
        component.onMouseMove(event);
        expect(cursorManagerSpy.onMouseMove).toHaveBeenCalled();
    });

    it(" should call the tool's mouse down when receiving a mouse down event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(pencilStub, 'onMouseDown').and.callThrough();
        component.onMouseDown(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it('should call undoRedoService updateActionsAllowed when receiving a mouse down event', () => {
        const event = {} as MouseEvent;
        component.onMouseDown(event);
        expect(undoRedoServiceSpy.updateActionsAllowed).toHaveBeenCalled();
    });

    it(" should call the tool's mouse up when receiving a mouse up event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(pencilStub, 'onMouseUp').and.callThrough();
        component.onMouseUp(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it('should call undoRedoService updateActionsAllowed when receiving a mouse up event', () => {
        const event = {} as MouseEvent;
        component.onMouseUp(event);
        expect(undoRedoServiceSpy.updateActionsAllowed).toHaveBeenCalled();
    });

    it("should call the tool's mouse leave when receiving a mouse leave event", () => {
        const mouseEvent = {} as MouseEvent;
        const mouseEventSpy = spyOn(pencilStub, 'onMouseLeave').and.callThrough();
        component.onMouseLeave(mouseEvent);

        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(mouseEvent);
    });

    it('should call cursorManager onMouseLeave when receiving a mouse leave event', () => {
        const event = {} as MouseEvent;
        component.onMouseLeave(event);
        expect(cursorManagerSpy.onMouseLeave).toHaveBeenCalled();
    });

    it("should call the tool's mouse enter when receiving a mouse enter event", () => {
        const mouseEvent = {} as MouseEvent;
        const mouseEventSpy = spyOn(pencilStub, 'onMouseEnter').and.callThrough();
        component.onMouseEnter(mouseEvent);

        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(mouseEvent);
    });

    it('should call cursorManager onMouseEnter when receiving a mouse enter event', () => {
        const event = {} as MouseEvent;
        component.onMouseEnter(event);
        expect(cursorManagerSpy.onMouseEnter).toHaveBeenCalled();
    });

    it(" should call the tool's mouse wheel when receiving a mouse wheel event", () => {
        const wheelEvent = {} as WheelEvent;
        const wheelEventSpy = spyOn(stampStub, 'onMouseWheel').and.callThrough();
        component.currentTool = stampStub;
        component.onMouseWheel(wheelEvent);

        expect(wheelEventSpy).toHaveBeenCalled();
        expect(wheelEventSpy).toHaveBeenCalledWith(wheelEvent);
    });

    it('should call onContextmenu when receiving a contextmenu event', () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault']);
        component.onContextMenu(eventSpy);

        expect(eventSpy.preventDefault).toHaveBeenCalled();
    });

    it('on canvasSize change should call gridService.resize', () => {
        drawingServiceSpy.canvasSizeSubject.next([0, 0]);
        expect(gridServiceSpy.resize).toHaveBeenCalled();
    });

    it('on tool change should call changeCursor', () => {
        toolManagerSpy.currentToolSubject.next(eraserStub);
        expect(cursorManagerSpy.changeCursor).toHaveBeenCalled();
    });
});
