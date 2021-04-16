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
        airBrushSpy = spyOn<any>(command, 'sprayAirBrush').and.callThrough();
    });

    it('should be created', () => {
        expect(command).toBeTruthy();
    });

    it('execute should call sprayAirBrush only one time if preview', () => {
        // tslint:disable:no-string-literal
        command['preview'] = true;
        command.execute();
        expect(airBrushSpy).toHaveBeenCalled();
        expect(airBrushSpy).toHaveBeenCalledTimes(1);
    });

    it('execute should call sprayAirBrush more than once if not preview', () => {
        command.execute();
        expect(airBrushSpy).toHaveBeenCalled();
        expect(airBrushSpy).not.toHaveBeenCalledTimes(1);
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

    it('sprayAirBrush should call canvas functions', () => {
        const arcSpy = spyOn(baseCtxStub, 'arc').and.callThrough();
        const fillSpy = spyOn(baseCtxStub, 'fill').and.callThrough();
        command['sprayAirBrush'](command['ctx'], AerosolConstants.MIN_EMISSION);
        expect(airBrushSpy).toHaveBeenCalled();
        expect(arcSpy).toHaveBeenCalled();
        expect(fillSpy).toHaveBeenCalled();
    });

    it('sprayAirBrush should set primary color', () => {
        command['sprayAirBrush'](command['ctx'], AerosolConstants.MIN_EMISSION);
        expect(airBrushSpy).toHaveBeenCalled();
        expect(baseCtxStub.fillStyle).toEqual('#2f2a36');
    });
});
