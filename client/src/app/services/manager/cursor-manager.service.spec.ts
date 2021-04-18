import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Tool } from '@app/classes/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolManagerService } from '@app/services/manager/tool-manager-service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { Subject } from 'rxjs';
import { CursorManagerService } from './cursor-manager.service';

class ToolStub extends Tool {}
// tslint:disable:no-string-literal
describe('CursorManagerService', () => {
    let service: CursorManagerService;
    let canvasTestHelper: CanvasTestHelper;
    let undoRedoServiceSpy: jasmine.SpyObj<UndoRedoService>;
    let toolManagerSpy: jasmine.SpyObj<ToolManagerService>;
    let pencilStub: ToolStub;
    let eraserStub: ToolStub;
    let lineStub: ToolStub;
    let stampStub: ToolStub;
    let mockSubject: Subject<number[]>;

    beforeEach(() => {
        mockSubject = new Subject<number[]>();
        undoRedoServiceSpy = jasmine.createSpyObj('UndoRedoService', [''], {
            pileSizeSource: mockSubject,
            pileSizeObservable: mockSubject.asObservable(),
        });
        pencilStub = new ToolStub({} as DrawingService, undoRedoServiceSpy);
        eraserStub = new ToolStub({} as DrawingService, undoRedoServiceSpy);
        lineStub = new ToolStub({} as DrawingService, undoRedoServiceSpy);
        stampStub = new ToolStub({} as DrawingService, undoRedoServiceSpy);
        toolManagerSpy = jasmine.createSpyObj('ToolManagerService', [''], { currentTool: pencilStub });

        TestBed.configureTestingModule({
            providers: [
                { provide: UndoRedoService, useValue: undoRedoServiceSpy },
                { provide: ToolManagerService, useValue: toolManagerSpy },
            ],
        });
        service = TestBed.inject(CursorManagerService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        service.previewCanvas = canvasTestHelper.canvas;

        service['cursors'].set(pencilStub, 'url(assets/pencil.png) 0 15, auto').set(eraserStub, 'none').set(stampStub, 'none');
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should call toolManager.currentTool.drawCursor on undo/redo pile size change if onCanvas', () => {
        service.onCanvas = true;
        const drawCursorSpy = spyOn(eraserStub, 'drawCursor');

        (Object.getOwnPropertyDescriptor(toolManagerSpy, 'currentTool')?.get as jasmine.Spy<() => Tool>).and.returnValue(eraserStub);
        undoRedoServiceSpy['pileSizeSource'].next([1, 1]);

        expect(drawCursorSpy).toHaveBeenCalled();
        expect(drawCursorSpy).toHaveBeenCalledWith(service.mousePosition);
    });

    it('changeCursor should set cursor to crosshair if not eraser,stamp or pencil selected', () => {
        service.changeCursor(lineStub);
        expect(service.previewCanvas.style.cursor).toBe('crosshair');
    });

    it('changeCursor should set cursor to none if eraserService selected', () => {
        service.changeCursor(eraserStub);
        expect(service.previewCanvas.style.cursor).toBe('none');
    });

    it('changeCursor should set cursor to pencil-icon if pencilService selected', () => {
        service.changeCursor(pencilStub);
        expect(service.previewCanvas.style.cursor).toBe('url("assets/pencil.png") 0 15, auto');
    });

    it('changeCursor should set cursor to none if stampService selected', () => {
        service.changeCursor(stampStub);
        expect(service.previewCanvas.style.cursor).toBe('none');
    });

    it('changeCursor should call tool.drawCursor if onCanvas', () => {
        service.onCanvas = true;
        const drawCursorSpy = spyOn(eraserStub, 'drawCursor');

        service.changeCursor(eraserStub);

        expect(drawCursorSpy).toHaveBeenCalled();
        expect(drawCursorSpy).toHaveBeenCalledWith(service.mousePosition);
    });

    it('changeCursor should not call tool.drawCursor if not onCanvas', () => {
        service.onCanvas = false;
        const drawCursorSpy = spyOn(eraserStub, 'drawCursor');

        service.changeCursor(eraserStub);

        expect(drawCursorSpy).not.toHaveBeenCalled();
    });

    it('onMouseMove should set mousePosition', () => {
        const expectedPosition = { x: 2, y: 3 };
        service.onMouseMove(expectedPosition);
        expect(service.mousePosition).toBe(expectedPosition);
    });

    it('onMouseLeave should set onCanvas to false', () => {
        service.onCanvas = true;
        service.onMouseLeave();
        expect(service.onCanvas).toBeFalse();
    });

    it('onMouseEnter should set onCanvas to true', () => {
        service.onCanvas = false;
        service.onMouseEnter();
        expect(service.onCanvas).toBeTrue();
    });
});
