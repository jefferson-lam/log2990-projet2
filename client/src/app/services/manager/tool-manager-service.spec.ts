import { TestBed } from '@angular/core/testing';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EllipseService } from '@app/services/tools/ellipse/ellipse-service';
import { EraserService } from '@app/services/tools/eraser/eraser-service';
import { LineService } from '@app/services/tools/line/line-service';
import { PencilService } from '@app/services/tools/pencil/pencil-service';
import { RectangleService } from '@app/services/tools/rectangle/rectangle-service';
import { ToolManagerService } from './tool-manager-service';

describe('ToolManagerService', () => {
    let service: ToolManagerService;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let rectangleServiceSpy: jasmine.SpyObj<RectangleService>;
    let ellipseServiceSpy: jasmine.SpyObj<EllipseService>;
    let eraserServiceSpy: jasmine.SpyObj<EraserService>;
    let pencilServiceSpy: jasmine.SpyObj<PencilService>;
    let lineServiceSpy: jasmine.SpyObj<LineService>;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        rectangleServiceSpy = jasmine.createSpyObj('RectangleService', ['setPrimaryColor', 'setSecondaryColor', 'onMouseUp']);
        ellipseServiceSpy = jasmine.createSpyObj('EllipseService', ['setPrimaryColor', 'setSecondaryColor', 'onMouseUp']);
        eraserServiceSpy = jasmine.createSpyObj('EraserService', ['setPrimaryColor', 'onMouseUp', 'onToolChange']);
        pencilServiceSpy = jasmine.createSpyObj('PencilService', ['setPrimaryColor', 'onMouseUp', 'onToolChange']);
        lineServiceSpy = jasmine.createSpyObj('LineService', ['setPrimaryColor', 'onMouseUp']);
        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: RectangleService, useValue: rectangleServiceSpy },
                { provide: EllipseService, useValue: ellipseServiceSpy },
                { provide: EraserService, useValue: eraserServiceSpy },
                { provide: PencilService, useValue: pencilServiceSpy },
                { provide: LineService, useValue: lineServiceSpy },
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
        expect(rectangleServiceSpy.primaryColor).toEqual(RANDOM_COLOR);
        expect(ellipseServiceSpy.primaryColor).toEqual(RANDOM_COLOR);
        expect(pencilServiceSpy.primaryColor).toEqual(RANDOM_COLOR);
        expect(lineServiceSpy.primaryColor).toEqual(RANDOM_COLOR);
    });

    it('should call all needed setSecondaryColor methods when setSecondaryColor is called', () => {
        const RANDOM_COLOR = 'blue';
        service.setSecondaryColorTools(RANDOM_COLOR);
        expect(rectangleServiceSpy.secondaryColor).toEqual(RANDOM_COLOR);
        expect(ellipseServiceSpy.secondaryColor).toEqual(RANDOM_COLOR);
    });

    it('onToolChange should not call clearCanvas and currentTool.onToolChange if same tool as before', () => {
        service.currentTool = pencilServiceSpy;
        service.onToolChange(pencilServiceSpy);

        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        expect(pencilServiceSpy.onToolChange).not.toHaveBeenCalled();
    });

    it('onToolChange should clearCanvas and call currentTool.onToolChange if different tool', () => {
        service.currentTool = pencilServiceSpy;
        service.onToolChange(eraserServiceSpy);

        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(pencilServiceSpy.onToolChange).toHaveBeenCalled();
    });
});
