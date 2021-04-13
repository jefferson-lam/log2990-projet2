import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Tool } from '@app/classes/tool';
import { DrawingComponent } from '@app/components/drawing/drawing.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { RECTANGLE_SELECTION_KEY } from '@app/constants/tool-manager-constants';
import { CanvasGridService } from '@app/services/canvas-grid/canvas-grid.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PopupManagerService } from '@app/services/manager/popup-manager.service';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';
import { RectangleService } from '@app/services/tools/rectangle/rectangle-service';
import { RectangleSelectionService } from '@app/services/tools/selection/rectangle/rectangle-selection-service';
import { ResizerHandlerService } from '@app/services/tools/selection/resizer/resizer-handler.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { EditorComponent } from './editor.component';

class ToolStub extends Tool {}

// tslint:disable:no-string-literal
// tslint:disable:no-any
// tslint:disable:max-file-line-count
describe('EditorComponent', () => {
    let component: EditorComponent;
    let fixture: ComponentFixture<EditorComponent>;
    let toolStub: ToolStub;
    let rectangleSelectionService: RectangleSelectionService;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let keyboardEventSpy: jasmine.Spy;
    let popupManagerSpy: jasmine.SpyObj<PopupManagerService>;
    let toolManagerSpy: jasmine.SpyObj<ToolManagerService>;
    let canvasGridServiceSpy: jasmine.SpyObj<CanvasGridService>;
    let undoSpy: jasmine.Spy;
    let redoSpy: jasmine.Spy;
    let undoSelectionSpy: jasmine.Spy;
    let selectAllSpy: jasmine.Spy;

    beforeEach(async(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        toolStub = new ToolStub(drawServiceSpy as DrawingService, {} as UndoRedoService);
        toolManagerSpy = jasmine.createSpyObj('ToolManagerService', ['getTool', 'selectTool', 'setPrimaryColorTools', 'setSecondaryColorTools']);
        popupManagerSpy = jasmine.createSpyObj('PopupManagerService', ['openExportPopUp', 'openSavePopUp', 'openNewDrawingPopUp'], ['isPopupOpen']);
        canvasGridServiceSpy = jasmine.createSpyObj('CanvasGridService', ['resize', 'toggleGrid', 'reduceGridSize', 'increaseGridSize']);

        TestBed.configureTestingModule({
            declarations: [EditorComponent, DrawingComponent, SidebarComponent],
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: PopupManagerService, useValue: popupManagerSpy },
                { provide: ToolManagerService, useValue: toolManagerSpy },
                { provide: Tool, useValue: toolStub },
                { provide: CanvasGridService, useValue: canvasGridServiceSpy },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditorComponent);
        component = fixture.componentInstance;
        drawServiceSpy.imageURL = '';
        fixture.detectChanges();
        keyboardEventSpy = spyOn(component, 'onKeyboardDown').and.callThrough();
        component.currentTool = toolStub;
        rectangleSelectionService = new RectangleSelectionService(
            {} as DrawingService,
            {} as UndoRedoService,
            {} as ResizerHandlerService,
            new RectangleService({} as DrawingService, {} as UndoRedoService),
        );

        undoSpy = spyOn(component.undoRedoService, 'undo');
        redoSpy = spyOn(component.undoRedoService, 'redo');

        undoSelectionSpy = spyOn(rectangleSelectionService, 'undoSelection').and.callFake(() => {
            return;
        });
        selectAllSpy = spyOn(rectangleSelectionService, 'selectAll').and.callFake(() => {
            return;
        });
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should not call select tool,undo or redo when popupManager.isPopUpOpen', () => {
        component.popupManager.isPopUpOpen = true;
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { key: '1' });
        component.onKeyboardDown(eventSpy);

        expect(toolManagerSpy.selectTool).not.toHaveBeenCalled();
        expect(undoSpy).not.toHaveBeenCalled();
        expect(redoSpy).not.toHaveBeenCalled();
    });

    it("should call select tool when '1' key is down", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { key: '1' });
        component.onKeyboardDown(eventSpy);

        expect(keyboardEventSpy).toHaveBeenCalled();
        expect(keyboardEventSpy).toHaveBeenCalledWith(eventSpy);
        expect(toolManagerSpy.selectTool).toHaveBeenCalled();
        expect(toolManagerSpy.selectTool).toHaveBeenCalledWith(eventSpy);
    });

    it("should call select tool when '2' key is down", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { key: '2' });
        component.onKeyboardDown(eventSpy);

        expect(toolManagerSpy.selectTool).toHaveBeenCalled();
        expect(toolManagerSpy.selectTool).toHaveBeenCalledWith(eventSpy);
    });

    it("should call select tool when 'c' key is down", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { key: 'c' });
        component.onKeyboardDown(eventSpy);

        expect(toolManagerSpy.selectTool).toHaveBeenCalled();
        expect(toolManagerSpy.selectTool).toHaveBeenCalledWith(eventSpy);
    });

    it("should call select tool when 'l' key is down", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { key: 'l' });
        component.onKeyboardDown(eventSpy);

        expect(toolManagerSpy.selectTool).toHaveBeenCalled();
        expect(toolManagerSpy.selectTool).toHaveBeenCalledWith(eventSpy);
    });

    it("should call select tool when 'e' key is down", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { key: 'e' });
        component.onKeyboardDown(eventSpy);

        expect(toolManagerSpy.selectTool).toHaveBeenCalled();
        expect(toolManagerSpy.selectTool).toHaveBeenCalledWith(eventSpy);
    });

    it("should call select tool when 'r' key is down", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { key: 'r' });
        component.onKeyboardDown(eventSpy);

        expect(toolManagerSpy.selectTool).toHaveBeenCalled();
        expect(toolManagerSpy.selectTool).toHaveBeenCalledWith(eventSpy);
    });

    it('showGridOnCanvas should set isGridDisplayed to false if initially true and call canvasGridService', () => {
        component.showGridOnCanvas();
        expect(canvasGridServiceSpy.toggleGrid).toHaveBeenCalled();
    });

    it('showGridOnCanvas should set isGridDisplayed to true if initially false and call canvasGridService', () => {
        component.showGridOnCanvas();
        expect(canvasGridServiceSpy.toggleGrid).toHaveBeenCalled();
    });

    it('reduceGridSize should call canvasGridService reduceGridSize', () => {
        component.reduceGridSize();
        expect(canvasGridServiceSpy.reduceGridSize).toHaveBeenCalled();
    });

    it('increaseGridSize should call canvasGridService increaseGridSize', () => {
        component.increaseGridSize();
        expect(canvasGridServiceSpy.increaseGridSize).toHaveBeenCalled();
    });

    it('should prevent keydown default when ctrl+relevant key is down', () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: true, code: '', key: '' });
        component.onCtrlZKeyDown(eventSpy);
        component.onCtrlOKeyDown(eventSpy);
        component.onCtrlEKeyDown(eventSpy);
        component.onCtrlShiftZKeyDown(eventSpy);
        component.onCtrlAKeyDown(eventSpy);

        expect(eventSpy.preventDefault).toHaveBeenCalled();
    });

    it("'ctrl+o' should call openNewDrawingPopUp", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: true, code: 'KeyO', key: '' });
        component.onCtrlOKeyDown(eventSpy);

        expect(popupManagerSpy.openNewDrawingPopUp).toHaveBeenCalled();
        expect(eventSpy['preventDefault']).toHaveBeenCalled();
    });

    it('ctrl+z should call undoSelection from SelectionService if isManipulating is true', () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: true, code: 'KeyO', key: 'z' });
        rectangleSelectionService.isManipulating = true;
        component.currentTool = rectangleSelectionService;
        component.onCtrlZKeyDown(eventSpy);
        expect(undoSelectionSpy).toHaveBeenCalled();
    });

    it('ctrl+z should not call undoSelection from SelectionService if isManipulating is true', () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: true, code: 'KeyO', key: 'z' });
        rectangleSelectionService.isManipulating = false;
        component.currentTool = rectangleSelectionService;
        component.onCtrlZKeyDown(eventSpy);
        expect(undoSelectionSpy).not.toHaveBeenCalled();
        expect(undoSpy).toHaveBeenCalled();
    });

    it('ctrl+z should not call standard undo if isUndoSelection is set to true', () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: true, code: 'KeyO', key: 'z' });
        component.isUndoSelection = true;
        component.onCtrlZKeyDown(eventSpy);
        expect(undoSpy).not.toHaveBeenCalled();
    });

    it("should not call openExportPopUp or openNewDrawingPopUp when only 'ctrl' key is down", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: true, code: '', key: '' });
        component.onKeyboardDown(eventSpy);

        expect(popupManagerSpy.openExportPopUp).not.toHaveBeenCalled();
        expect(popupManagerSpy.openNewDrawingPopUp).not.toHaveBeenCalled();
    });

    it("should not call openNewDrawingPopUp when only 'o' key is down", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: false, code: 'KeyO', key: '' });
        component.onKeyboardDown(eventSpy);

        expect(popupManagerSpy.openNewDrawingPopUp).not.toHaveBeenCalled();
    });

    it("should call undo when 'ctrl+z' keys are down and tool isn't used and no popups open", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: true, code: 'KeyZ', key: '' });
        component.currentTool.mouseDown = false;
        component.onCtrlZKeyDown(eventSpy);

        expect(undoSpy).toHaveBeenCalled();
        expect(redoSpy).not.toHaveBeenCalled();
    });

    it("should call redo when 'ctrl+shift+z' keys are down and tool isn't used and no popups open", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: true, shiftKey: true, code: 'KeyZ', key: '' });
        component.currentTool.mouseDown = false;
        component.onCtrlShiftZKeyDown(eventSpy);

        expect(undoSpy).not.toHaveBeenCalled();
        expect(redoSpy).toHaveBeenCalled();
    });

    it("should not call undo when 'ctrl+z' keys are down and tool is used", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: true, code: 'KeyZ', key: '' });

        component.currentTool.inUse = true;
        component.onCtrlZKeyDown(eventSpy);

        expect(undoSpy).not.toHaveBeenCalled();
        expect(redoSpy).not.toHaveBeenCalled();
    });

    it("should not call redo when 'ctrl+shift+z' keys are down and tool is used", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: true, shiftKey: true, code: 'KeyZ', key: '' });
        component.currentTool.inUse = true;
        component.onCtrlShiftZKeyDown(eventSpy);

        expect(undoSpy).not.toHaveBeenCalled();
        expect(redoSpy).not.toHaveBeenCalled();
    });

    it("should not call undo or redo when only 'z' key is down", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: false, code: 'KeyZ', key: '' });
        component.onKeyboardDown(eventSpy);

        expect(undoSpy).not.toHaveBeenCalled();
        expect(redoSpy).not.toHaveBeenCalled();
    });

    it("should not call undo or redo when only 'ctrl' key is down", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: true, code: '', key: '' });
        component.onKeyboardDown(eventSpy);

        expect(undoSpy).not.toHaveBeenCalled();
        expect(redoSpy).not.toHaveBeenCalled();
    });

    it("should not call undo or redo when only 'shift' key is down", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: false, shiftKey: true, code: '', key: '' });
        component.onKeyboardDown(eventSpy);

        expect(undoSpy).not.toHaveBeenCalled();
        expect(redoSpy).not.toHaveBeenCalled();
    });

    it('setTool should set current tool', () => {
        component.setTool(toolStub);
        expect(component.currentTool).toBe(toolStub);
    });

    it('ctrl+a should call selectAll and switch to RectangleSelectionService', () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: true, shiftKey: true, code: '', key: 'a' });
        const setToolSpy = spyOn(component, 'setTool').and.callFake(() => {
            component.currentTool = rectangleSelectionService;
        });
        component.onCtrlAKeyDown(eventSpy);
        expect(setToolSpy).toHaveBeenCalled();
        expect(selectAllSpy).toHaveBeenCalled();
    });

    it("'ctrl+e' should call openExportPopUp", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: true, code: 'KeyE', key: '' });
        component.onCtrlEKeyDown(eventSpy);

        expect(popupManagerSpy.openExportPopUp).toHaveBeenCalled();
        expect(eventSpy['preventDefault']).toHaveBeenCalled();
    });

    it("'ctrl+s' should call openSavePopUp", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: true, code: 'KeyS', key: '' });
        component.onCtrlSKeyDown(eventSpy);

        expect(popupManagerSpy.openSavePopUp).toHaveBeenCalled();
        expect(eventSpy['preventDefault']).toHaveBeenCalled();
    });

    it('ctrl+a should switch the current tool to rectangleSelection and call its selectAll method', () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: true, code: 'KeyE', key: '' });
        component.onCtrlAKeyDown(eventSpy);
        expect(toolManagerSpy.getTool).toHaveBeenCalled();
        expect(toolManagerSpy.getTool).toHaveBeenCalledWith(RECTANGLE_SELECTION_KEY);
    });

    it('should not call selectTool if a non tool key is down.', () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { key: 'u' });
        component.onKeyboardDown(eventSpy);

        expect(toolManagerSpy.selectTool).not.toHaveBeenCalled();
    });
});
