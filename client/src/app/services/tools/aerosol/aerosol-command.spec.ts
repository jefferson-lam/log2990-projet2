import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import * as AerosolConstants from '@app/constants/aerosol-constants';
import { AerosolCommand } from './aerosol-command';
import { AerosolService } from './aerosol-service';

// tslint:disable:no-any
describe('AerosolCommandService', () => {
    let command: AerosolCommand;
    let aerosolService: AerosolService;
    let canvasTestHelper: CanvasTestHelper;
    let baseCtxStub: CanvasRenderingContext2D;
    let airBrushSpy: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        aerosolService = TestBed.inject(AerosolService);

        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;

        aerosolService.pathData = Object.assign(
            [],
            [
                { x: 0, y: 0 },
                { x: 1, y: 1 },
            ],
        );
        command = new AerosolCommand(baseCtxStub, aerosolService);
        airBrushSpy = spyOn<any>(command, 'airBrushCircle').and.callThrough();
    });

    it('should be created', () => {
        expect(command).toBeTruthy();
    });

    it('execute should call airBrushCircle', () => {
        command.execute();
        expect(airBrushSpy).toHaveBeenCalled();
    });

    it('setValues should set values', () => {
        command.setValues({} as CanvasRenderingContext2D, aerosolService);
        // tslint:disable:no-string-literal
        expect(command['path']).toEqual(aerosolService.pathData);
        expect(command['aerosolRefresh']).toEqual(aerosolService.aerosolRefresh);
        expect(command['primaryColor']).toEqual(aerosolService.primaryColor);
        expect(command['waterDropWidth']).toEqual(aerosolService.waterDropWidth);
        expect(command['primaryColor']).toEqual(aerosolService.primaryColor);
    });

    it('airBrushCircle should call canvas functions', () => {
        const fillRectSpy = spyOn(baseCtxStub, 'fillRect').and.callThrough();
        command['airBrushCircle'](command['ctx'], AerosolConstants.MIN_EMISSION);
        expect(airBrushSpy).toHaveBeenCalled();
        expect(fillRectSpy).toHaveBeenCalled();
    });
});
