import { CdkDragMove } from '@angular/cdk/drag-drop';
import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { SelectionComponent } from '@app/components/selection/selection.component';
import * as CanvasConstants from '@app/constants/canvas-constants';
import { ResizeLeft } from './resize-left';

// tslint:disable: no-string-literal
describe('ResizeLeftService', () => {
    let service: ResizeLeft;
    let moveEvent: CdkDragMove;
    let canvasTestHelper: CanvasTestHelper;
    let reference: Vec2;
    let resizeSquareSpy: jasmine.Spy;
    let pointerPosition: number;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ResizeLeft);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);

        resizeSquareSpy = spyOn(service, 'resizeSquare').and.callThrough();

        service.selectionComponent = {
            previewSelectionCanvas: canvasTestHelper.previewSelectionCanvas,
            borderCanvas: canvasTestHelper.borderCanvas,
        } as SelectionComponent;
        service.selectionComponent.previewSelectionCanvas.width = CanvasConstants.DEFAULT_WIDTH;
        service.selectionComponent.previewSelectionCanvas.height = CanvasConstants.MIN_HEIGHT_CANVAS;
        service['lastWidth'] = CanvasConstants.DEFAULT_WIDTH + 1;

        service.selectionComponent.initialPosition = {
            x: 10,
            y: 10,
        };
        service.selectionComponent.bottomRight = {
            x: 20,
            y: 20,
        };

        moveEvent = {
            pointerPosition: {
                x: 4000,
                y: 300,
            },
        } as CdkDragMove;

        reference = {
            x: 0,
            y: 0,
        };

        pointerPosition = moveEvent.pointerPosition.x - CanvasConstants.LEFT_MARGIN;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('resize should set lastWidth to current width', () => {
        service.selectionComponent.previewSelectionCanvas.width = 2;
        service.resize(moveEvent);
        expect(service['lastWidth']).toBe(service.selectionComponent.previewSelectionCanvas.width);
        expect(service.selectionComponent.borderCanvas.width).toEqual(service.selectionComponent.previewSelectionCanvas.width);
        expect(service.selectionComponent.borderCanvas.style.left).toEqual(service.selectionComponent.previewSelectionCanvas.style.left);
    });

    it('resize should set style.left and width of previewSelectionCanvas to appropriate values if cursor over initial right', () => {
        service.selectionComponent.bottomRight.x = pointerPosition - 1;
        service.resize(moveEvent);
        expect(service.selectionComponent.previewSelectionCanvas.style.left).toBe(service.selectionComponent.bottomRight.x + 'px');
        expect(service.selectionComponent.previewSelectionCanvas.width).toBe(pointerPosition - service.selectionComponent.bottomRight.x);
        expect(service.selectionComponent.borderCanvas.width).toEqual(service.selectionComponent.previewSelectionCanvas.width);
        expect(service.selectionComponent.borderCanvas.style.left).toEqual(service.selectionComponent.previewSelectionCanvas.style.left);
    });

    it('resize should set style.left and width of previewSelectionCanvas to appropriate values if cursor under initial right', () => {
        service.selectionComponent.bottomRight.x = pointerPosition + 1;
        service.resize(moveEvent);
        expect(service.selectionComponent.previewSelectionCanvas.style.left).toBe(pointerPosition + 'px');
        expect(service.selectionComponent.previewSelectionCanvas.width).toBe(service.selectionComponent.bottomRight.x - pointerPosition);
        expect(service.selectionComponent.borderCanvas.width).toEqual(service.selectionComponent.previewSelectionCanvas.width);
        expect(service.selectionComponent.borderCanvas.style.left).toEqual(service.selectionComponent.previewSelectionCanvas.style.left);
    });

    it('resizeWidth should set lastWidth to calculated width and call resizeSquare', () => {
        service.selectionComponent.previewSelectionCanvas.width = 2;
        service.resizeWidth(moveEvent, reference);
        expect(service['lastWidth']).toBe(Math.abs(pointerPosition - reference.x));
        expect(resizeSquareSpy).toHaveBeenCalled();
        expect(resizeSquareSpy).toHaveBeenCalledWith(false, moveEvent.pointerPosition.y);
        expect(service.selectionComponent.borderCanvas.style.left).toEqual(service.selectionComponent.previewSelectionCanvas.style.left);
    });

    it('resizeWidth should set style.left of previewSelectionCanvas to appropriate values if cursor under reference.x', () => {
        reference.x = pointerPosition - 1;
        service.resizeWidth(moveEvent, reference);
        expect(service.selectionComponent.previewSelectionCanvas.style.left).toBe(reference.x + 'px');
        expect(service.selectionComponent.borderCanvas.style.left).toEqual(service.selectionComponent.previewSelectionCanvas.style.left);
    });

    it('resizeWidth should set style.left of previewSelectionCanvas to appropriate values if cursor over reference.x', () => {
        const shortDifference = 1;
        reference.x = pointerPosition + shortDifference;
        service.resizeWidth(moveEvent, reference);
        expect(service.selectionComponent.previewSelectionCanvas.style.left).toBe(reference.x - shortDifference + 'px');
        expect(service.selectionComponent.borderCanvas.style.left).toEqual(service.selectionComponent.previewSelectionCanvas.style.left);
    });

    it('resizeSquare should set width if passed as argument and not combined', () => {
        const expectedWidth = 123;
        service.resizeSquare(false, expectedWidth);
        expect(service.selectionComponent.previewSelectionCanvas.width).toBe(expectedWidth);
        expect(service.selectionComponent.borderCanvas.width).toEqual(service.selectionComponent.previewSelectionCanvas.width);
    });

    it('resizeSquare should set width if passed as argument even if combined', () => {
        const expectedWidth = 123;
        service.resizeSquare(true, expectedWidth);
        expect(service.selectionComponent.previewSelectionCanvas.width).toBe(expectedWidth);
        expect(service.selectionComponent.borderCanvas.width).toEqual(service.selectionComponent.previewSelectionCanvas.width);
    });

    it('resizeSquare should set style.left if combined and style.left under initial right', () => {
        service.selectionComponent.previewSelectionCanvas.style.left = service.selectionComponent.bottomRight.x - 1 + 'px';
        const difference = CanvasConstants.DEFAULT_WIDTH - CanvasConstants.MIN_HEIGHT_CANVAS;
        const expectedLeft = parseInt(service.selectionComponent.previewSelectionCanvas.style.left, 10) + difference + 'px';
        service.resizeSquare(true);
        expect(service.selectionComponent.previewSelectionCanvas.style.left).toBe(expectedLeft);
        expect(service.selectionComponent.borderCanvas.style.left).toEqual(service.selectionComponent.previewSelectionCanvas.style.left);
    });

    it('resizeSquare should not set style.left if not combined and style.left under initial right', () => {
        service.selectionComponent.previewSelectionCanvas.style.left = service.selectionComponent.bottomRight.x - 1 + 'px';
        const difference = CanvasConstants.DEFAULT_WIDTH - CanvasConstants.MIN_HEIGHT_CANVAS;
        const expectedTop = parseInt(service.selectionComponent.previewSelectionCanvas.style.left, 10) + difference + 'px';
        service.resizeSquare(false);
        expect(service.selectionComponent.previewSelectionCanvas.style.left).not.toBe(expectedTop);
    });

    it('resizeSquare should not set style.left if combined and style.left not under initial right', () => {
        service.selectionComponent.previewSelectionCanvas.style.left = service.selectionComponent.bottomRight.x + 1 + 'px';
        const difference = CanvasConstants.DEFAULT_WIDTH - CanvasConstants.MIN_HEIGHT_CANVAS;
        const expectedTop = parseInt(service.selectionComponent.previewSelectionCanvas.style.left, 10) + difference + 'px';
        service.resizeSquare(true);
        expect(service.selectionComponent.previewSelectionCanvas.style.left).not.toBe(expectedTop);
    });

    it('resizeSquare should do nothing if no arguments passed', () => {
        service.selectionComponent.previewSelectionCanvas.style.left = service.selectionComponent.bottomRight.x + 1 + 'px';
        const difference = CanvasConstants.DEFAULT_WIDTH - CanvasConstants.MIN_HEIGHT_CANVAS;
        const expectedTop = parseInt(service.selectionComponent.previewSelectionCanvas.style.left, 10) + difference + 'px';
        const expectedWidth = 123;
        service.resizeSquare();
        expect(service.selectionComponent.previewSelectionCanvas.width).not.toBe(expectedWidth);
        expect(service.selectionComponent.previewSelectionCanvas.style.left).not.toBe(expectedTop);
    });

    it('restoreLastDimensions should set width to lastWidth', () => {
        service.restoreLastDimensions();
        expect(service.selectionComponent.previewSelectionCanvas.width).toBe(service['lastWidth']);
        expect(service.selectionComponent.borderCanvas.width).toBe(service.selectionComponent.previewSelectionCanvas.width);
    });

    it('restoreLastDimensions should set style.left if style.left under initial right', () => {
        service.selectionComponent.previewSelectionCanvas.style.left = service.selectionComponent.bottomRight.x - 1 + 'px';
        const difference = service.selectionComponent.previewSelectionCanvas.width - service['lastWidth'];
        const expectedLeft = parseInt(service.selectionComponent.previewSelectionCanvas.style.left, 10) + difference + 'px';
        service.restoreLastDimensions();
        expect(service.selectionComponent.previewSelectionCanvas.style.left).toBe(expectedLeft);
        expect(service.selectionComponent.borderCanvas.width).toEqual(service.selectionComponent.previewSelectionCanvas.width);
        expect(service.selectionComponent.borderCanvas.style.left).toEqual(service.selectionComponent.previewSelectionCanvas.style.left);
    });
});
