import { fakeAsync, flush, TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { ResizerCommand } from '@app/components/resizer/resizer-command';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { Subject } from 'rxjs';
import { AutoSaveService } from './auto-save.service';
import SpyObj = jasmine.SpyObj;

// tslint:disable: no-any
// tslint:disable:no-string-literal
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
    let resizerCommandSpy: jasmine.SpyObj<ResizerCommand>;
    let autoSaveSpy: jasmine.Spy;
    let loadLocalStorageSpy: jasmine.Spy<any>;
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

        resizerCommandSpy = jasmine.createSpyObj('ResizerCommand', ['execute']);

        resizerCommandSpy.execute.and.stub();

        mockSubject = new Subject<number[]>();
        undoRedoServiceSpy = jasmine.createSpyObj('UndoRedoService', ['reset'], {
            actionsAllowedSource: mockSubject,
            actionsAllowedObservable: mockSubject.asObservable(),
            resetCanvasSize: resizerCommandSpy,
            initialImage: new Image(),
        });

        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['newDrawing', 'whiteOut'], ['canvas', 'baseCtx']);
        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: UndoRedoService, useValue: undoRedoServiceSpy },
                { provide: ResizerCommand, useValue: resizerCommandSpy },
            ],
        });
        service = TestBed.inject(AutoSaveService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        (Object.getOwnPropertyDescriptor(drawServiceSpy, 'baseCtx')?.get as jasmine.Spy<() => CanvasRenderingContext2D>).and.returnValue(
            canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D,
        );

        autoSaveSpy = spyOn<any>(service, 'autoSaveDrawing');
        loadLocalStorageSpy = spyOn<any>(service, 'loadLocalStorage').and.callFake(() => {
            (service.undoRedoService.initialImage as HTMLImageElement).src = mockImageURL;
        });
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should call autoSaveDrawing if undo and redo are allowed', () => {
        service.undoRedoService['actionsAllowedSource'].next([true, true]);

        expect(autoSaveSpy).toHaveBeenCalled();
    });

    it('should not call autoSaveDrawing if undo and redo not allowed', () => {
        service.undoRedoService['actionsAllowedSource'].next([false, false]);

        expect(autoSaveSpy).not.toHaveBeenCalled();
    });

    it('autoSaveDrawing should do nothing if canvas is not declared', () => {
        autoSaveSpy.and.callThrough();
        const setSpy = spyOn(localStorage, 'setItem');
        service['autoSaveDrawing']();
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
        service['autoSaveDrawing']();
        expect(dataUrlSpy).toHaveBeenCalled();
        expect(setSpy).toHaveBeenCalled();
        expect(setSpy).toHaveBeenCalledWith('autosave', mockImageURL);
    });

    it('loadDrawing should execute resetCanvasSize if autosaved drawing', fakeAsync(() => {
        spyOn(localStorage, 'getItem').and.callFake((key) => {
            return mockImageURL;
        });
        service.loadDrawing();
        flush();
        expect(loadLocalStorageSpy).toHaveBeenCalled();
        expect(resizerCommandSpy.execute).toHaveBeenCalled();
        localStorage.clear();
    }));

    it('loadDrawing should drawImage after initialImage.onload event if autosaved drawing', fakeAsync(() => {
        spyOn(localStorage, 'getItem').and.callFake((key) => {
            return mockImageURL;
        });
        const drawSpy = spyOn(service.drawingService.baseCtx, 'drawImage');
        service.loadDrawing();
        flush();
        expect(loadLocalStorageSpy).toHaveBeenCalled();
        expect(service.undoRedoService.initialImage).not.toBeNull();
        expect(drawSpy).toHaveBeenCalled();
    }));

    it('loadDrawing should autoSaveDrawing after initialImage.onload event if autosaved drawing', fakeAsync(() => {
        spyOn(localStorage, 'getItem').and.callFake((key) => {
            return mockImageURL;
        });

        resizerCommandSpy.execute.and.stub();
        service.loadDrawing();
        flush();
        expect(loadLocalStorageSpy).toHaveBeenCalled();
        expect(autoSaveSpy).toHaveBeenCalled();
    }));

    it('loadDrawing should execute resetCanvasSize if not autosaved drawing', fakeAsync(() => {
        spyOn(localStorage, 'getItem').and.callFake((key) => {
            return null;
        });
        service.loadDrawing();
        flush();
        expect(resizerCommandSpy.execute).toHaveBeenCalled();
    }));

    it('loadDrawing should call drawingService.newDrawing if not autosave', fakeAsync(() => {
        spyOn(localStorage, 'getItem').and.callFake((key) => {
            return null;
        });
        service.loadDrawing();
        flush();
        expect(drawServiceSpy.newDrawing).toHaveBeenCalled();
    }));

    it('loadDrawing should call autoSaveDrawing and reset undoRedoService', fakeAsync(() => {
        spyOn(localStorage, 'getItem').and.callFake((key) => {
            return null;
        });
        service.loadDrawing();
        flush();
        expect(autoSaveSpy).toHaveBeenCalled();
        expect(undoRedoServiceSpy.reset).toHaveBeenCalled();
    }));

    it('loadLocalStorage should', async (done) => {
        loadLocalStorageSpy.and.callThrough();
        spyOn(localStorage, 'getItem').and.callFake((key) => {
            return mockImageURL;
        });

        service['loadLocalStorage']()
            .then(() => {
                expect((service.undoRedoService.initialImage as HTMLImageElement).src).toBe(mockImageURL);
                done();
            })
            .catch((error) => {
                done.fail(error);
            });
    });
});
