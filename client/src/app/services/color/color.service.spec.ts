import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Rgba } from '@app/classes/rgba';
import * as ColorConstants from '@app/constants/color-constants';
import { ColorService } from './color.service';

describe('ColorService', () => {
    let service: ColorService;
    let newColor: Rgba;
    const colorPlaceholderBlack: Rgba = { red: '0', green: '0', blue: '0', alpha: 1 };
    const colorPlaceholderBlackString = 'rgba(0, 0, 0, 1)';
    let ctx: CanvasRenderingContext2D;
    let canvasTestHelper: CanvasTestHelper;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ColorService);
        newColor = { red: '100', green: '0', blue: '233', alpha: 0.8 };
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        ctx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('getPrimaryColor() should call convertRgbaToString', () => {
        const convertRgbaToStringSpy = spyOn(service, 'convertRgbaToString');
        service.convertRgbaToString(colorPlaceholderBlack);
        expect(convertRgbaToStringSpy).toHaveBeenCalled();
    });

    it('getPrimaryColor() should return service.primaryColor', () => {
        service.primaryColor = colorPlaceholderBlack;

        expect(service.getPrimaryColor()).toEqual(colorPlaceholderBlackString);
    });

    it('getSecondaryColor() should call convertRgbaToString', () => {
        const convertRgbaToStringSpy = spyOn(service, 'convertRgbaToString');
        service.convertRgbaToString(newColor);
        expect(convertRgbaToStringSpy).toHaveBeenCalled();
    });

    it('getSecondaryColor() should return service.secondaryColor', () => {
        service.secondaryColor = colorPlaceholderBlack;

        expect(service.getSecondaryColor()).toEqual(colorPlaceholderBlackString);
    });

    it('should set new value to primaryColor', () => {
        service.setPrimaryColor(newColor);
        expect(service.primaryColor).toEqual(newColor);
    });

    it('should set new value to secondaryColor', () => {
        service.setSecondaryColor(newColor);
        expect(service.secondaryColor).toEqual(newColor);
    });

    it('should change primary color alpha attribute', () => {
        const alpha = 0.24;
        service.changePrimaryOpacity(alpha);
        expect(service.primaryColor.alpha).toEqual(alpha);
    });

    it('should change secondary color alpha attribute', () => {
        const alpha = 0.35;
        service.changeSecondaryOpacity(alpha);
        expect(service.secondaryColor.alpha).toEqual(alpha);
    });

    it('getColorAtPosition should call getImageData', () => {
        const x = 50;
        const y = 24;
        const getImageDataSpy = spyOn(ctx, 'getImageData').and.callThrough();
        service.getColorAtPosition(ctx, x, y, 1);
        expect(getImageDataSpy).toHaveBeenCalled();
    });

    it('should return rgba to string', () => {
        const expectedColorString = 'rgba(' + newColor.red + ', ' + newColor.green + ', ' + newColor.blue + ', ' + newColor.alpha + ')';
        const newColorString = service.convertRgbaToString(newColor);
        expect(newColorString).toBe(expectedColorString);
    });

    it('should not save new color if it already exists in savedColors', () => {
        const unshiftSpy = spyOn(service.savedColors, 'unshift');
        service.savedColors.push(colorPlaceholderBlack);
        service.saveColor(colorPlaceholderBlack);
        expect(unshiftSpy).not.toHaveBeenCalled();
    });

    it('saveColor pushes colors with full opacity', () => {
        service.saveColor(newColor);
        expect(service.savedColors[0]).not.toEqual(newColor);
        expect(service.savedColors[0].alpha).toEqual(1);
    });

    it('saveColor removes last color when color history reaches maximum capacity', () => {
        const popSpy = spyOn(service.savedColors, 'pop');
        service.savedColors.length = ColorConstants.MAX_SAVED_COLORS;
        service.saveColor(newColor);
        expect(popSpy).toHaveBeenCalled();
    });

    it('saveColor keeps all existing colors when color history has not reached max capacity', () => {
        const popSpy = spyOn(service.savedColors, 'pop');
        service.savedColors.length = 1;
        service.saveColor(newColor);
        expect(popSpy).not.toHaveBeenCalled();
    });

    it('saveColor adds new color to the start of array', () => {
        service.saveColor(newColor);
        const pushedColor = newColor;
        pushedColor.alpha = 1;
        expect(service.savedColors[0]).toEqual(pushedColor);
    });
});
