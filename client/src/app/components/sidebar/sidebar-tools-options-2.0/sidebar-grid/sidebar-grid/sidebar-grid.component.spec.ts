import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CanvasGridService } from '@app/services/canvas-grid/canvas-grid.service';
import { Subject } from 'rxjs';
import { SidebarGridComponent } from './sidebar-grid.component';

describe('SidebarGridComponent', () => {
    let component: SidebarGridComponent;
    let fixture: ComponentFixture<SidebarGridComponent>;
    let canvasGridServiceSpy: jasmine.SpyObj<CanvasGridService>;
    let squareWidthSubscribeSpy: jasmine.Spy<any>;
    let opacityValueSubscribeSpy: jasmine.Spy<any>;
    let visibilityValueSubscribeSpy: jasmine.Spy<any>;

    beforeEach(async(() => {
        canvasGridServiceSpy = jasmine.createSpyObj('CanvasGridService', [], ['gridVisibilitySubject', 'widthSubject', 'isGridDisplayed']);
        (Object.getOwnPropertyDescriptor(canvasGridServiceSpy, 'gridVisibilitySubject')?.get as jasmine.Spy<() => Subject<any>>).and.returnValue(
            new Subject<any>(),
        );
        (Object.getOwnPropertyDescriptor(canvasGridServiceSpy, 'widthSubject')?.get as jasmine.Spy<() => Subject<any>>).and.returnValue(
            new Subject<any>(),
        );
        TestBed.configureTestingModule({
            declarations: [SidebarGridComponent],
            providers: [{ provide: CanvasGridService, useValue: canvasGridServiceSpy }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarGridComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        squareWidthSubscribeSpy = spyOn(component.squareWidthChanged, 'subscribe');
        opacityValueSubscribeSpy = spyOn(component.opacityValueChanged, 'subscribe');
        visibilityValueSubscribeSpy = spyOn(component.visibilityValueChanged, 'subscribe');
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call subscribe methods when created', () => {
        canvasGridServiceSpy.isGridDisplayed = true;
        component.ngOnInit();
        expect(squareWidthSubscribeSpy).toHaveBeenCalled();
        expect(opacityValueSubscribeSpy).toHaveBeenCalled();
        expect(visibilityValueSubscribeSpy).toHaveBeenCalled();
    });

    it('toggleGrid should set its checked attribute to true if true emitted from CanvasGridService', () => {
        const EXPECTED_VISIBILITY = true;
        component.canvasGridService.gridVisibilitySubject.next(EXPECTED_VISIBILITY);
        expect(component.toggleGrid.checked).toEqual(EXPECTED_VISIBILITY);
    });

    it('widthSlider value and square width should change when canvasGridService emits isGridDisplayed', () => {
        const EXPECTED_WIDTH = 30;
        component.canvasGridService.widthSubject.next(EXPECTED_WIDTH);
        expect(component.widthSlider.value).toEqual(EXPECTED_WIDTH);
        expect(component.squareWidth).toEqual(EXPECTED_WIDTH);
    });

    it('emitSquareWidth should emit specified value', () => {
        const emitSpy = spyOn(component.squareWidthChanged, 'emit');
        component.emitSquareWidth();
        expect(emitSpy).toHaveBeenCalledWith(component.squareWidth);
    });

    it('emitOpacityValue should emit specified value', () => {
        const emitSpy = spyOn(component.opacityValueChanged, 'emit');
        component.emitOpacityValue();
        expect(emitSpy).toHaveBeenCalledWith(component.opacityValue);
    });

    it('emitVisibilityValue should emit specified value', () => {
        const emitSpy = spyOn(component.visibilityValueChanged, 'emit');
        component.emitVisibilityValue();
        expect(emitSpy).toHaveBeenCalledWith(component.isGridOptionsDisplayed);
    });
});
