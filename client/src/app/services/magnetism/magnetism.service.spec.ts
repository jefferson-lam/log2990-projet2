import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import * as MagnestismConstants from '@app/constants/magnetism-constants';
import { CanvasGridService } from '@app/services/canvas-grid/canvas-grid.service';
import { MagnetismService } from './magnetism.service';

// tslint:disable: no-magic-numbers
describe('MagnetismService', () => {
    let service: MagnetismService;
    let canvasTestHelper: CanvasTestHelper;
    let canvasGridServiceSpy: jasmine.SpyObj<CanvasGridService>;
    let magnetismSubjectSpy: jasmine.Spy;

    beforeEach(() => {
        canvasGridServiceSpy = jasmine.createSpyObj('CanvasGridService', [], ['squareWidth']);
        (Object.getOwnPropertyDescriptor(canvasGridServiceSpy, 'squareWidth')?.get as jasmine.Spy<() => number>).and.returnValue(30);
        TestBed.configureTestingModule({ providers: [{ provide: CanvasGridService, useValue: canvasGridServiceSpy }] });
        service = TestBed.inject(MagnetismService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        canvasTestHelper.selectionCanvas.style.left = '0px';
        canvasTestHelper.selectionCanvas.style.top = '0px';
        canvasTestHelper.selectionCanvas.width = 100;
        canvasTestHelper.selectionCanvas.height = 100;
        magnetismSubjectSpy = spyOn(service.magnetismStateSubject, 'next');
        service.previewSelectionCanvas = canvasTestHelper.selectionCanvas;
        service.transformValues = { x: 0, y: 0 };
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('magnetizeSelection should properly set referenceResizerCoords for top left', () => {
        service.referenceResizerMode = MagnestismConstants.ResizerIndex.TOP_LEFT_INDEX;
        const closestCorner = service.magnetizeSelection();
        const EXPECTED_CORNER = { x: 0, y: 0 };
        expect(closestCorner).toEqual(EXPECTED_CORNER);
    });

    it('magnetizeSelection should properly set referenceResizerCoords for top middle', () => {
        service.referenceResizerMode = MagnestismConstants.ResizerIndex.TOP_MIDDLE_INDEX;
        const closestCorner = service.magnetizeSelection();
        const EXPECTED_CORNER = { x: 10, y: 0 };
        expect(closestCorner).toEqual(EXPECTED_CORNER);
    });

    it('magnetizeSelection should properly set referenceResizerCoords for top right', () => {
        service.referenceResizerMode = MagnestismConstants.ResizerIndex.TOP_RIGHT_INDEX;
        const closestCorner = service.magnetizeSelection();
        const EXPECTED_CORNER = { x: -10, y: 0 };
        expect(closestCorner).toEqual(EXPECTED_CORNER);
    });

    it('magnetizeSelection should properly set referenceResizerCoords for mid left', () => {
        service.referenceResizerMode = MagnestismConstants.ResizerIndex.MID_LEFT_INDEX;
        const closestCorner = service.magnetizeSelection();
        const EXPECTED_CORNER = { x: 0, y: 10 };
        expect(closestCorner).toEqual(EXPECTED_CORNER);
    });

    it('magnetizeSelection should properly set referenceResizerCoords for mid right', () => {
        service.referenceResizerMode = MagnestismConstants.ResizerIndex.MID_RIGHT_INDEX;
        const closestCorner = service.magnetizeSelection();
        const EXPECTED_CORNER = { x: -10, y: 10 };
        expect(closestCorner).toEqual(EXPECTED_CORNER);
    });

    it('magnetizeSelection should properly set referenceResizerCoords for bottom left', () => {
        service.referenceResizerMode = MagnestismConstants.ResizerIndex.BOTTOM_LEFT_INDEX;
        const closestCorner = service.magnetizeSelection();
        const EXPECTED_CORNER = { x: 0, y: -10 };
        expect(closestCorner).toEqual(EXPECTED_CORNER);
    });

    it('magnetizeSelection should properly set referenceResizerCoords for bottom middle', () => {
        service.referenceResizerMode = MagnestismConstants.ResizerIndex.BOTTOM_MIDDLE_INDEX;
        const closestCorner = service.magnetizeSelection();
        const EXPECTED_CORNER = { x: 10, y: -10 };
        expect(closestCorner).toEqual(EXPECTED_CORNER);
    });

    it('magnetizeSelection should properly set referenceResizerCoords for bottom right', () => {
        service.referenceResizerMode = MagnestismConstants.ResizerIndex.BOTTOM_RIGHT_INDEX;
        const closestCorner = service.magnetizeSelection();
        const EXPECTED_CORNER = { x: -10, y: -10 };
        expect(closestCorner).toEqual(EXPECTED_CORNER);
    });

    it('magnetizeSelection should properly set referenceResizerCoords for center', () => {
        service.referenceResizerMode = MagnestismConstants.ResizerIndex.CENTER_INDEX;
        const closestCorner = service.magnetizeSelection();
        const EXPECTED_CORNER = { x: 10, y: 10 };
        expect(closestCorner).toEqual(EXPECTED_CORNER);
    });

    it('toggleMagnetism should set isMagnetismOn to true if isMagnetismOn is initially false', () => {
        service.isMagnetismOn = false;
        service.toggleMagnetism();
        expect(service.isMagnetismOn).toBeTrue();
        expect(magnetismSubjectSpy).toHaveBeenCalledWith(service.isMagnetismOn);
    });

    it('toggleMagnetism should set isMagnetismOn to false if isMagnetismOn is initially true', () => {
        service.isMagnetismOn = true;
        service.toggleMagnetism();
        expect(service.isMagnetismOn).toBeFalse();
        expect(magnetismSubjectSpy).toHaveBeenCalledWith(service.isMagnetismOn);
    });
});
