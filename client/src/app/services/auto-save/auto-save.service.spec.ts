import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { ResizerCommand } from '@app/components/resizer/resizer-command';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { Subject } from 'rxjs';
import { AutoSaveService } from './auto-save.service';
import SpyObj = jasmine.SpyObj;

describe('AutoSaveService', () => {
    let service: AutoSaveService;
    let drawServiceSpy: SpyObj<DrawingService>;
    let baseCanvas: HTMLCanvasElement;
    let previewLayer: HTMLCanvasElement;
    let sideResizer: HTMLElement;
    let cornerResizer: HTMLElement;
    let bottomResizer: HTMLElement;
    let canvasTestHelper: CanvasTestHelper;
    let undoRedoServiceSpy: SpyObj<UndoRedoService>;
    let executeSpy: jasmine.Spy;
    let autoSaveSpy: jasmine.Spy;
    let mockSubject: Subject<number[]>;

    const mockImageURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAADElEQVQImWNgoBMAAABpAAFEI8ARAAAAAElFTkSuQmCC';

    beforeEach(() => {
        sideResizer = document.createElement('div');
        sideResizer.id = 'sideResizer';
        bottomResizer = document.createElement('div');
        bottomResizer.id = 'bottomResizer';
        cornerResizer = document.createElement('div');
        cornerResizer.id = 'cornerResizer';
        baseCanvas = document.createElement('canvas');
        baseCanvas.id = 'canvas';
        previewLayer = document.createElement('canvas');
        previewLayer.id = 'previewLayer';

        document.body.append(baseCanvas);
        document.body.append(previewLayer);
        document.body.append(sideResizer);
        document.body.append(bottomResizer);
        document.body.append(cornerResizer);

        mockSubject = new Subject<number[]>();
        undoRedoServiceSpy = jasmine.createSpyObj('UndoRedoService', ['reset'], {
            pileSizeSource: mockSubject,
            pileSizeObservable: mockSubject.asObservable(),
            resetCanvasSize: new ResizerCommand(drawServiceSpy),
            initialImage: new Image(),
        });

        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['newDrawing'], ['canvas', 'baseCtx']);
        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: UndoRedoService, useValue: undoRedoServiceSpy },
            ],
        });
        service = TestBed.inject(AutoSaveService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        (Object.getOwnPropertyDescriptor(drawServiceSpy, 'baseCtx')?.get as jasmine.Spy<() => CanvasRenderingContext2D>).and.returnValue(
            canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D,
        );

        autoSaveSpy = spyOn(service, 'autoSaveDrawing');
        executeSpy = spyOn(undoRedoServiceSpy.resetCanvasSize, 'execute');
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should call autoSaveDrawing if pile size changes and both are not empty', () => {
        service.undoRedoService.pileSizeSource.next([1, 1]);

        expect(autoSaveSpy).toHaveBeenCalled();
    });

    it('should not call autoSaveDrawing if pile size changes and both are empty', () => {
        service.undoRedoService.pileSizeSource.next([0, 0]);

        expect(autoSaveSpy).not.toHaveBeenCalled();
    });

    it('autoSaveDrawing should do nothing if canvas is not declared', () => {
        autoSaveSpy.and.callThrough();
        const setSpy = spyOn(localStorage, 'setItem');
        service.autoSaveDrawing();
        expect(setSpy).not.toHaveBeenCalled();
    });

    it('autoSaveDrawing should set autosave drawing if canvas is declared', () => {
        autoSaveSpy.and.callThrough();
        (Object.getOwnPropertyDescriptor(drawServiceSpy, 'canvas')?.get as jasmine.Spy<() => HTMLCanvasElement>).and.returnValue(
            document.createElement('canvas'),
        );
        const setSpy = spyOn(localStorage, 'setItem');
        const dataUrlSpy = spyOn(drawServiceSpy.canvas, 'toDataURL').and.callFake(() => {
            return mockImageURL;
        });
        service.autoSaveDrawing();
        expect(dataUrlSpy).toHaveBeenCalled();
        expect(setSpy).toHaveBeenCalled();
        expect(setSpy).toHaveBeenCalledWith('autosave', mockImageURL);
    });

    it('loadDrawing should execute resetCanvasSize if autosaved drawing', async () => {
        localStorage.setItem('autosave', mockImageURL);
        await service.loadDrawing();
        localStorage.clear();

        expect(executeSpy).toHaveBeenCalled();
    });

    it('loadDrawing should drawImage after initialImage.onload event if autosaved drawing', async () => {
        localStorage.setItem('autosave', mockImageURL);
        const drawSpy = spyOn(canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D, 'drawImage');
        await service.loadDrawing();
        localStorage.clear();

        expect(service.undoRedoService.initialImage).not.toBeNull();
        expect(drawSpy).toHaveBeenCalled();
    });

    it('loadDrawing should autoSaveDrawing after initialImage.onload event if autosaved drawing', async () => {
        localStorage.setItem('autosave', mockImageURL);
        await service.loadDrawing();
        localStorage.clear();

        expect(autoSaveSpy).toHaveBeenCalled();
    });

    it('loadDrawing should execute resetCanvasSize if not autosaved drawing', () => {
        localStorage.clear();
        service.loadDrawing();

        expect(executeSpy).toHaveBeenCalled();
    });

    it('loadDrawing should call drawingService.newDrawing if not autosave', () => {
        service.loadDrawing();

        expect(drawServiceSpy.newDrawing).toHaveBeenCalled();
    });

    it('loadDrawing should call autoSaveDrawing and reset undoRedoService', () => {
        service.loadDrawing();

        expect(autoSaveSpy).toHaveBeenCalled();
        expect(undoRedoServiceSpy.reset).toHaveBeenCalled();
    });
});
