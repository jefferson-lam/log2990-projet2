import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Tool } from '@app/classes/tool';
import { SettingsManagerService } from './settings-manager';
import { ToolManagerService } from './tool-manager-service';

// tslint:disable:no-any
describe('SettingsManagerService', () => {
    let service: SettingsManagerService;
    let toolSpy: jasmine.SpyObj<Tool>;
    let toolManagerSpy: jasmine.SpyObj<ToolManagerService>;

    beforeEach(() => {
        toolSpy = jasmine.createSpyObj('Tool', ['setLineWidth', 'setJunctionRadius', 'setToleranceValue']);
        toolManagerSpy = jasmine.createSpyObj('ToolManagerService', ['setPrimaryColorTools', 'setSecondaryColorTools'], ['currentTool']);
        (Object.getOwnPropertyDescriptor(toolManagerSpy, 'currentTool')?.get as jasmine.Spy<() => Tool>).and.returnValue(toolSpy);
        TestBed.configureTestingModule({
            providers: [{ provide: ToolManagerService, useValue: toolManagerSpy }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        service = TestBed.inject(SettingsManagerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('changeSizeTool should call setSize of current tool', () => {
        const EXPECTED_TOOL_SIZE = 17;
        service.setLineWidth(EXPECTED_TOOL_SIZE);
        expect(toolSpy.setLineWidth).toHaveBeenCalled();
    });

    it('setFillMode should set the fill mode correctly of current tool', () => {
        const EXPECTED_FILL_MODE = 2;
        service.setFillMode(EXPECTED_FILL_MODE);
        expect(toolSpy.fillMode).toEqual(EXPECTED_FILL_MODE);
    });

    it('setJunctionRadius should call setJunctionRadius of current tool', () => {
        const newJunctionRadius = 25;
        service.setJunctionRadius(newJunctionRadius);
        expect(toolSpy.setJunctionRadius).toHaveBeenCalled();
    });

    it('setWithJunction should call setWithJunction of current tool', () => {
        const hasJunction = true;
        service.setWithJunction(hasJunction);
        expect(toolSpy.withJunction).toBeTrue();
    });

    it('setSidesCount should set the sides count correctly of current tool', () => {
        const EXPECTED_SIDES_COUNT = 10;
        service.setSidesCount(EXPECTED_SIDES_COUNT);
        expect(toolSpy.initNumberSides).toEqual(EXPECTED_SIDES_COUNT);
    });

    it('setWaterDropWidth should call setWaterDropWidth of toolManager', () => {
        const EXPECTED_WATER_DROP_WIDTH = 50;
        service.setWaterDropWidth(EXPECTED_WATER_DROP_WIDTH);
        expect(toolSpy.waterDropWidth).toEqual(EXPECTED_WATER_DROP_WIDTH);
    });

    it('setEmissionCount should call setEmissionCount of toolManager', () => {
        const EXPECTED_EMISSION_COUNT = 50;
        service.setEmissionCount(EXPECTED_EMISSION_COUNT);
        expect(toolSpy.emissionCount).toEqual(EXPECTED_EMISSION_COUNT);
    });

    it('setToleranceValue should call setToleranceValue of toolManagers currentTool', () => {
        const EXPECTED_TOLERANCE_VALUE = 75;
        service.setToleranceValue(EXPECTED_TOLERANCE_VALUE);
        expect(toolSpy.setToleranceValue).toHaveBeenCalled();
    });
});
