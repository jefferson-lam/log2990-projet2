import { CdkDragMove } from '@angular/cdk/drag-drop';
import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { SelectionComponent } from '@app/components/selection/selection.component';
import * as CanvasConstants from '@app/constants/canvas-constants';
import { ResizeTop } from './resize-top';

describe('ResizeTopService', () => {
    let service: ResizeTop;
    let moveEvent: CdkDragMove;
    let canvasTestHelper: CanvasTestHelper;
    let reference: Vec2;
    let resizeSquareSpy: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ResizeTop);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);

        resizeSquareSpy = spyOn(service, 'resizeSquare').and.callThrough();

        service.selectionComponent = {
            previewSelectionCanvas: canvasTestHelper.previewSelectionCanvas,
            borderCanvas: canvasTestHelper.borderCanvas,
        } as SelectionComponent;
        service.selectionComponent.previewSelectionCanvas.height = CanvasConstants.DEFAULT_HEIGHT;
        service.selectionComponent.previewSelectionCanvas.width = CanvasConstants.MIN_WIDTH_CANVAS;
        service.lastHeight = CanvasConstants.DEFAULT_HEIGHT + 1;

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
                x: 2000,
                y: 300,
            },
        } as CdkDragMove;

        reference = {
            x: 0,
            y: 0,
        };
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('resize should set lastHeight to current height', () => {
        service.selectionComponent.previewSelectionCanvas.height = 2;
        service.resize(moveEvent);
        expect(service.lastHeight).toBe(service.selectionComponent.previewSelectionCanvas.height);
        expect(service.selectionComponent.borderCanvas.height).toEqual(service.selectionComponent.previewSelectionCanvas.height);
        expect(service.selectionComponent.borderCanvas.style.top).toEqual(service.selectionComponent.previewSelectionCanvas.style.top);
    });

    it('resize should set style.top and height of previewSelectionCanvas to appropriate values if cursor under initial bottom', () => {
        service.selectionComponent.bottomRight.y = moveEvent.pointerPosition.y - 1;
        service.resize(moveEvent);
        expect(service.selectionComponent.previewSelectionCanvas.style.top).toBe(service.selectionComponent.bottomRight.y + 'px');
        expect(service.selectionComponent.previewSelectionCanvas.height).toBe(moveEvent.pointerPosition.y - service.selectionComponent.bottomRight.y);
        expect(service.selectionComponent.borderCanvas.style.top).toBe(service.selectionComponent.bottomRight.y + 'px');
        expect(service.selectionComponent.borderCanvas.height).toBe(moveEvent.pointerPosition.y - service.selectionComponent.bottomRight.y);
        expect(service.selectionComponent.borderCanvas.height).toEqual(service.selectionComponent.previewSelectionCanvas.height);
        expect(service.selectionComponent.borderCanvas.style.top).toEqual(service.selectionComponent.previewSelectionCanvas.style.top);
    });

    it('resize should set style.top and height of previewSelectionCanvas to appropriate values if cursor over initial bottom', () => {
        service.selectionComponent.bottomRight.y = moveEvent.pointerPosition.y + 1;
        service.resize(moveEvent);
        expect(service.selectionComponent.previewSelectionCanvas.style.top).toBe(moveEvent.pointerPosition.y + 'px');
        expect(service.selectionComponent.previewSelectionCanvas.height).toBe(service.selectionComponent.bottomRight.y - moveEvent.pointerPosition.y);
        expect(service.selectionComponent.borderCanvas.height).toEqual(service.selectionComponent.previewSelectionCanvas.height);
        expect(service.selectionComponent.borderCanvas.style.top).toEqual(service.selectionComponent.previewSelectionCanvas.style.top);
    });

    it('resizeHeight should set lastHeight to calculated height and call resizeSquare', () => {
        service.selectionComponent.previewSelectionCanvas.height = 2;
        service.resizeHeight(moveEvent, reference);
        expect(service.lastHeight).toBe(Math.abs(moveEvent.pointerPosition.y - reference.y));
        expect(resizeSquareSpy).toHaveBeenCalled();
        expect(resizeSquareSpy).toHaveBeenCalledWith(false, moveEvent.pointerPosition.y);
        expect(service.selectionComponent.borderCanvas.style.top).toEqual(service.selectionComponent.previewSelectionCanvas.style.top);
    });

    it('resizeHeight should set style.top of previewSelectionCanvas to appropriate values if cursor over reference y', () => {
        reference.y = moveEvent.pointerPosition.y - 1;
        service.resizeHeight(moveEvent, reference);
        expect(service.selectionComponent.previewSelectionCanvas.style.top).toBe(reference.y + 'px');
        expect(service.selectionComponent.borderCanvas.style.top).toEqual(service.selectionComponent.previewSelectionCanvas.style.top);
    });

    it('resizeHeight should set style.top of previewSelectionCanvas to appropriate values if cursor under reference y', () => {
        const shortDifference = 1;
        reference.y = moveEvent.pointerPosition.y + shortDifference;
        service.resizeHeight(moveEvent, reference);
        expect(service.selectionComponent.previewSelectionCanvas.style.top).toBe(reference.y - shortDifference + 'px');
        expect(service.selectionComponent.borderCanvas.style.top).toEqual(service.selectionComponent.previewSelectionCanvas.style.top);
    });

    it('resizeSquare should do nothing if no arguments passed', () => {
        service.selectionComponent.previewSelectionCanvas.style.top = service.selectionComponent.initialPosition.y - 1 + 'px';
        const difference = CanvasConstants.DEFAULT_HEIGHT - CanvasConstants.MIN_WIDTH_CANVAS;
        const expectedTop = parseInt(service.selectionComponent.previewSelectionCanvas.style.top, 10) + difference + 'px';
        const expectedHeight = 123;
        service.resizeSquare();
        expect(service.selectionComponent.previewSelectionCanvas.height).not.toBe(expectedHeight);
        expect(service.selectionComponent.previewSelectionCanvas.style.top).not.toBe(expectedTop);
    });

    it('resizeSquare should set height if passed as argument and not combined', () => {
        const expectedHeight = 123;
        service.resizeSquare(false, expectedHeight);
        expect(service.selectionComponent.previewSelectionCanvas.height).toBe(expectedHeight);
        expect(service.selectionComponent.borderCanvas.height).toEqual(service.selectionComponent.previewSelectionCanvas.height);
        expect(service.selectionComponent.borderCanvas.style.top).toEqual(service.selectionComponent.previewSelectionCanvas.style.top);
    });

    it('resizeSquare should set height if passed as argument even if combined', () => {
        const expectedHeight = 123;
        service.resizeSquare(true, expectedHeight);
        expect(service.selectionComponent.previewSelectionCanvas.height).toBe(expectedHeight);
        expect(service.selectionComponent.borderCanvas.height).toEqual(service.selectionComponent.previewSelectionCanvas.height);
        expect(service.selectionComponent.borderCanvas.style.top).toEqual(service.selectionComponent.previewSelectionCanvas.style.top);
    });

    it('resizeSquare should set style.top if combined and style.top over initial bottom', () => {
        service.selectionComponent.previewSelectionCanvas.style.top = service.selectionComponent.bottomRight.y - 1 + 'px';
        const difference = CanvasConstants.DEFAULT_HEIGHT - CanvasConstants.MIN_WIDTH_CANVAS;
        const expectedTop = parseInt(service.selectionComponent.previewSelectionCanvas.style.top, 10) + difference + 'px';
        service.resizeSquare(true);
        expect(service.selectionComponent.previewSelectionCanvas.style.top).toBe(expectedTop);
        expect(service.selectionComponent.borderCanvas.style.top).toEqual(service.selectionComponent.previewSelectionCanvas.style.top);
    });

    it('resizeSquare should not set style.top if not combined and style.top over initial bottom', () => {
        service.selectionComponent.previewSelectionCanvas.style.top = service.selectionComponent.bottomRight.y - 1 + 'px';
        const difference = CanvasConstants.DEFAULT_HEIGHT - CanvasConstants.MIN_WIDTH_CANVAS;
        const expectedTop = parseInt(service.selectionComponent.previewSelectionCanvas.style.top, 10) + difference + 'px';
        service.resizeSquare(false);
        expect(service.selectionComponent.previewSelectionCanvas.style.top).not.toBe(expectedTop);
    });

    it('resizeSquare should not set style.top if combined and style.top not over initial bottom', () => {
        service.selectionComponent.previewSelectionCanvas.style.top = service.selectionComponent.bottomRight.y + 1 + 'px';
        const difference = CanvasConstants.DEFAULT_HEIGHT - CanvasConstants.MIN_WIDTH_CANVAS;
        const expectedTop = parseInt(service.selectionComponent.previewSelectionCanvas.style.top, 10) + difference + 'px';
        service.resizeSquare(true);
        expect(service.selectionComponent.previewSelectionCanvas.style.top).not.toBe(expectedTop);
    });

    it('restoreLastDimensions should set height to lastHeight', () => {
        service.restoreLastDimensions();
        expect(service.selectionComponent.previewSelectionCanvas.height).toBe(service.lastHeight);
        expect(service.selectionComponent.borderCanvas.height).toEqual(service.selectionComponent.previewSelectionCanvas.height);
    });

    it('restoreLastDimensions should set style.top if style.top over initial bottom', () => {
        service.selectionComponent.previewSelectionCanvas.style.top = service.selectionComponent.bottomRight.y - 1 + 'px';
        const difference = service.selectionComponent.previewSelectionCanvas.height - service.lastHeight;
        const expectedTop = parseInt(service.selectionComponent.previewSelectionCanvas.style.top, 10) + difference + 'px';
        service.restoreLastDimensions();
        expect(service.selectionComponent.previewSelectionCanvas.style.top).toBe(expectedTop);
        expect(service.selectionComponent.borderCanvas.height).toEqual(service.selectionComponent.previewSelectionCanvas.height);
    });
});
