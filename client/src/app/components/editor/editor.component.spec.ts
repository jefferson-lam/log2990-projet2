import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Tool } from '@app/classes/tool';
import { DrawingComponent } from '@app/components/drawing/drawing.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { CanvasGridService } from '@app/services/canvas-grid/canvas-grid.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PopupManagerService } from '@app/services/manager/popup-manager.service';
import { ShortcutManagerService } from '@app/services/manager/shortcut-manager.service';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { EditorComponent } from './editor.component';

class ToolStub extends Tool {}

// tslint:disable:no-string-literal
describe('EditorComponent', () => {
    let component: EditorComponent;
    let fixture: ComponentFixture<EditorComponent>;
    let toolStub: ToolStub;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    // let keyboardEventSpy: jasmine.Spy;
    let popupManagerSpy: jasmine.SpyObj<PopupManagerService>;
    let toolManagerSpy: jasmine.SpyObj<ToolManagerService>;
    let canvasGridServiceSpy: jasmine.SpyObj<CanvasGridService>;
    let shortcutManagerSpy: jasmine.SpyObj<ShortcutManagerService>;

    beforeEach(async(() => {
        shortcutManagerSpy = jasmine.createSpyObj('ShortcutManagerService', [
            'onGKeyDown',
            'onCtrlAKeyDown',
            'onCtrlEKeyDown',
            'onCtrlGKeyDown',
            'onCtrlOKeyDown',
            'onCtrlSKeyDown',
            'onCtrlShiftZKeyDown',
            'onCtrlZKeyDown',
            'onMinusKeyDown',
            'onPlusKeyDown',
            'onEqualKeyDown',
            'onKeyboardDown',
            'onAltUp',
            'onAltDown',
        ]);
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        toolStub = new ToolStub(drawServiceSpy as DrawingService, {} as UndoRedoService);
        toolManagerSpy = jasmine.createSpyObj('ToolManagerService', ['getTool', 'selectTool', 'setPrimaryColorTools', 'setSecondaryColorTools']);
        popupManagerSpy = jasmine.createSpyObj('PopupManagerService', ['openExportPopUp', 'openSavePopUp', 'openNewDrawingPopUp'], ['isPopupOpen']);
        canvasGridServiceSpy = jasmine.createSpyObj('CanvasGridService', ['resize', 'toggleGrid', 'reduceGridSize', 'increaseGridSize']);

        TestBed.configureTestingModule({
            declarations: [EditorComponent],
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: PopupManagerService, useValue: popupManagerSpy },
                { provide: ToolManagerService, useValue: toolManagerSpy },
                { provide: Tool, useValue: toolStub },
                { provide: CanvasGridService, useValue: canvasGridServiceSpy },
                { provide: ShortcutManagerService, useValue: shortcutManagerSpy },
                { provide: SidebarComponent, useValue: {} },
                { provide: DrawingComponent, useValue: {} },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditorComponent);
        component = fixture.componentInstance;
        drawServiceSpy.imageURL = '';
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it("should call shortcutManger.onKeyboardDown when '1' key is down", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { key: '1' });
        component.onKeyboardDown(eventSpy);

        expect(shortcutManagerSpy.onKeyboardDown).toHaveBeenCalled();
        expect(shortcutManagerSpy.onKeyboardDown).toHaveBeenCalledWith(eventSpy);
    });

    it("should call shortcutManger.onKeyboardDown when '2' key is down", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { key: '2' });
        component.onKeyboardDown(eventSpy);

        expect(shortcutManagerSpy.onKeyboardDown).toHaveBeenCalled();
        expect(shortcutManagerSpy.onKeyboardDown).toHaveBeenCalledWith(eventSpy);
    });

    it("should call shortcutManger.onKeyboardDown when 'c' key is down", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { key: 'c' });
        component.onKeyboardDown(eventSpy);

        expect(shortcutManagerSpy.onKeyboardDown).toHaveBeenCalled();
        expect(shortcutManagerSpy.onKeyboardDown).toHaveBeenCalledWith(eventSpy);
    });

    it("should call shortcutManger.onKeyboardDown when 'l' key is down", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { key: 'l' });
        component.onKeyboardDown(eventSpy);

        expect(shortcutManagerSpy.onKeyboardDown).toHaveBeenCalled();
        expect(shortcutManagerSpy.onKeyboardDown).toHaveBeenCalledWith(eventSpy);
    });

    it("should call shortcutManger.onKeyboardDown when 'e' key is down", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { key: 'e' });
        component.onKeyboardDown(eventSpy);

        expect(shortcutManagerSpy.onKeyboardDown).toHaveBeenCalled();
        expect(shortcutManagerSpy.onKeyboardDown).toHaveBeenCalledWith(eventSpy);
    });

    it("should call shortcutManger.onKeyboardDown when 'r' key is down", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { key: 'r' });
        component.onKeyboardDown(eventSpy);

        expect(shortcutManagerSpy.onKeyboardDown).toHaveBeenCalled();
        expect(shortcutManagerSpy.onKeyboardDown).toHaveBeenCalledWith(eventSpy);
    });

    it('onGKeyDown should call shortcutManager.onGKeyDown', () => {
        component.onGKeyDown();
        expect(shortcutManagerSpy.onGKeyDown).toHaveBeenCalled();
    });

    it('onMinusKeyDown should call shortcutManager.onMinusKeyDown', () => {
        component.onMinusKeyDown();
        expect(shortcutManagerSpy.onMinusKeyDown).toHaveBeenCalled();
    });

    it('onEqualKeyDown should call shortcutManager.onEqualKeyDown', () => {
        component.onEqualKeyDown();
        expect(shortcutManagerSpy.onEqualKeyDown).toHaveBeenCalled();
    });

    it('onPlusKeyDown should call shortcutManager.onPlusKeyDown', () => {
        component.onPlusKeyDown();
        expect(shortcutManagerSpy.onPlusKeyDown).toHaveBeenCalled();
    });

    it("should call shortcutManger.onCtrlOKeyDown when 'ctrl+o' key is down", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: true, code: 'KeyO', key: '' });
        component.onCtrlOKeyDown(eventSpy);

        expect(shortcutManagerSpy.onCtrlOKeyDown).toHaveBeenCalled();
        expect(shortcutManagerSpy.onCtrlOKeyDown).toHaveBeenCalledWith(eventSpy);
    });

    it('ctrl+a should call shortcutManager.onCtrlAKeyDown', () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: true, shiftKey: true, code: '', key: 'a' });
        component.onCtrlAKeyDown(eventSpy);
        expect(shortcutManagerSpy.onCtrlAKeyDown).toHaveBeenCalled();
        expect(shortcutManagerSpy.onCtrlAKeyDown).toHaveBeenCalledWith(eventSpy);
    });

    it('ctrl+e should call shortcutManager.onCtrlEKeyDown', () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: true, code: 'KeyE', key: '' });
        component.onCtrlEKeyDown(eventSpy);

        expect(shortcutManagerSpy.onCtrlEKeyDown).toHaveBeenCalled();
    });

    it("'ctrl+g' should call shortcutManager.onCtrlGKeyDown", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: true, code: 'KeyG', key: '' });
        component.onCtrlGKeyDown(eventSpy);

        expect(shortcutManagerSpy.onCtrlGKeyDown).toHaveBeenCalled();
    });

    it("'ctrl+shift+z' should call shortcutManager.onCtrlShiftZKeyDown", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: true, code: 'KeyZ', key: '' });
        component.onCtrlShiftZKeyDown(eventSpy);

        expect(shortcutManagerSpy.onCtrlShiftZKeyDown).toHaveBeenCalled();
    });

    it("'ctrl+z' should call shortcutManager.onCtrlZKeyDown", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: true, code: 'KeyZ', key: '' });
        component.onCtrlZKeyDown(eventSpy);

        expect(shortcutManagerSpy.onCtrlZKeyDown).toHaveBeenCalled();
    });

    it("'ctrl+s' should call openSavePopUp", () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: true, code: 'KeyS', key: '' });
        component.onCtrlSKeyDown(eventSpy);

        expect(shortcutManagerSpy.onCtrlSKeyDown).toHaveBeenCalled();
    });

    it('should not call shortcutManager.onKeyboardDown if ctrl key is down.', () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { ctrlKey: true });
        component.onKeyboardDown(eventSpy);

        expect(shortcutManagerSpy.onKeyboardDown).not.toHaveBeenCalled();
    });

    it('alt key down should call shortcutManager.setStampAngleAlt', () => {
        const eventSpy = jasmine.createSpyObj('event', ['preventDefault'], { key: 'alt' });
        component.onAltDown(eventSpy);
        expect(shortcutManagerSpy.onAltDown).toHaveBeenCalledWith(eventSpy);
    });

    it('alt key up should call shortcutManager.setStampAngleNormal', () => {
        component.onAltUp();
        expect(shortcutManagerSpy.onAltUp).toHaveBeenCalled();
    });
});
