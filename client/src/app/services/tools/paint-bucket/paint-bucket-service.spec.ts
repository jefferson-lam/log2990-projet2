import { TestBed } from '@angular/core/testing';
import { MouseButton } from '@app/constants/mouse-constants';
import { DEFAULT_TOLERANCE_VALUE } from '@app/constants/paint-bucket-constants';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { PaintBucketService } from './paint-bucket-service';

describe('PaintBucketService', () => {
    let service: PaintBucketService;
    let executeSpy: jasmine.Spy;
    let undoRedoService: UndoRedoService;
    let mouseEvent: MouseEvent;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PaintBucketService);
        undoRedoService = TestBed.inject(UndoRedoService);
        executeSpy = spyOn(undoRedoService, 'executeCommand');

        mouseEvent = {
            offsetX: 450,
            offsetY: 125,
            button: MouseButton.Left,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('setPrimaryColor should set the services attributes', () => {
        const rgbaString = 'rgba(73, 140, 129, 1)';
        const expectedRgba = { red: 73, green: 140, blue: 129, alpha: 255 };
        service.setPrimaryColor(rgbaString);
        expect(service.primaryColor).toEqual(rgbaString);
        expect(service.primaryColorRgba).toEqual(expectedRgba);
    });

    it('setToleranceValue should normalise and set correct value', () => {
        const tolerance = 100;
        const expectedTolerance = 255;
        service.setToleranceValue(tolerance);
        expect(service.toleranceValue).toEqual(expectedTolerance);
    });

    it('setToleranceValue should normalise and set correct value if normalised is float', () => {
        const tolerance = 50;
        const expectedTolerance = 128;
        service.setToleranceValue(tolerance);
        expect(service.toleranceValue).toEqual(expectedTolerance);
    });

    it('setToleranceValue should normalise and set correct value', () => {
        const tolerance = 25;
        const expectedTolerance = 64;
        service.setToleranceValue(tolerance);
        expect(service.toleranceValue).toEqual(expectedTolerance);
    });

    it('setToleranceValue should normalise and set correct value to 0', () => {
        const tolerance = 0;
        const expectedTolerance = 0;
        service.setToleranceValue(tolerance);
        expect(service.toleranceValue).toEqual(expectedTolerance);
    });

    it('onMouseDown should keep track of mouse attributes and call execute', () => {
        service.onMouseDown(mouseEvent);
        expect(service.startX).toEqual(mouseEvent.offsetX);
        expect(service.startY).toEqual(mouseEvent.offsetY);
        expect(executeSpy).toHaveBeenCalled();
    });

    it('getRgba should return correct RGBA values', () => {
        const rgbaString = 'rgba(0, 0, 0, 1)';
        const expectedRgba = { red: 0, green: 0, blue: 0, alpha: 255 };
        const result = service.getRgba(rgbaString);
        expect(result).toEqual(expectedRgba);
    });

    it('getRgba should return correct RGBA values when opacity is fractional', () => {
        const rgbaString = 'rgba(0, 0, 0, 0.6)';
        const expectedRgba = { red: 0, green: 0, blue: 0, alpha: 153 };
        const result = service.getRgba(rgbaString);
        expect(result).toEqual(expectedRgba);
    });

    it('getRgba should return default RGBA values if string does not match expected format', () => {
        const rgbString = 'dhasjk';
        const expectedRgba = { red: 0, green: 0, blue: 0, alpha: 0 };
        const result = service.getRgba(rgbString);
        expect(result).toEqual(expectedRgba);
    });

    it('onToolChange should set toleranceValue to its default value', () => {
        const tolerance = 50;
        service.toleranceValue = tolerance;
        service.onToolChange();
        expect(service.toleranceValue).toEqual(DEFAULT_TOLERANCE_VALUE);
    });
});
