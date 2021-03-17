import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import * as MouseConstants from '@app/constants/mouse-constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PipetteService } from './pipette-service';

fdescribe('PipetteServiceService', () => {
    let service: PipetteService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    //let undoRedoService: UndoRedoService;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(PipetteService);

        service['drawingService'].baseCtx = baseCtxStub;

        mouseEvent = {
            offsetX: 25,
            offsetY: 40,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('onMouseMove should call getPositionFromMouse if mouse is in bound', () => {
        service.inUse = true;
        service.inBound = true;

        let getPositionFromMouseSpy: jasmine.Spy;
        getPositionFromMouseSpy = spyOn(service, 'getPositionFromMouse');

        service.onMouseMove(mouseEvent);
        expect(getPositionFromMouseSpy).toHaveBeenCalled();
    });

    it('onMouseMove should not call getPositionFromMouse if mouse is not in bound', () => {
        service.inUse = true;
        service.inBound = false;

        let getPositionFromMouseSpy: jasmine.Spy;
        getPositionFromMouseSpy = spyOn(service, 'getPositionFromMouse');

        service.onMouseMove(mouseEvent);
        expect(getPositionFromMouseSpy).not.toHaveBeenCalled();
    });

    it('onMouseMove should call setPreviewData if mouse is in bound', () => {
        service.inUse = true;
        service.inBound = true;

        let setPreviewDataSpy: jasmine.Spy;
        setPreviewDataSpy = spyOn(service, 'setPreviewData');

        service.onMouseMove(mouseEvent);
        expect(setPreviewDataSpy).toHaveBeenCalled();
    });

    it('onMouseMove should not call setPreviewData if mouse is not in bound', () => {
        service.inUse = true;
        service.inBound = false;

        let setPreviewDataSpy: jasmine.Spy;
        setPreviewDataSpy = spyOn(service, 'setPreviewData');

        service.onMouseMove(mouseEvent);
        expect(setPreviewDataSpy).not.toHaveBeenCalled();
    });

    it('onMouseClick should call getPositionFromMouse', () => {
        service.inUse = true;

        let getPositionFromMouseSpy: jasmine.Spy;
        getPositionFromMouseSpy = spyOn(service, 'getPositionFromMouse').and.callThrough();

        service.onMouseClick(mouseEvent);
        expect(getPositionFromMouseSpy).toHaveBeenCalled();
    });

    it('onMouseClick should call setPrimaryColor if left click', () => {
        service.inUse = true;
        service.inBound = true;

        mouseEvent = {
            offsetX: 25,
            offsetY: 40,
            button: MouseConstants.MouseButton.Left,
        } as MouseEvent;

        let setPrimaryColorSpy: jasmine.Spy;
        setPrimaryColorSpy = spyOn(service, 'setPrimaryColor').and.callThrough();

        service.onMouseClick(mouseEvent);
        expect(setPrimaryColorSpy).toHaveBeenCalled();
    });
});
