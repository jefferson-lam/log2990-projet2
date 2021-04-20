import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import * as StampConstants from '@app/constants/stamp-constants';
import { StampService } from '@app/services/tools/stamp/stamp-service';
import { StampCommand } from './stamp-command';

// tslint:disable:no-any
// tslint:disable:no-string-literal
describe('StampCommand', () => {
    let command: StampCommand;
    let stampService: StampService;
    let baseCtxStub: CanvasRenderingContext2D;

    let canvasTestHelper: CanvasTestHelper;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        stampService = TestBed.inject(StampService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        command = new StampCommand(baseCtxStub, stampService);
    });

    it('should be created', () => {
        expect(command).toBeTruthy();
    });

    it('execute should call addStamp', () => {
        const addStampSpy = spyOn<any>(command, 'addStamp');
        command.execute();
        expect(addStampSpy).toHaveBeenCalled();
    });

    it('setValues should set values and call loadStamp', () => {
        const loadSpy = spyOn<any>(command, 'loadStamp');
        command.setValues({} as CanvasRenderingContext2D, stampService);

        expect(loadSpy).toHaveBeenCalled();
        expect(command['rotationAngle']).toEqual(stampService.rotationAngle);
        expect(command['imageZoomFactor']).toEqual(stampService.imageZoomFactor);
        expect(command['position']).toEqual(stampService.position);
    });

    it('addStamp should call pasteStamp and canvas functions', () => {
        const pasteStampSpy = spyOn<any>(command, 'pasteStamp');
        const saveSpy = spyOn(baseCtxStub, 'save');
        const translateSpy = spyOn(baseCtxStub, 'translate');
        const rotateSpy = spyOn(baseCtxStub, 'rotate');
        const restoreSpy = spyOn(baseCtxStub, 'restore');

        command['addStamp']();

        expect(pasteStampSpy).toHaveBeenCalled();
        expect(saveSpy).toHaveBeenCalled();
        expect(translateSpy).toHaveBeenCalled();
        expect(translateSpy).toHaveBeenCalledWith(command['position'].x, command['position'].y);
        expect(rotateSpy).toHaveBeenCalled();
        expect(rotateSpy).toHaveBeenCalledWith(command['rotationAngle']);
        expect(restoreSpy).toHaveBeenCalled();
    });

    it('pasteStamp should call drawImage from context and set right values on canvas', () => {
        const drawSpy = spyOn(baseCtxStub, 'drawImage');
        command['pasteStamp']();

        expect(drawSpy).toHaveBeenCalled();
    });

    it('getStampSize should set zoom factor to one and return right value if zoom factor zero', () => {
        command['imageZoomFactor'] = 0;
        const result = command['getStampSize']();
        expect(command['imageZoomFactor']).toEqual(1);
        expect(result).toBe(StampConstants.INIT_STAMP_SIZE / 2);
    });

    it('getStampSize should return right value', () => {
        // tslint:disable-next-line:no-magic-numbers
        command['imageZoomFactor'] = -2;
        const expectedValue = StampConstants.INIT_STAMP_SIZE / 2 / Math.abs(command['imageZoomFactor']);
        const result = command['getStampSize']();
        expect(result).toBe(expectedValue);
    });
});
