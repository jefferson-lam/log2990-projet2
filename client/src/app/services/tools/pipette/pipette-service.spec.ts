import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Rgba } from '@app/classes/rgba';
import * as MouseConstants from '@app/constants/mouse-constants';
import * as PipetteConstants from '@app/constants/pipette-constants';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PipetteService } from './pipette-service';

fdescribe('PipetteServiceService', () => {
    let service: PipetteService;
    let colorService: ColorService;
    let leftMouseButton: MouseEvent;
    let rightMouseButton: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let newColor: Rgba;
    const colorPlaceholderBlack: Rgba = { red: '0', green: '0', blue: '0', alpha: 1 };

    let baseCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(PipetteService);
        colorService = TestBed.inject(ColorService);
        newColor = { red: '100', green: '0', blue: '233', alpha: 0.8 };

        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].canvas = baseCtxStub.canvas;

        leftMouseButton = {
            offsetX: PipetteConstants.OFFSET_TESTS_X,
            offsetY: PipetteConstants.OFFSET_TESTS_Y,
            button: MouseConstants.MouseButton.Left,
        } as MouseEvent;

        rightMouseButton = {
            offsetX: PipetteConstants.OFFSET_TESTS_X,
            offsetY: PipetteConstants.OFFSET_TESTS_Y,
            button: MouseConstants.MouseButton.Right,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('onMouseMove should call getPositionFromMouse if mouse is in bound', () => {
        service.inUse = true;
        service.inBound = true;

        let getPositionFromMouseSpy: jasmine.Spy;
        getPositionFromMouseSpy = spyOn(service, 'getPositionFromMouse').and.callThrough();

        service.onMouseMove(leftMouseButton);
        expect(getPositionFromMouseSpy).toHaveBeenCalled();
    });

    it('onMouseMove should not call getPositionFromMouse if mouse is not in bound', () => {
        service.inUse = true;
        service.inBound = false;

        let getPositionFromMouseSpy: jasmine.Spy;
        getPositionFromMouseSpy = spyOn(service, 'getPositionFromMouse');

        service.onMouseMove(leftMouseButton);
        expect(getPositionFromMouseSpy).not.toHaveBeenCalled();
    });

    it('onMouseMove should call setPreviewData if mouse is in bound', () => {
        service.inUse = true;
        service.inBound = true;

        let setPreviewDataSpy: jasmine.Spy;
        setPreviewDataSpy = spyOn(service, 'setPreviewData');

        service.onMouseMove(leftMouseButton);
        expect(setPreviewDataSpy).toHaveBeenCalled();
    });

    it('onMouseMove should not call setPreviewData if mouse is not in bound', () => {
        service.inUse = true;
        service.inBound = false;

        let setPreviewDataSpy: jasmine.Spy;
        setPreviewDataSpy = spyOn(service, 'setPreviewData');

        service.onMouseMove(leftMouseButton);
        expect(setPreviewDataSpy).not.toHaveBeenCalled();
    });

    it('onMouseDown should call getPositionFromMouse', () => {
        service.inUse = true;

        let getPositionFromMouseSpy: jasmine.Spy;
        getPositionFromMouseSpy = spyOn(service, 'getPositionFromMouse').and.callThrough();

        service.onMouseDown(leftMouseButton);
        expect(getPositionFromMouseSpy).toHaveBeenCalled();
    });

    it('onMouseDown should call setPrimaryColor if left click', () => {
        service.inUse = true;
        service.inBound = true;

        let setPrimaryColorSpy: jasmine.Spy;
        setPrimaryColorSpy = spyOn(service, 'setPrimaryColor');

        service.onMouseDown(leftMouseButton);
        expect(setPrimaryColorSpy).toHaveBeenCalled();
    });

    it('onMouseDown should call setSecondaryColor if right click', () => {
        service.inUse = true;
        service.inBound = true;

        let setSecondaryColorSpy: jasmine.Spy;
        setSecondaryColorSpy = spyOn(service, 'setSecondaryColor');

        service.onMouseDown(rightMouseButton);
        expect(setSecondaryColorSpy).toHaveBeenCalled();
    });

    it('onMouseLeave should set inBound to false', () => {
        service.inUse = true;
        service.inBound = true;

        service.onMouseLeave();
        expect(service.inBound).toEqual(false);
    });

    it('onMouseEnter should set inBound to true', () => {
        service.inUse = true;
        service.inBound = false;

        service.onMouseEnter();
        expect(service.inBound).toEqual(true);
    });

    it('pixelDataToRgba should pick the right color', () => {
        service.inUse = true;
        let arrayData = new Uint8ClampedArray([255, 255, 255, 1]);
        let pixelData = new ImageData(arrayData, 1, 1);
        let expectedColor = { red: '255', green: '255', blue: '255', alpha: 1 };

        let result = service.pixelDataToRgba(pixelData);
        expect(result.red).toEqual(expectedColor.red);
        expect(result.green).toEqual(expectedColor.green);
        expect(result.blue).toEqual(expectedColor.blue);
        expect(result.alpha).toEqual(expectedColor.alpha);
    });

    it('setPrimaryColor should call colorService.setPrimaryColor', () => {
        service.inUse = true;
        service.setPrimaryColor(colorPlaceholderBlack);
        expect(colorService.setPrimaryColor).toHaveBeenCalled;
    });

    it('setPrimaryColor should set primary color', () => {
        service.inUse = true;
        colorService.primaryColor = colorPlaceholderBlack;

        service.setPrimaryColor(newColor);
        expect(colorService.primaryColor).toEqual(newColor);
    });

    it('setSecondaryColor should call colorService.setSecondaryColor', () => {
        service.inUse = true;

        service.setSecondaryColor(colorPlaceholderBlack);
        expect(colorService.secondaryColor).toHaveBeenCalled;
    });

    it('setSecondaryColor should set secondary color', () => {
        service.inUse = true;
        colorService.secondaryColor = colorPlaceholderBlack;

        service.setSecondaryColor(newColor);
        expect(colorService.secondaryColor).toEqual(newColor);
    });

    it('setPreviewData should set preview data', () => {
        service.inUse = true;
        let arrayData = new Uint8ClampedArray([255, 255, 255, 1]);
        let pixelData = new ImageData(arrayData, 1, 1);

        service.setPreviewData(pixelData);
        expect(service.previewData).toEqual(pixelData);
    });
});
