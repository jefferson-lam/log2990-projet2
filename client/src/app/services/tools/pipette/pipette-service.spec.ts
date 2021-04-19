import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Rgba } from '@app/classes/rgba';
import * as CanvasConstants from '@app/constants/canvas-constants';
import * as MouseConstants from '@app/constants/mouse-constants';
import * as PipetteConstants from '@app/constants/pipette-constants';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PipetteService } from './pipette-service';

describe('PipetteService', () => {
    let service: PipetteService;
    let colorService: ColorService;
    let leftMouseButton: MouseEvent;
    let rightMouseButton: MouseEvent;
    let mouseMove: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let newColor: Rgba;
    const colorPlaceholderBlack: Rgba = { red: 0, green: 0, blue: 0, alpha: 1 };
    const colorPlaceholderTransparent: Rgba = { red: 0, green: 0, blue: 0, alpha: 0 };

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
        newColor = { red: 100, green: 0, blue: 233, alpha: 0.8 };

        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].canvas = baseCtxStub.canvas;

        leftMouseButton = {
            x: PipetteConstants.OFFSET_TESTS_X + CanvasConstants.LEFT_MARGIN,
            y: PipetteConstants.OFFSET_TESTS_Y,
            button: MouseConstants.MouseButton.Left,
        } as MouseEvent;

        rightMouseButton = {
            x: PipetteConstants.OFFSET_TESTS_X + CanvasConstants.LEFT_MARGIN,
            y: PipetteConstants.OFFSET_TESTS_Y,
            button: MouseConstants.MouseButton.Right,
        } as MouseEvent;

        mouseMove = {
            x: 1 + CanvasConstants.LEFT_MARGIN,
            y: 1,
            button: MouseConstants.MouseButton.Left,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('onMouseMove should set inBound to true if centerPixel is not transparent or inBound is false', () => {
        service.inBound = false;
        const arrayData = new Uint8ClampedArray(PipetteConstants.RAWDATA_SIZE * PipetteConstants.RAWDATA_SIZE * PipetteConstants.RGBA_SIZE);
        for (let i = 0; i < arrayData.length; i++) {
            arrayData[i] = PipetteConstants.NON_TRANSPARENT_FF;
        }
        const pixelData = new ImageData(arrayData, PipetteConstants.RAWDATA_SIZE, PipetteConstants.RAWDATA_SIZE);

        const ctx = document.createElement('canvas').getContext('2d') as CanvasRenderingContext2D;
        ctx.putImageData(pixelData, 0, 0);
        drawServiceSpy.baseCtx.drawImage(ctx.canvas, 0, 0);

        const setInBoundSpy = spyOn(service, 'setInBound').and.callThrough();

        service.onMouseMove(mouseMove);
        expect(setInBoundSpy).toHaveBeenCalled();
        expect(service.inBound).toEqual(true);
    });

    it('onMouseMove should keep inBound true if centerPixel is not transparent and inBound is true', () => {
        service.inBound = true;
        const arrayData = new Uint8ClampedArray(PipetteConstants.RAWDATA_SIZE * PipetteConstants.RAWDATA_SIZE * PipetteConstants.RGBA_SIZE);
        for (let i = 0; i < arrayData.length; i++) {
            arrayData[i] = PipetteConstants.NON_TRANSPARENT_FF;
        }
        const pixelData = new ImageData(arrayData, PipetteConstants.RAWDATA_SIZE, PipetteConstants.RAWDATA_SIZE);

        const ctx = document.createElement('canvas').getContext('2d') as CanvasRenderingContext2D;
        ctx.putImageData(pixelData, 0, 0);
        drawServiceSpy.baseCtx.drawImage(ctx.canvas, 0, 0);

        const setInBoundSpy = spyOn(service, 'setInBound').and.callThrough();

        service.onMouseMove(mouseMove);
        expect(setInBoundSpy).toHaveBeenCalled();
        expect(service.inBound).toEqual(true);
    });

    it('onMouseMove should set inBound to false if centerPixel is transparent', () => {
        const pixelData = new ImageData(PipetteConstants.RAWDATA_SIZE, PipetteConstants.RAWDATA_SIZE);

        const ctx = document.createElement('canvas').getContext('2d') as CanvasRenderingContext2D;
        ctx.putImageData(pixelData, 0, 0);
        drawServiceSpy.baseCtx = ctx;

        const setInBoundSpy = spyOn(service, 'setInBound').and.callThrough();

        service.onMouseMove(mouseMove);
        expect(setInBoundSpy).toHaveBeenCalled();
        expect(service.inBound).toEqual(false);
    });

    it('onMouseMove should call getPositionFromMouse', () => {
        let getPositionFromMouseSpy: jasmine.Spy;
        getPositionFromMouseSpy = spyOn(service, 'getPositionFromMouse').and.callThrough();

        service.onMouseMove(leftMouseButton);
        expect(getPositionFromMouseSpy).toHaveBeenCalled();
    });

    it('onMouseMove should call setPreviewData', () => {
        let setPreviewDataSpy: jasmine.Spy;
        // tslint:disable:no-any
        setPreviewDataSpy = spyOn<any>(service, 'setPreviewData');

        service.onMouseMove(leftMouseButton);
        expect(setPreviewDataSpy).toHaveBeenCalled();
    });

    it('onMouseDown should call getPositionFromMouse', () => {
        let getPositionFromMouseSpy: jasmine.Spy;
        getPositionFromMouseSpy = spyOn(service, 'getPositionFromMouse').and.callThrough();

        service.onMouseDown(leftMouseButton);
        expect(getPositionFromMouseSpy).toHaveBeenCalled();
    });

    it('onMouseDown should call setPrimaryColor if left click', () => {
        service.inBound = true;

        let setPrimaryColorSpy: jasmine.Spy;
        setPrimaryColorSpy = spyOn(service, 'setPrimaryColorAsRgba');

        service.onMouseDown(leftMouseButton);
        expect(setPrimaryColorSpy).toHaveBeenCalled();
    });

    it('onMouseDown should call setSecondaryColor if right click', () => {
        service.inBound = true;

        let setSecondaryColorSpy: jasmine.Spy;
        setSecondaryColorSpy = spyOn(service, 'setSecondaryColorAsRgba');

        service.onMouseDown(rightMouseButton);
        expect(setSecondaryColorSpy).toHaveBeenCalled();
    });

    it('onMouseLeave should set inBound to false', () => {
        service.inBound = true;

        service.onMouseLeave();
        expect(service.inBound).toEqual(false);
    });

    it('onMouseEnter should set inBound to true', () => {
        service.inBound = false;

        service.onMouseEnter();
        expect(service.inBound).toEqual(true);
    });

    it('pixelDataToRgba should pick the right color', () => {
        const arrayData = new Uint8ClampedArray([
            PipetteConstants.NON_TRANSPARENT_FF,
            PipetteConstants.NON_TRANSPARENT_FF,
            PipetteConstants.NON_TRANSPARENT_FF,
            1,
        ]);
        const pixelData = new ImageData(arrayData, 1, 1);
        const expectedColor = { red: 255, green: 255, blue: 255, alpha: 1 };

        const result = service.pixelDataToRgba(pixelData);
        expect(result.red).toEqual(expectedColor.red);
        expect(result.green).toEqual(expectedColor.green);
        expect(result.blue).toEqual(expectedColor.blue);
        expect(result.alpha).toEqual(expectedColor.alpha);
    });

    it('setPrimaryColor should call colorService functions if color is not transparent', () => {
        const setPrimaryColorSpy = spyOn(colorService, 'setPrimaryColor');
        const saveColorSpy = spyOn(colorService, 'saveColor');

        service.setPrimaryColorAsRgba(colorPlaceholderBlack);
        expect(setPrimaryColorSpy).toHaveBeenCalled();
        expect(saveColorSpy).toHaveBeenCalled();
    });

    it('setPrimaryColor should not call colorService functions if color is transparent', () => {
        const setPrimaryColorSpy = spyOn(colorService, 'setPrimaryColor');
        const saveColorSpy = spyOn(colorService, 'saveColor');

        service.setPrimaryColorAsRgba(colorPlaceholderTransparent);
        expect(setPrimaryColorSpy).not.toHaveBeenCalled();
        expect(saveColorSpy).not.toHaveBeenCalled();
    });

    it('setPrimaryColor should set primary color if color is not transparent', () => {
        colorService['primaryColor'] = colorPlaceholderBlack;

        service.setPrimaryColorAsRgba(newColor);
        expect(colorService['primaryColor']).toEqual(newColor);
    });

    it('setPrimaryColor should not set primary color if color is transparent', () => {
        colorService['primaryColor'] = colorPlaceholderBlack;

        service.setPrimaryColorAsRgba(colorPlaceholderTransparent);
        expect(colorService['primaryColor']).toEqual(colorPlaceholderBlack);
    });

    it('setSecondaryColor should call colorService.setSecondaryColor if color is not transparent', () => {
        const setSecondaryColorSpy = spyOn(colorService, 'setSecondaryColor');
        const saveColorSpy = spyOn(colorService, 'saveColor');

        service.setSecondaryColorAsRgba(colorPlaceholderBlack);
        expect(setSecondaryColorSpy).toHaveBeenCalled();
        expect(saveColorSpy).toHaveBeenCalled();
    });

    it('setSecondaryColor should not call colorService.setSecondaryColor if color is transparent', () => {
        const setSecondaryColorSpy = spyOn(colorService, 'setSecondaryColor');
        const saveColorSpy = spyOn(colorService, 'saveColor');

        service.setSecondaryColorAsRgba(colorPlaceholderTransparent);
        expect(setSecondaryColorSpy).not.toHaveBeenCalled();
        expect(saveColorSpy).not.toHaveBeenCalled();
    });

    it('setSecondaryColor should set secondary color if color is not transparent', () => {
        colorService['secondaryColor'] = colorPlaceholderBlack;

        service.setSecondaryColorAsRgba(newColor);
        expect(colorService['secondaryColor']).toEqual(newColor);
    });

    it('setSecondaryColor should set secondary color if color is not transparent', () => {
        colorService['secondaryColor'] = colorPlaceholderBlack;

        service.setSecondaryColorAsRgba(colorPlaceholderTransparent);
        expect(colorService['secondaryColor']).toEqual(colorPlaceholderBlack);
    });

    it('onToolChange should call setInBound', () => {
        const setInBoundSpy = spyOn(service, 'setInBound');

        service.onToolChange();
        expect(setInBoundSpy).toHaveBeenCalled();
    });
});
