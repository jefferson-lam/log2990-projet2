import { TestBed } from '@angular/core/testing';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolManagerService } from './tool-manager-service';

describe('ToolManagerService', () => {
    let service: ToolManagerService;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
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

        expect(service.selectTool(keyboardEvent)).toEqual(service.rectangleService);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('select tool on 2 keypress should select ellipse', () => {
        const keyboardEvent = {
            key: '2',
        } as KeyboardEvent;

        expect(service.selectTool(keyboardEvent)).toEqual(service.ellipseService);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('select tool on c keypress should select pencil', () => {
        const keyboardEvent = {
            key: 'c',
        } as KeyboardEvent;

        expect(service.selectTool(keyboardEvent)).toEqual(service.pencilService);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('select tool should return pencil as a default value', () => {
        const keyboardEvent = {
            key: ',',
        } as KeyboardEvent;

        expect(service.selectTool(keyboardEvent)).toEqual(service.pencilService);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('select tool on l keypress should select line', () => {
        const keyboardEvent = {
            key: 'l',
        } as KeyboardEvent;
        expect(service.selectTool(keyboardEvent)).toEqual(service.lineService);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('select tool on e should select eraser', () => {
        const keyboardEvent = {
            key: 'e',
        } as KeyboardEvent;
        expect(service.selectTool(keyboardEvent)).toEqual(service.eraserService);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    });
});
