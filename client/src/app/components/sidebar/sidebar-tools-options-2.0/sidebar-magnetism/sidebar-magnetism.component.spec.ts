import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as MagnestismConstants from '@app/constants/magnetism-constants';
import { MagnetismService } from '@app/services/magnetism/magnetism.service';
import { Subject } from 'rxjs';
import { SidebarMagnetismComponent } from './sidebar-magnetism.component';

// tslint:disable: no-any
// tslint:disable: no-string-literal
describe('SidebarMagnetismComponent', () => {
    let component: SidebarMagnetismComponent;
    let fixture: ComponentFixture<SidebarMagnetismComponent>;
    let magnetismServiceSpy: jasmine.SpyObj<MagnetismService>;

    beforeEach(async(() => {
        magnetismServiceSpy = jasmine.createSpyObj('MagnetismService', [], {
            isMagnetismOn: false,
            magnetismStateSubject: new Subject(),
            referenceResizerMode: MagnestismConstants.MagnetizedPoint.TOP_LEFT,
        });

        TestBed.configureTestingModule({
            declarations: [SidebarMagnetismComponent],
            providers: [{ provide: MagnetismService, useValue: magnetismServiceSpy }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarMagnetismComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('emission of magnetismValueChanged should change magnetismService.isMagnetismOn', () => {
        component.magnetismValueChanged.emit(false);
        expect(component['magnetismService'].isMagnetismOn).toBeFalse();
    });

    it('emission of referenceCornerChanged should change magnetismService.referenceResizerMode', () => {
        component.magnetizedPointChanged.emit(MagnestismConstants.MagnetizedPoint.TOP_LEFT);
        expect(component['magnetismService'].magnetizedPoint).toEqual(MagnestismConstants.MagnetizedPoint.TOP_LEFT);
    });

    it('canvasGridService.gridVisibility should change toggle state of toggle magnetism of magnetismToggle slider.', () => {
        const EXPECTED_STATE = true;
        component['magnetismService'].magnetismStateSubject.next(EXPECTED_STATE);
        expect(component['magnetismToggle'].checked).toEqual(EXPECTED_STATE);
    });

    it('emitMagnetismValue should emit component.isMagnetismOn', () => {
        const magnetismValueSpy = spyOn(component.magnetismValueChanged, 'emit');
        component.emitMagnetismValue();
        expect(magnetismValueSpy).toHaveBeenCalledWith(component.isMagnetismOn);
    });

    it('emitReferencePoint should emit component.referenceCornerChanged', () => {
        const EXPECTED_MODE = MagnestismConstants.MagnetizedPoint.BOTTOM_MIDDLE;
        const referenceCornerChangedSpy = spyOn(component.magnetizedPointChanged, 'emit');
        component.emitReferencePoint(EXPECTED_MODE);
        expect(referenceCornerChangedSpy).toHaveBeenCalledWith(EXPECTED_MODE);
    });
});
