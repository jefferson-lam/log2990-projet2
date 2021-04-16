import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as MagnestismConstants from '@app/constants/magnetism-constants';
import { MagnetismService } from '@app/services/magnetism/magnetism.service';
import { Subject } from 'rxjs';
import { SidebarMagnetismComponent } from './sidebar-magnetism.component';

// tslint:disable: no-any
describe('SidebarMagnetismComponent', () => {
    let component: SidebarMagnetismComponent;
    let fixture: ComponentFixture<SidebarMagnetismComponent>;
    let magnetismServiceSpy: jasmine.SpyObj<MagnetismService>;

    beforeEach(async(() => {
        magnetismServiceSpy = jasmine.createSpyObj('MagnetismService', [], ['isMagnetismOn', 'magnetismStateSubject', 'referenceResizerMode']);
        (Object.getOwnPropertyDescriptor(magnetismServiceSpy, 'magnetismStateSubject')?.get as jasmine.Spy<() => Subject<any>>).and.returnValue(
            new Subject<any>(),
        );
        (Object.getOwnPropertyDescriptor(magnetismServiceSpy, 'isMagnetismOn')?.get as jasmine.Spy<() => boolean>).and.returnValue(false);
        (Object.getOwnPropertyDescriptor(magnetismServiceSpy, 'referenceResizerMode')?.get as jasmine.Spy<
            () => MagnestismConstants.ResizerIndex
        >).and.returnValue(MagnestismConstants.ResizerIndex.TOP_LEFT_INDEX);
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
        // tslint:disable-next-line: no-string-literal
        expect(component['magnetismService'].isMagnetismOn).toBeFalse();
    });

    it('emission of referenceCornerChanged should change magnetismService.referenceResizerMode', () => {
        component.referenceCornerChanged.emit(MagnestismConstants.ResizerIndex.TOP_LEFT_INDEX);
        // tslint:disable-next-line: no-string-literal
        expect(component['magnetismService'].referenceResizerMode).toEqual(MagnestismConstants.ResizerIndex.TOP_LEFT_INDEX);
    });

    it('canvasGridService.gridVisibility should change toggle state of toggle magnetism of magnetismToggle slider.', () => {
        const EXPECTED_STATE = true;
        // tslint:disable-next-line: no-string-literal
        component['magnetismService'].magnetismStateSubject.next(EXPECTED_STATE);
        expect(component.magnetismToggle.checked).toEqual(EXPECTED_STATE);
    });

    it('emitMagnetismValue should emit component.isMagnetismOn', () => {
        const magnetismValueSpy = spyOn(component.magnetismValueChanged, 'emit');
        component.emitMagnetismValue();
        expect(magnetismValueSpy).toHaveBeenCalledWith(component.isMagnetismOn);
    });

    it('emitReferencePoint should emit component.referenceCornerChanged', () => {
        const EXPECTED_MODE = MagnestismConstants.ResizerIndex.BOTTOM_MIDDLE_INDEX;
        const referenceCornerChangedSpy = spyOn(component.referenceCornerChanged, 'emit');
        component.emitReferencePoint(EXPECTED_MODE);
        expect(referenceCornerChangedSpy).toHaveBeenCalledWith(EXPECTED_MODE);
    });
});
