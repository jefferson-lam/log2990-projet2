import { TestBed } from '@angular/core/testing';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { AerosolService } from '@app/services/tools/aerosol/aerosol-service';
import { EllipseService } from '@app/services/tools/ellipse/ellipse-service';
import { EraserService } from '@app/services/tools/eraser/eraser-service';
import { LineService } from '@app/services/tools/line/line-service';
import { PaintBucketService } from '@app/services/tools/paint-bucket/paint-bucket-service';
import { PencilService } from '@app/services/tools/pencil/pencil-service';
import { PipetteService } from '@app/services/tools/pipette/pipette-service';
import { PolygoneService } from '@app/services/tools/polygone/polygone-service';
import { RectangleService } from '@app/services/tools/rectangle/rectangle-service';
import { EllipseSelectionService } from '@app/services/tools/selection/ellipse/ellipse-selection-service';
import { LassoSelectionService } from '@app/services/tools/selection/lasso/lasso-selection';
import { RectangleSelectionService } from '@app/services/tools/selection/rectangle/rectangle-selection-service';
import { StampService } from '@app/services/tools/stamp/stamp-service';
import { TextService } from '@app/services/tools/text/text-service';
import { ToolManagerService } from './tool-manager-service';

// tslint:disable:no-string-literal
describe('ToolManagerService', () => {
    let service: ToolManagerService;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let pencilServiceSpy: jasmine.SpyObj<PencilService>;
    let eraserServiceSpy: jasmine.SpyObj<EraserService>;
    let lineServiceSpy: jasmine.SpyObj<LineService>;
    let rectangleServiceSpy: jasmine.SpyObj<RectangleService>;
    let ellipseServiceSpy: jasmine.SpyObj<EllipseService>;
    let rectangleSelectionSpy: jasmine.SpyObj<RectangleSelectionService>;
    let ellipseSelectionSpy: jasmine.SpyObj<EllipseSelectionService>;
    let polygoneSpy: jasmine.SpyObj<PolygoneService>;
    let aerosolSpy: jasmine.SpyObj<AerosolService>;
    let pipetteSpy: jasmine.SpyObj<PipetteService>;
    let lassoSelectionServiceSpy: jasmine.SpyObj<LassoSelectionService>;
    let paintBucketSpy: jasmine.SpyObj<PaintBucketService>;
    let stampSpy: jasmine.SpyObj<StampService>;
    let textSpy: jasmine.SpyObj<TextService>;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        pencilServiceSpy = jasmine.createSpyObj('PencilService', ['setPrimaryColor', 'onMouseUp', 'onToolChange', 'onScroll']);
        eraserServiceSpy = jasmine.createSpyObj('EraserService', ['setPrimaryColor', 'onMouseUp', 'onToolChange', 'onScroll']);
        lineServiceSpy = jasmine.createSpyObj('LineService', ['setPrimaryColor', 'onMouseUp', 'onScroll']);
        rectangleServiceSpy = jasmine.createSpyObj('RectangleService', ['setPrimaryColor', 'setSecondaryColor', 'onMouseUp', 'onScroll']);
        ellipseServiceSpy = jasmine.createSpyObj('EllipseService', ['setPrimaryColor', 'setSecondaryColor', 'onMouseUp', 'onScroll']);
        rectangleSelectionSpy = jasmine.createSpyObj('RectangleSelectionService', ['onScroll']);
        ellipseSelectionSpy = jasmine.createSpyObj('EllipseSelectionService', ['onScroll']);
        polygoneSpy = jasmine.createSpyObj('PolygoneService', ['setPrimaryColor', 'setSecondaryColor', 'onScroll']);
        aerosolSpy = jasmine.createSpyObj('AerosolService', ['setPrimaryColor', 'onScroll']);
        pipetteSpy = jasmine.createSpyObj('PipetteService', ['onScroll']);
        lassoSelectionServiceSpy = jasmine.createSpyObj('LassoSelectionService', ['onMouseUp', 'onScroll']);
        paintBucketSpy = jasmine.createSpyObj('PaintBucketService', ['setPrimaryColor', 'onScroll']);
        stampSpy = jasmine.createSpyObj('StampService', ['onScroll']);
        textSpy = jasmine.createSpyObj('TextService', ['setPrimaryColor', 'onScroll']);
        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: PencilService, useValue: pencilServiceSpy },
                { provide: EraserService, useValue: eraserServiceSpy },
                { provide: LineService, useValue: lineServiceSpy },
                { provide: RectangleService, useValue: rectangleServiceSpy },
                { provide: EllipseService, useValue: ellipseServiceSpy },
                { provide: RectangleSelectionService, useValue: rectangleSelectionSpy },
                { provide: EllipseSelectionService, useValue: ellipseSelectionSpy },
                { provide: PolygoneService, useValue: polygoneSpy },
                { provide: AerosolService, useValue: aerosolSpy },
                { provide: PipetteService, useValue: pipetteSpy },
                { provide: LassoSelectionService, useValue: lassoSelectionServiceSpy },
                { provide: PaintBucketService, useValue: paintBucketSpy },
                { provide: StampService, useValue: stampSpy },
                { provide: TextService, useValue: textSpy },
            ],
        });
        service = TestBed.inject(ToolManagerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('select tool on 1 keypress should select rectangle', () => {
        const keyboardEvent = {
            key: '1',
        } as KeyboardEvent;

        expect(service.selectTool(keyboardEvent.key)).toEqual(service.rectangleService);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('select tool on 2 keypress should select ellipse', () => {
        const keyboardEvent = {
            key: '2',
        } as KeyboardEvent;

        expect(service.selectTool(keyboardEvent.key)).toEqual(service.ellipseService);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('select tool on c keypress should not call clearCanvas if already selected', () => {
        const keyboardEvent = {
            key: 'c',
        } as KeyboardEvent;

        expect(service.selectTool(keyboardEvent.key)).toEqual(service.pencilService);
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
    });

    it('select tool on c keypress should select pencil if not already selected', () => {
        service.currentTool = eraserServiceSpy;
        const keyboardEvent = {
            key: 'c',
        } as KeyboardEvent;

        expect(service.selectTool(keyboardEvent.key)).toEqual(service.pencilService);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('select tool should return pencil as a default value', () => {
        const keyboardEvent = {
            key: ',',
        } as KeyboardEvent;

        expect(service.selectTool(keyboardEvent.key)).toEqual(service.pencilService);
    });

    it('select tool on l keypress should select line', () => {
        const keyboardEvent = {
            key: 'l',
        } as KeyboardEvent;
        expect(service.selectTool(keyboardEvent.key)).toEqual(service.lineService);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('select tool on e should select eraser', () => {
        const keyboardEvent = {
            key: 'e',
        } as KeyboardEvent;
        expect(service.selectTool(keyboardEvent.key)).toEqual(service.eraserService);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('should call all needed setPrimaryColor methods when setPrimaryColor is called', () => {
        const RANDOM_COLOR = 'blue';
        service.setPrimaryColorTools(RANDOM_COLOR);
        expect(rectangleServiceSpy.setPrimaryColor).toHaveBeenCalled();
        expect(ellipseServiceSpy.setPrimaryColor).toHaveBeenCalled();
        expect(pencilServiceSpy.setPrimaryColor).toHaveBeenCalled();
        expect(lineServiceSpy.setPrimaryColor).toHaveBeenCalled();
    });

    it('should call all needed setSecondaryColor methods when setSecondaryColor is called', () => {
        const RANDOM_COLOR = 'blue';
        service.setSecondaryColorTools(RANDOM_COLOR);
        expect(rectangleServiceSpy.setSecondaryColor).toHaveBeenCalled();
        expect(ellipseServiceSpy.setSecondaryColor).toHaveBeenCalled();
        expect(polygoneSpy.setSecondaryColor).toHaveBeenCalled();
    });

    it('onToolChange should not call clearCanvas and currentTool.onToolChange if same tool as before', () => {
        service.currentTool = pencilServiceSpy;
        service['onToolChange'](pencilServiceSpy);

        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        expect(pencilServiceSpy.onToolChange).not.toHaveBeenCalled();
    });

    it('onToolChange should clearCanvas and call currentTool.onToolChange if different tool', () => {
        service.currentTool = pencilServiceSpy;
        service['onToolChange'](eraserServiceSpy);

        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(pencilServiceSpy.onToolChange).toHaveBeenCalled();
    });

    it('scrolled should call onScroll from each tool', () => {
        const expectedValues = { x: 30, y: 42 };

        service.scrolled(expectedValues.x, expectedValues.y);

        expect(pencilServiceSpy.onScroll).toHaveBeenCalledWith(expectedValues.x, expectedValues.y);
        expect(eraserServiceSpy.onScroll).toHaveBeenCalledWith(expectedValues.x, expectedValues.y);
        expect(lineServiceSpy.onScroll).toHaveBeenCalledWith(expectedValues.x, expectedValues.y);
        expect(rectangleServiceSpy.onScroll).toHaveBeenCalledWith(expectedValues.x, expectedValues.y);
        expect(ellipseServiceSpy.onScroll).toHaveBeenCalledWith(expectedValues.x, expectedValues.y);
        expect(rectangleSelectionSpy.onScroll).toHaveBeenCalledWith(expectedValues.x, expectedValues.y);
        expect(ellipseSelectionSpy.onScroll).toHaveBeenCalledWith(expectedValues.x, expectedValues.y);
        expect(polygoneSpy.onScroll).toHaveBeenCalledWith(expectedValues.x, expectedValues.y);
        expect(aerosolSpy.onScroll).toHaveBeenCalledWith(expectedValues.x, expectedValues.y);
        expect(pipetteSpy.onScroll).toHaveBeenCalledWith(expectedValues.x, expectedValues.y);
        expect(lassoSelectionServiceSpy.onScroll).toHaveBeenCalledWith(expectedValues.x, expectedValues.y);
        expect(paintBucketSpy.onScroll).toHaveBeenCalledWith(expectedValues.x, expectedValues.y);
        expect(stampSpy.onScroll).toHaveBeenCalledWith(expectedValues.x, expectedValues.y);
        expect(textSpy.onScroll).toHaveBeenCalledWith(expectedValues.x, expectedValues.y);
    });
});
