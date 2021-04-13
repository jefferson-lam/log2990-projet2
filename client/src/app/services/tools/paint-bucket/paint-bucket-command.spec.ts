import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { ColorRgba } from '@app/classes/color-rgb';
import { MouseButton } from '@app/constants/mouse-constants';
import { ALPHA_INDEX, DEFAULT_TOLERANCE_VALUE, DIMENSION_4D, MAX_RGB_VALUE } from '@app/constants/paint-bucket-constants';
import { PaintBucketCommand } from './paint-bucket-command';
import { PaintBucketService } from './paint-bucket-service';

// tslint:disable:max-file-line-count
describe('PaintBucketCommand', () => {
    let command: PaintBucketCommand;
    let paintBucketService: PaintBucketService;

    let canvasTestHelper: CanvasTestHelper;
    let baseCtxStub: CanvasRenderingContext2D;

    let fillColor: ColorRgba;

    let floodFillSpy: jasmine.Spy;
    let fillSpy: jasmine.Spy;

    const RED_VALUE = 110;
    const GREEN_VALUE = 225;
    const BLUE_VALUE = 202;
    const OPACITY = 255;
    const TEST_PRIMARY_COLOR = `rgb(${RED_VALUE}, ${GREEN_VALUE}, ${BLUE_VALUE}, ${OPACITY})`;
    const TEST_TOLERANCE_VALUE = DEFAULT_TOLERANCE_VALUE;
    const MAX_TOLERANCE = 255;
    const TOLERANCE_25 = 64;
    const TOLERANCE_50 = 128;
    const TOLERANCE_75 = 191;
    const DEFAULT_MOUSE_BUTTON = MouseButton.Left;
    const DEFAULT_START_X = 30;
    const DEFAULT_START_Y = 30;
    const DEFAULT_CANVAS_HEIGHT = 250;
    const DEFAULT_CANVAS_WIDTH = 250;
    const NEXT_COLOR_INCREMENT = 4;
    const COLOR_RANGE = 3;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        paintBucketService = TestBed.inject(PaintBucketService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);

        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        baseCtxStub.canvas.width = DEFAULT_CANVAS_WIDTH;
        baseCtxStub.canvas.height = DEFAULT_CANVAS_HEIGHT;

        paintBucketService.setPrimaryColor(TEST_PRIMARY_COLOR);
        paintBucketService.setToleranceValue(TEST_TOLERANCE_VALUE);
        paintBucketService.mouseButtonClicked = DEFAULT_MOUSE_BUTTON;
        paintBucketService.startX = DEFAULT_START_X;
        paintBucketService.startY = DEFAULT_START_Y;
        fillColor = {
            red: 190,
            green: 170,
            blue: 70,
            alpha: 255,
        };
        paintBucketService.primaryColorRgba = fillColor;
        command = new PaintBucketCommand(baseCtxStub, paintBucketService);

        floodFillSpy = spyOn(command, 'floodFill').and.callThrough();
        fillSpy = spyOn(command, 'fill').and.callThrough();
    });

    it('should be created', () => {
        expect(command).toBeTruthy();
    });

    it('execute should call floodfill if left mouse button', () => {
        command.mouseButtonClicked = MouseButton.Left;
        command.execute();
        expect(floodFillSpy).toHaveBeenCalled();
        expect(fillSpy).not.toHaveBeenCalled();
    });

    it('execute should call floodfill if right mouse button', () => {
        command.mouseButtonClicked = MouseButton.Right;
        command.execute();
        expect(fillSpy).toHaveBeenCalled();
        expect(floodFillSpy).not.toHaveBeenCalled();
    });

    it('execute should not call if not valid mouse button', () => {
        command.mouseButtonClicked = MouseButton.Forward;
        command.execute();
        expect(fillSpy).not.toHaveBeenCalled();
        expect(floodFillSpy).not.toHaveBeenCalled();
    });

    it('setValues should set values', () => {
        command.setValues({} as CanvasRenderingContext2D, paintBucketService);
        expect(command.primaryColorRgba).toEqual(paintBucketService.primaryColorRgba);
        expect(command.primaryColor).toEqual(paintBucketService.primaryColor);
        expect(command.startX).toEqual(paintBucketService.startX);
        expect(command.startY).toEqual(paintBucketService.startY);
        expect(command.toleranceValue).toEqual(paintBucketService.toleranceValue);
        expect(command.mouseButtonClicked).toEqual(paintBucketService.mouseButtonClicked);
    });

    it('rgba2number should correctly convert rgba to decimal', () => {
        const expectedColor = -12145986;
        const result = command.rgba2number(fillColor);
        expect(result).toEqual(expectedColor);
    });

    it('normaliseTolerance should return correct tolerance value', () => {
        const expectedTolerance = 256;
        const result = command.normaliseTolerance(TOLERANCE_50, DIMENSION_4D);
        expect(result).toEqual(expectedTolerance);
    });

    it('number2rgba should correctly convert white hex color into rgba interface', () => {
        // White -> #FF000000 -> 4278190080
        const hexColor = 4278190080;
        const expectedColor = { red: 0, green: 0, blue: 0, alpha: 1 };
        const result = command.number2rgba(hexColor);
        expect(result).toEqual(expectedColor);
    });

    it('number2rgba should correctly convert black hex color into rgba interface', () => {
        // Black -> #FF000000 -> 4294967295
        const hexColor = 4294967295;
        const expectedColor = { red: 255, green: 255, blue: 255, alpha: 1 };
        const result = command.number2rgba(hexColor);
        expect(result).toEqual(expectedColor);
    });

    it('number2rgba should correctly convert red hex color into rgba interface', () => {
        // Red -> #FF0000FF -> 4278190335
        const hexColor = 4278190335;
        const expectedColor = { red: 255, green: 0, blue: 0, alpha: 1 };
        const result = command.number2rgba(hexColor);
        expect(result).toEqual(expectedColor);
    });

    it('number2rgba should correctly convert green hex color into rgba interface', () => {
        // Green -> #FF00FF00 -> 4278255360
        const hexColor = 4278255360;
        const expectedColor = { red: 0, green: 255, blue: 0, alpha: 1 };
        const result = command.number2rgba(hexColor);
        expect(result).toEqual(expectedColor);
    });

    it('number2rgba should correctly convert blue hex color into rgba interface', () => {
        // Blue -> #FFFF0000 -> 4294901760
        const hexColor = 4294901760;
        const expectedColor = { red: 0, green: 0, blue: 255, alpha: 1 };
        const result = command.number2rgba(hexColor);
        expect(result).toEqual(expectedColor);
    });

    it('number2rgba should correctly convert hex color into rgba interface', () => {
        // Light blue -> #FFCDC21C -> 4291674652
        const hexColor = 4291674652;
        const expectedColor = { red: 28, green: 194, blue: 205, alpha: 1 };
        const result = command.number2rgba(hexColor);
        expect(result).toEqual(expectedColor);
    });

    it('number2rgba should correctly convert hex color with fractional opacity into rgba interface', () => {
        // Light blue -> #FFCDC21C -> 4291674652
        const hexColor = 4291674652;
        const expectedColor = { red: 28, green: 194, blue: 205, alpha: 1 };
        const result = command.number2rgba(hexColor);
        expect(result).toEqual(expectedColor);
    });

    it('calculateColorDistance should correctly calculate max euclidian distance between two colors', () => {
        const blackRgba = {
            red: 0,
            green: 0,
            blue: 0,
            alpha: 0,
        } as ColorRgba;
        const whiteRgba = {
            red: 255,
            green: 255,
            blue: 255,
            alpha: 255,
        } as ColorRgba;
        const expectedDistance = 510;
        const distance = command.calculateColorDistance(blackRgba, whiteRgba);
        expect(distance).toEqual(expectedDistance);
    });

    it('calculateColorDistance should correctly calculate same max euclidian distance between two colors if inversed param', () => {
        const blackRgba = {
            red: 0,
            green: 0,
            blue: 0,
            alpha: 0,
        } as ColorRgba;
        const whiteRgba = {
            red: 255,
            green: 255,
            blue: 255,
            alpha: 255,
        } as ColorRgba;
        const expectedDistance = 510;
        const distance = command.calculateColorDistance(whiteRgba, blackRgba);
        expect(distance).toEqual(expectedDistance);
    });

    it('calculateColorDistance should correctly calculate min euclidian distance between two colors', () => {
        const blackRgba = {
            red: 0,
            green: 0,
            blue: 0,
            alpha: 0,
        } as ColorRgba;
        const whiteRgba = {
            red: 0,
            green: 0,
            blue: 0,
            alpha: 0,
        } as ColorRgba;
        const expectedDistance = 0;
        const distance = command.calculateColorDistance(whiteRgba, blackRgba);
        expect(distance).toEqual(expectedDistance);
    });

    it('calculateColorDistance should correctly calculate distance between two colors', () => {
        const blackRgba = {
            red: 128,
            green: 180,
            blue: 232,
            alpha: 255,
        } as ColorRgba;
        const whiteRgba = {
            red: 84,
            green: 123,
            blue: 214,
            alpha: 125,
        } as ColorRgba;
        const expectedDistance = 150;
        const distance = command.calculateColorDistance(whiteRgba, blackRgba);
        expect(distance).toEqual(expectedDistance);
    });

    // Start of tests to validate the tolerance value
    // The following strategy will be used:
    // We scale the tolerance value to fit a 4d space (RGBA) where max tolerance is sqrt(255**2 * 4)
    // which is max euclidian distance
    // We calculate the euclidian distance between colors compare it to the tolerance value
    // Return true if valid, false if not.

    it('should return true if both colors are the same and if tolerance is 0', () => {
        command.toleranceValue = 0;
        const currentRgba = {
            red: 128,
            green: 180,
            blue: 232,
            alpha: 255,
        } as ColorRgba;
        const targetRgba = {
            red: 128,
            green: 180,
            blue: 232,
            alpha: 255,
        } as ColorRgba;
        const distance = command.calculateColorDistance(currentRgba, targetRgba);
        expect(distance <= command.toleranceValue).toEqual(true);
    });

    it('should return false if both colors are not the same and if tolerance is 0', () => {
        command.toleranceValue = 0;
        const currentRgba = {
            red: 127,
            green: 180,
            blue: 232,
            alpha: 255,
        } as ColorRgba;
        const targetRgba = {
            red: 128,
            green: 180,
            blue: 232,
            alpha: 255,
        } as ColorRgba;
        const distance = command.calculateColorDistance(currentRgba, targetRgba);
        expect(distance <= command.toleranceValue).toEqual(false);
    });

    // Tolerance: 25/100 -> 64/255 -> 128/512
    it('should return true if both colors distance of 0 and if tolerance is 25', () => {
        const toleranceValue = Math.round(Math.sqrt(Math.pow(TOLERANCE_25, 2) * DIMENSION_4D));
        command.toleranceValue = toleranceValue;
        const currentRgba = {
            red: 128,
            green: 180,
            blue: 232,
            alpha: 255,
        } as ColorRgba;
        const targetRgba = {
            red: 128,
            green: 180,
            blue: 232,
            alpha: 255,
        } as ColorRgba;
        const distance = command.calculateColorDistance(currentRgba, targetRgba);
        expect(distance <= command.toleranceValue).toEqual(true);
    });

    // Distance: 128
    it('should return true if both colors distance of 25 and if tolerance is 25', () => {
        const toleranceValue = Math.round(Math.sqrt(Math.pow(TOLERANCE_25, 2) * DIMENSION_4D));
        command.toleranceValue = toleranceValue;
        const currentRgba = {
            red: 97,
            green: 72,
            blue: 170,
            alpha: 255,
        } as ColorRgba;
        const targetRgba = {
            red: 128,
            green: 180,
            blue: 232,
            alpha: 255,
        } as ColorRgba;
        const distance = command.calculateColorDistance(currentRgba, targetRgba);
        expect(distance <= command.toleranceValue).toEqual(true);
    });

    // Distance: 129
    it('should return false if both colors distance of 26 and if tolerance is 25', () => {
        const toleranceValue = Math.round(Math.sqrt(Math.pow(TOLERANCE_25, 2) * DIMENSION_4D));
        command.toleranceValue = toleranceValue;
        const currentRgba = {
            red: 97,
            green: 71,
            blue: 170,
            alpha: 255,
        } as ColorRgba;
        const targetRgba = {
            red: 128,
            green: 180,
            blue: 232,
            alpha: 255,
        } as ColorRgba;
        const distance = command.calculateColorDistance(currentRgba, targetRgba);
        expect(distance <= command.toleranceValue).toEqual(false);
    });

    // Tolerance: 50/100 -> 128/255 -> 256/512
    it('should return true if both colors distance of 0 and if tolerance is 50', () => {
        const toleranceValue = Math.round(Math.sqrt(Math.pow(TOLERANCE_50, 2) * DIMENSION_4D));
        command.toleranceValue = toleranceValue;
        const currentRgba = {
            red: 128,
            green: 180,
            blue: 232,
            alpha: 255,
        } as ColorRgba;
        const targetRgba = {
            red: 128,
            green: 180,
            blue: 232,
            alpha: 255,
        } as ColorRgba;
        const distance = command.calculateColorDistance(currentRgba, targetRgba);
        expect(distance <= command.toleranceValue).toEqual(true);
    });

    // Distance: 256
    it('should return true if both colors distance of 50 and if tolerance is 50', () => {
        const toleranceValue = Math.round(Math.sqrt(Math.pow(TOLERANCE_50, 2) * DIMENSION_4D));
        command.toleranceValue = toleranceValue;
        const currentRgba = {
            red: 50,
            green: 72,
            blue: 95,
            alpha: 84,
        } as ColorRgba;
        const targetRgba = {
            red: 128,
            green: 180,
            blue: 232,
            alpha: 255,
        } as ColorRgba;
        const distance = command.calculateColorDistance(currentRgba, targetRgba);
        expect(distance <= command.toleranceValue).toEqual(true);
    });

    // Distance: 257
    it('should return false if both colors distance of 51 and if tolerance is 50', () => {
        const toleranceValue = Math.round(Math.sqrt(Math.pow(TOLERANCE_50, 2) * DIMENSION_4D));
        command.toleranceValue = toleranceValue;
        const currentRgba = {
            red: 50,
            green: 72,
            blue: 95,
            alpha: 83,
        } as ColorRgba;
        const targetRgba = {
            red: 128,
            green: 180,
            blue: 232,
            alpha: 255,
        } as ColorRgba;
        const distance = command.calculateColorDistance(currentRgba, targetRgba);
        expect(distance <= command.toleranceValue).toEqual(false);
    });

    // Tolerance: 75/100 -> 191/255 -> 382/512
    it('should return true if both colors distance of 0 and if tolerance is 75', () => {
        const toleranceValue = Math.round(Math.sqrt(Math.pow(TOLERANCE_75, 2) * DIMENSION_4D));
        command.toleranceValue = toleranceValue;
        const currentRgba = {
            red: 128,
            green: 180,
            blue: 232,
            alpha: 255,
        } as ColorRgba;
        const targetRgba = {
            red: 128,
            green: 180,
            blue: 232,
            alpha: 255,
        } as ColorRgba;
        const distance = command.calculateColorDistance(currentRgba, targetRgba);
        expect(distance <= command.toleranceValue).toEqual(true);
    });

    // Distance: 384, tolerance = 382
    it('should return true if both colors distance of 75 and if tolerance is 75', () => {
        const toleranceValue = Math.round(Math.sqrt(Math.pow(TOLERANCE_75, 2) * DIMENSION_4D));
        command.toleranceValue = toleranceValue;
        const currentRgba = {
            red: 50,
            green: 41,
            blue: 85,
            alpha: 84,
        } as ColorRgba;
        const targetRgba = {
            red: 255,
            green: 255,
            blue: 255,
            alpha: 255,
        } as ColorRgba;
        const distance = command.calculateColorDistance(currentRgba, targetRgba);
        expect(distance <= command.toleranceValue).toEqual(true);
    });

    // Distance: 385, tolerance 384
    it('should return false if both colors distance of 76 and if tolerance is 76', () => {
        const toleranceValue = Math.round(Math.sqrt(Math.pow(TOLERANCE_75, 2) * DIMENSION_4D));
        command.toleranceValue = toleranceValue;
        const currentRgba = {
            red: 50,
            green: 30,
            blue: 85,
            alpha: 84,
        } as ColorRgba;
        const targetRgba = {
            red: 255,
            green: 255,
            blue: 255,
            alpha: 255,
        } as ColorRgba;
        const distance = command.calculateColorDistance(currentRgba, targetRgba);
        expect(distance <= command.toleranceValue).toEqual(false);
    });

    // Tolerance: 100/100 -> 255/255 -> 512/512
    it('should return true if both colors distance of 0 and if tolerance is 100', () => {
        const toleranceValue = Math.round(Math.sqrt(Math.pow(MAX_TOLERANCE, 2) * DIMENSION_4D));
        command.toleranceValue = toleranceValue;
        const currentRgba = {
            red: 128,
            green: 180,
            blue: 232,
            alpha: 255,
        } as ColorRgba;
        const targetRgba = {
            red: 128,
            green: 180,
            blue: 232,
            alpha: 255,
        } as ColorRgba;
        const distance = command.calculateColorDistance(currentRgba, targetRgba);
        expect(distance <= command.toleranceValue).toEqual(true);
    });

    // Distance: 510, tolerance = 510
    it('should return true if both colors distance of 100 and if tolerance is 100', () => {
        const toleranceValue = Math.round(Math.sqrt(Math.pow(MAX_TOLERANCE, 2) * DIMENSION_4D));
        command.toleranceValue = toleranceValue;
        const currentRgba = {
            red: 0,
            green: 0,
            blue: 0,
            alpha: 0,
        } as ColorRgba;
        const targetRgba = {
            red: 255,
            green: 255,
            blue: 255,
            alpha: 255,
        } as ColorRgba;
        const distance = command.calculateColorDistance(currentRgba, targetRgba);
        expect(distance <= command.toleranceValue).toEqual(true);
    });

    // Testing floodfill functionality by drawing rectangles and filling rectangle, and checking if
    // specified rectangles are correctly filled
    it('fill should correctly fill both rectangles of same color', () => {
        const rectangleHeight = 50;
        const rectangleWidth = 50;
        const rect1StartX = 25;
        const rect1StartY = 25;
        const rect2StartX = 100;
        const rect2StartY = 100;
        command.toleranceValue = DEFAULT_TOLERANCE_VALUE;
        baseCtxStub.fillStyle = 'green';
        baseCtxStub.fillRect(rect1StartX, rect1StartY, rectangleWidth, rectangleHeight);
        baseCtxStub.fillRect(rect2StartX, rect2StartY, rectangleWidth, rectangleHeight);

        command.fill(baseCtxStub);
        const rect1 = baseCtxStub.getImageData(rect1StartX, rect1StartY, rectangleWidth, rectangleHeight);
        const rect2 = baseCtxStub.getImageData(rect2StartX, rect2StartY, rectangleWidth, rectangleHeight);
        for (let i = 0; i + COLOR_RANGE < rect1.data.length; i += NEXT_COLOR_INCREMENT) {
            expect(rect1.data[i]).toEqual(fillColor.red);
            expect(rect1.data[i + 1]).toEqual(fillColor.green);
            expect(rect1.data[i + 2]).toEqual(fillColor.blue);
            expect(rect1.data[i + ALPHA_INDEX]).toEqual(fillColor.alpha);
        }

        for (let i = 0; i + COLOR_RANGE < rect2.data.length; i += NEXT_COLOR_INCREMENT) {
            expect(rect2.data[i]).toEqual(fillColor.red);
            expect(rect2.data[i + 1]).toEqual(fillColor.green);
            expect(rect2.data[i + 2]).toEqual(fillColor.blue);
            expect(rect2.data[i + ALPHA_INDEX]).toEqual(fillColor.alpha);
        }
    });

    it('fill should correctly fill both rectangles of color of 75 tolerance', () => {
        const rectangleHeight = 50;
        const rectangleWidth = 50;
        const rect1StartX = 25;
        const rect1StartY = 25;
        const rect2StartX = 100;
        const rect2StartY = 100;
        const tolerance = 192;
        command.toleranceValue = tolerance;
        baseCtxStub.fillStyle = 'green';
        baseCtxStub.fillRect(rect1StartX, rect1StartY, rectangleWidth, rectangleHeight);
        baseCtxStub.fillStyle = '#1bc42c'; // dark green
        baseCtxStub.fillRect(rect2StartX, rect2StartY, rectangleWidth, rectangleHeight);

        command.fill(baseCtxStub);
        const rect1 = baseCtxStub.getImageData(rect1StartX, rect1StartY, rectangleWidth, rectangleHeight);
        const rect2 = baseCtxStub.getImageData(rect2StartX, rect2StartY, rectangleWidth, rectangleHeight);
        for (let i = 0; i + COLOR_RANGE < rect1.data.length; i += NEXT_COLOR_INCREMENT) {
            expect(rect1.data[i]).toEqual(fillColor.red);
            expect(rect1.data[i + 1]).toEqual(fillColor.green);
            expect(rect1.data[i + 2]).toEqual(fillColor.blue);
            expect(rect1.data[i + ALPHA_INDEX]).toEqual(fillColor.alpha);
        }

        for (let i = 0; i + COLOR_RANGE < rect2.data.length; i += NEXT_COLOR_INCREMENT) {
            expect(rect2.data[i]).toEqual(fillColor.red);
            expect(rect2.data[i + 1]).toEqual(fillColor.green);
            expect(rect2.data[i + 2]).toEqual(fillColor.blue);
            expect(rect2.data[i + ALPHA_INDEX]).toEqual(fillColor.alpha);
        }
    });

    it('fill should fill everything with a tolerance of 100', () => {
        const rectangleHeight = 50;
        const rectangleWidth = 50;
        const rect1StartX = 25;
        const rect1StartY = 25;
        const rect2StartX = 100;
        const rect2StartY = 100;
        const tolerance = 255;
        command.toleranceValue = tolerance;
        baseCtxStub.fillStyle = 'green';
        baseCtxStub.fillRect(rect1StartX, rect1StartY, rectangleWidth, rectangleHeight);
        baseCtxStub.fillStyle = '#1bc42c'; // dark green
        baseCtxStub.fillRect(rect2StartX, rect2StartY, rectangleWidth, rectangleHeight);

        command.fill(baseCtxStub);
        const imageData = baseCtxStub.getImageData(0, 0, baseCtxStub.canvas.width, baseCtxStub.canvas.height);
        for (let i = 0; i + COLOR_RANGE < imageData.data.length; i += NEXT_COLOR_INCREMENT) {
            expect(imageData.data[i]).toEqual(fillColor.red);
            expect(imageData.data[i + 1]).toEqual(fillColor.green);
            expect(imageData.data[i + 2]).toEqual(fillColor.blue);
            expect(imageData.data[i + ALPHA_INDEX]).toEqual(fillColor.alpha);
        }
    });

    it('floodFill should correctly fill colored rectangle that is selected, not the surounding pixels', () => {
        const rectangleHeight = 50;
        const rectangleWidth = 50;
        const rect1StartX = 25;
        const rect1StartY = 25;
        const rect2StartX = 100;
        const rect2StartY = 100;
        const expectedGreenGValue = 128;
        baseCtxStub.fillStyle = '#1bc42c'; // dark green
        baseCtxStub.fillRect(rect1StartX, rect1StartY, rectangleWidth, rectangleHeight);
        baseCtxStub.fillStyle = 'green';
        baseCtxStub.fillRect(rect2StartX, rect2StartY, rectangleWidth, rectangleHeight);
        command.toleranceValue = DEFAULT_TOLERANCE_VALUE;

        command.floodFill(baseCtxStub);

        const rect1 = baseCtxStub.getImageData(rect1StartX, rect1StartY, rectangleWidth, rectangleHeight);
        const rect2 = baseCtxStub.getImageData(rect2StartX, rect2StartY, rectangleWidth, rectangleHeight);
        for (let i = 0; i + COLOR_RANGE < rect1.data.length; i += NEXT_COLOR_INCREMENT) {
            expect(rect1.data[i]).toEqual(fillColor.red);
            expect(rect1.data[i + 1]).toEqual(fillColor.green);
            expect(rect1.data[i + 2]).toEqual(fillColor.blue);
            expect(rect1.data[i + ALPHA_INDEX]).toEqual(fillColor.alpha);
        }

        for (let i = 0; i + COLOR_RANGE < rect2.data.length; i += NEXT_COLOR_INCREMENT) {
            expect(rect2.data[i]).toEqual(0);
            expect(rect2.data[i + 1]).toEqual(expectedGreenGValue);
            expect(rect2.data[i + 2]).toEqual(0);
            expect(rect2.data[i + ALPHA_INDEX]).toEqual(MAX_RGB_VALUE);
        }
    });

    it('floodfill should fill all connected pixels that are same color', () => {
        const rectangleHeight = 50;
        const rectangleWidth = 50;
        const rect1StartX = 25;
        const rect1StartY = 25;
        const rect2StartX = 50;
        const rect2StartY = 50;
        baseCtxStub.fillStyle = '#1bc42c'; // dark green
        baseCtxStub.fillRect(rect1StartX, rect1StartY, rectangleWidth, rectangleHeight);
        baseCtxStub.fillRect(rect2StartX, rect2StartY, rectangleWidth, rectangleHeight);
        command.toleranceValue = DEFAULT_TOLERANCE_VALUE;
        command.floodFill(baseCtxStub);
        const rect1 = baseCtxStub.getImageData(rect1StartX, rect1StartY, rectangleWidth, rectangleHeight);
        const rect2 = baseCtxStub.getImageData(rect2StartX, rect2StartY, rectangleWidth, rectangleHeight);
        for (let i = 0; i + COLOR_RANGE < rect1.data.length; i += NEXT_COLOR_INCREMENT) {
            expect(rect1.data[i]).toEqual(fillColor.red);
            expect(rect1.data[i + 1]).toEqual(fillColor.green);
            expect(rect1.data[i + 2]).toEqual(fillColor.blue);
            expect(rect1.data[i + ALPHA_INDEX]).toEqual(fillColor.alpha);
        }

        for (let i = 0; i + COLOR_RANGE < rect2.data.length; i += NEXT_COLOR_INCREMENT) {
            expect(rect2.data[i]).toEqual(fillColor.red);
            expect(rect2.data[i + 1]).toEqual(fillColor.green);
            expect(rect2.data[i + 2]).toEqual(fillColor.blue);
            expect(rect2.data[i + ALPHA_INDEX]).toEqual(fillColor.alpha);
        }
    });

    it('floodfill should fill all connected pixels whose color is close if called with toleranceValue', () => {
        const rectangleHeight = 50;
        const rectangleWidth = 50;
        const rect1StartX = 25;
        const rect1StartY = 25;
        const rect2StartX = 50;
        const rect2StartY = 50;
        const tolerance = 128;
        baseCtxStub.fillStyle = '#1bc42c'; // dark green
        baseCtxStub.fillRect(rect1StartX, rect1StartY, rectangleWidth, rectangleHeight);
        baseCtxStub.fillStyle = 'green';
        baseCtxStub.fillRect(rect2StartX, rect2StartY, rectangleWidth, rectangleHeight);
        command.toleranceValue = tolerance;
        command.floodFill(baseCtxStub);
        const rect1 = baseCtxStub.getImageData(rect1StartX, rect1StartY, rectangleWidth, rectangleHeight);
        const rect2 = baseCtxStub.getImageData(rect2StartX, rect2StartY, rectangleWidth, rectangleHeight);
        for (let i = 0; i + COLOR_RANGE < rect1.data.length; i += NEXT_COLOR_INCREMENT) {
            expect(rect1.data[i]).toEqual(fillColor.red);
            expect(rect1.data[i + 1]).toEqual(fillColor.green);
            expect(rect1.data[i + 2]).toEqual(fillColor.blue);
            expect(rect1.data[i + ALPHA_INDEX]).toEqual(fillColor.alpha);
        }

        for (let i = 0; i + COLOR_RANGE < rect2.data.length; i += NEXT_COLOR_INCREMENT) {
            expect(rect2.data[i]).toEqual(fillColor.red);
            expect(rect2.data[i + 1]).toEqual(fillColor.green);
            expect(rect2.data[i + 2]).toEqual(fillColor.blue);
            expect(rect2.data[i + ALPHA_INDEX]).toEqual(fillColor.alpha);
        }
    });

    it('floodfill should fill all connected pixels whose color is close if called with 100 toleranceValue', () => {
        const tolerance = 255;
        command.toleranceValue = tolerance;
        command.floodFill(baseCtxStub);
        const imageData = baseCtxStub.getImageData(0, 0, baseCtxStub.canvas.width, baseCtxStub.canvas.height);
        for (let i = 0; i + ALPHA_INDEX < imageData.data.length; i += NEXT_COLOR_INCREMENT) {
            expect(imageData.data[i]).toEqual(fillColor.red);
            expect(imageData.data[i + 1]).toEqual(fillColor.green);
            expect(imageData.data[i + 2]).toEqual(fillColor.blue);
            expect(imageData.data[i + ALPHA_INDEX]).toEqual(fillColor.alpha);
        }
    });

    it('floodFill called on empty canvas should return', () => {
        baseCtxStub.canvas.width = 1;
        baseCtxStub.canvas.height = 1;
        expect(() => {
            command.floodFill(baseCtxStub);
        }).not.toThrow();
    });
});
