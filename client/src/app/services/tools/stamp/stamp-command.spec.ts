import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { StampService } from '@app/services/tools/stamp/stamp-service';
import { StampCommand } from './stamp-command';

// tslint:disable-next-line:no-any
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
        // tslint:disable-next-line:no-any
        const stampSpy = spyOn<any>(command, 'addStamp');
        command.execute();
        expect(stampSpy).toHaveBeenCalled();
    });

    it('setValues should set values', () => {
        command.setValues({} as CanvasRenderingContext2D, stampService);

        expect(command.rotationAngle).toEqual(stampService.rotationAngle);
        expect(command.imageSource).toEqual(stampService.imageSource);
        expect(command.imageZoomFactor).toEqual(stampService.imageZoomFactor);
        expect(command.cornerCoords).toEqual(stampService.cornerCoords);
    });

    it('addStamp should call getStampSize and set right zoomFactor', () => {
        command.getStampSize(0);
        expect(command.imageZoomFactor).toEqual(1);
    });

    it('addStamp should call getStampSize and set right zoomFactor', () => {
        const ZOOM_FACTOR = -1;
        command.getStampSize(ZOOM_FACTOR);
        expect(command.imageZoomFactor).toEqual(1);
    });
});
