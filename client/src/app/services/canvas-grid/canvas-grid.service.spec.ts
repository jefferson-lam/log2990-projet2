import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import * as GridConstants from '@app/constants/canvas-grid-constants';
import { CanvasGridService } from './canvas-grid.service';

// tslint:disable: no-any
// tslint:disable: no-string-literal
describe('CanvasGridService', () => {
    let service: CanvasGridService;
    let canvasTestHelper: CanvasTestHelper;
    let gridCtxClearRectSpy: jasmine.Spy;
    let gridCtxStrokeSpy: jasmine.Spy;
    let widthSubjectSpy: jasmine.Spy;
    let visibilitySubjectSpy: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CanvasGridService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        service.gridCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        gridCtxClearRectSpy = spyOn(service.gridCtx, 'clearRect');
        gridCtxStrokeSpy = spyOn(service.gridCtx, 'stroke');
        widthSubjectSpy = spyOn(service.widthSubject, 'next');
        visibilitySubjectSpy = spyOn(service.gridVisibilitySubject, 'next');
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('setSquarewidth should set square width to specified value if between maximum and minimum values allowed', () => {
        const EXPECTED_WIDTH = (GridConstants.MAX_SQUARE_WIDTH + GridConstants.MIN_SQUARE_WIDTH) / 2;
        service.setSquareWidth(EXPECTED_WIDTH);
        expect(service.squareWidth).toEqual(EXPECTED_WIDTH);
        expect(widthSubjectSpy).toHaveBeenCalledWith(EXPECTED_WIDTH);
    });

    it('setSquareWidth should set square width to minimum value if inferior to minimum value allowed', () => {
        const INPUT_WIDTH = GridConstants.MIN_SQUARE_WIDTH - 1;
        service.setSquareWidth(INPUT_WIDTH);
        expect(service.squareWidth).toEqual(GridConstants.MIN_SQUARE_WIDTH);
        expect(widthSubjectSpy).toHaveBeenCalledWith(GridConstants.MIN_SQUARE_WIDTH);
    });

    it('setSquareWidth should set square width to maximum value if superior to maximum value allowed', () => {
        const INPUT_WIDTH = GridConstants.MAX_SQUARE_WIDTH + 1;
        service.setSquareWidth(INPUT_WIDTH);
        expect(service.squareWidth).toEqual(GridConstants.MAX_SQUARE_WIDTH);
        expect(widthSubjectSpy).toHaveBeenCalledWith(GridConstants.MAX_SQUARE_WIDTH);
    });

    it('setSquareWidth should clear and create grid if isGridDisplayed is true', () => {
        const EXPECTED_WIDTH = (GridConstants.MAX_SQUARE_WIDTH + GridConstants.MIN_SQUARE_WIDTH) / 2;
        service.isGridDisplayed = true;
        service.setSquareWidth(EXPECTED_WIDTH);
        expect(gridCtxClearRectSpy).toHaveBeenCalled();
        expect(gridCtxStrokeSpy).toHaveBeenCalled();
    });

    it('setOpacityValue should set opacity to specified value if between maximum and minimum values allowed', () => {
        const EXPECTED_OPACITY = (GridConstants.MAX_OPACITY_VALUE + GridConstants.MIN_OPACITY_VALUE) / 2;
        service.setOpacityValue(EXPECTED_OPACITY);
        expect(service.opacityValue).toEqual(EXPECTED_OPACITY);
    });

    it('setOpacityValue should set opacity to minimum value if below minimum value allowed', () => {
        const INPUT_OPACITY = GridConstants.MIN_OPACITY_VALUE - 1;
        const EXPECTED_OPACITY = GridConstants.MIN_OPACITY_VALUE;
        service.setOpacityValue(INPUT_OPACITY);
        expect(service.opacityValue).toEqual(EXPECTED_OPACITY);
    });

    it('setOpacityValue should set opacity to maximum value if above minimum value allowed', () => {
        const INPUT_OPACITY = GridConstants.MAX_OPACITY_VALUE + 1;
        const EXPECTED_OPACITY = GridConstants.MAX_OPACITY_VALUE;
        service.setOpacityValue(INPUT_OPACITY);
        expect(service.opacityValue).toEqual(EXPECTED_OPACITY);
    });

    it('setOpacityValue should clear and create grid if isGridDisplayed is true', () => {
        const EXPECTED_OPACITY = (GridConstants.MAX_OPACITY_VALUE + GridConstants.MIN_OPACITY_VALUE) / 2;
        service.isGridDisplayed = true;
        service.setOpacityValue(EXPECTED_OPACITY);
        expect(gridCtxClearRectSpy).toHaveBeenCalled();
        expect(gridCtxStrokeSpy).toHaveBeenCalled();
    });

    it('setVisibility should create grid if called with true', () => {
        service.setVisibility(true);
        expect(gridCtxStrokeSpy).toHaveBeenCalled();
    });

    it('setVisibility should remove grid if called with false', () => {
        service.setVisibility(false);
        expect(gridCtxClearRectSpy).toHaveBeenCalled();
    });

    it('resize should set canvas to expected size and height and create the grid if isGridDisplayed is true', () => {
        service.isGridDisplayed = true;
        const EXPECTED_WIDTH = 15;
        const EXPECTED_HEIGHT = 10;
        service.resize(EXPECTED_WIDTH, EXPECTED_HEIGHT);
        expect(service.gridCtx.canvas.width).toEqual(EXPECTED_WIDTH);
        expect(service.gridCtx.canvas.height).toEqual(EXPECTED_HEIGHT);
        expect(gridCtxStrokeSpy).toHaveBeenCalled();
    });

    it('resize should set canvas to expected size and height and remove the grid if isGridDisplayed is false', () => {
        service.isGridDisplayed = false;
        const EXPECTED_WIDTH = 15;
        const EXPECTED_HEIGHT = 10;
        service.resize(EXPECTED_WIDTH, EXPECTED_HEIGHT);
        expect(service.gridCtx.canvas.width).toEqual(EXPECTED_WIDTH);
        expect(service.gridCtx.canvas.height).toEqual(EXPECTED_HEIGHT);
        expect(gridCtxClearRectSpy).toHaveBeenCalled();
    });

    it('toggleGrid should create grid and set isGridDisplayed to true if isGridDisplayed is initially false', () => {
        service.isGridDisplayed = false;
        service.toggleGrid();
        expect(service.isGridDisplayed).toBeTrue();
        expect(visibilitySubjectSpy).toHaveBeenCalledWith(service.isGridDisplayed);
    });

    it('toggleGrid should create grid and set isGridDisplayed to false if isGridDisplayed is initially true', () => {
        service.isGridDisplayed = true;
        service.toggleGrid();
        expect(service.isGridDisplayed).toBeFalse();
        expect(visibilitySubjectSpy).toHaveBeenCalledWith(service.isGridDisplayed);
    });

    it('increaseGridSize should increase current square width by set interval if isGridDisplayed is true', () => {
        service.isGridDisplayed = true;
        const INITIAL_WIDTH = 10;
        service.squareWidth = INITIAL_WIDTH;
        service.increaseGridSize();
        expect(service.squareWidth).toEqual(INITIAL_WIDTH + GridConstants.SQUARE_WIDTH_INTERVAL);
    });

    it('increaseGridSize should not increase current square width by set interval if isGridDisplayed is false', () => {
        service.isGridDisplayed = false;
        const INITIAL_WIDTH = 10;
        service.squareWidth = INITIAL_WIDTH;
        service.increaseGridSize();
        expect(service.squareWidth).toEqual(INITIAL_WIDTH);
    });

    it('reduceGridSize should reduce current square width by set interval if isGridDisplayed is true', () => {
        service.isGridDisplayed = true;
        const INITIAL_WIDTH = 10;
        service.squareWidth = INITIAL_WIDTH;
        service.reduceGridSize();
        expect(service.squareWidth).toEqual(INITIAL_WIDTH - GridConstants.SQUARE_WIDTH_INTERVAL);
    });

    it('reduceGridSize should not reduce current square width by set interval if isGridDisplayed is false', () => {
        service.isGridDisplayed = false;
        const INITIAL_WIDTH = 10;
        service.squareWidth = INITIAL_WIDTH;
        service.reduceGridSize();
        expect(service.squareWidth).toEqual(INITIAL_WIDTH);
    });
});
