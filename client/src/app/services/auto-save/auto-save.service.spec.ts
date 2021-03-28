import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Command } from '@app/classes/command';
import { ResizerCommand } from '@app/components/resizer/resizer-command';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { Observable, Subject } from 'rxjs';
import SpyObj = jasmine.SpyObj;
import { AutoSaveService } from './auto-save.service';

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

        undoRedoServiceSpy = jasmine.createSpyObj(
            'UndoRedoService',
            ['reset'],
            ['pileSizeSource', 'pileSizeObservable', 'initialImage', 'resetCanvasSize'],
        );
        (Object.getOwnPropertyDescriptor(undoRedoServiceSpy, 'pileSizeSource')?.get as jasmine.Spy<() => Subject<number[]>>).and.returnValue(
            new Subject<number[]>(),
        );
        (Object.getOwnPropertyDescriptor(undoRedoServiceSpy, 'pileSizeObservable')?.get as jasmine.Spy<() => Observable<number[]>>).and.returnValue(
            undoRedoServiceSpy.pileSizeSource.asObservable(),
        );
        (Object.getOwnPropertyDescriptor(undoRedoServiceSpy, 'resetCanvasSize')?.get as jasmine.Spy<() => Command>).and.returnValue(
            new ResizerCommand(),
        );
        (Object.getOwnPropertyDescriptor(undoRedoServiceSpy, 'initialImage')?.get as jasmine.Spy<() => HTMLImageElement>).and.returnValue(
            new Image(),
        );

        drawServiceSpy = jasmine.createSpyObj('DrawingService', [''], ['canvas', 'baseCtx']);
        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: UndoRedoService, useValue: undoRedoServiceSpy },
            ],
        });
        service = TestBed.inject(AutoSaveService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        executeSpy = spyOn(undoRedoServiceSpy.resetCanvasSize, 'execute');
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should call autoSaveDrawing if pile size changes and both are not empty', () => {
        const autoSaveSpy = spyOn(service, 'autoSaveDrawing');
        service.undoRedoService.pileSizeSource.next([1, 1]);

        expect(autoSaveSpy).toHaveBeenCalled();
    });

    it('should not call autoSaveDrawing if pile size changes and both are empty', () => {
        const autoSaveSpy = spyOn(service, 'autoSaveDrawing');
        service.undoRedoService.pileSizeSource.next([0, 0]);

        expect(autoSaveSpy).not.toHaveBeenCalled();
    });

    it('autoSaveDrawing should do nothing if canvas is not declared', () => {
        const setSpy = spyOn(localStorage, 'setItem');
        service.autoSaveDrawing();
        expect(setSpy).not.toHaveBeenCalled();
    });

    it('autoSaveDrawing should set autosave drawing if canvas is declared', () => {
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

    it('loadDrawing should execute resetCanvasSize if autosaved drawing', () => {
        service.drawingService.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        localStorage.setItem('autosave', mockImageURL);
        service.loadDrawing();
        localStorage.clear();

        expect(executeSpy).toHaveBeenCalled();
    });

    // it('loadDrawing should drawImage and reset undoRedoService on initialImage.onload event if autosaved drawing', fakeAsync(() => {
    //     const autoSaveSpy = spyOn(service, 'autoSaveDrawing');
    //     service.drawingService.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
    //     localStorage.setItem('autosave', mockImageURL);
    //     const drawSpy = spyOn(canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D, 'drawImage');
    //     service.loadDrawing();
    //     localStorage.clear();
    //
    //     const onloadSpy = spyOn<any>(undoRedoServiceSpy.initialImage, 'onload').and.callThrough();
    //     // undoRedoServiceSpy.initialImage.onload({} as Event);
    //
    //     tick();
    //     flush();
    //     expect(onloadSpy).toHaveBeenCalled();
    //     expect(service.undoRedoService.initialImage).not.toBeNull();
    //     expect(drawSpy).toHaveBeenCalled();
    //     expect(undoRedoServiceSpy.reset).toHaveBeenCalled();
    //     expect(autoSaveSpy).toHaveBeenCalled();
    // }));

    it('loadDrawing should call autoSaveDrawing and execute resetCanvasSize if not autosaved drawing', () => {
        localStorage.clear();
        const autoSaveSpy = spyOn(service, 'autoSaveDrawing');
        service.loadDrawing();

        expect(executeSpy).toHaveBeenCalled();
        expect(autoSaveSpy).toHaveBeenCalled();
    });
});
