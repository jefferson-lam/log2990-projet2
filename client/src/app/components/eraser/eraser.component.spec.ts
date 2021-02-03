import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EraserService, MIN_SIZE_ERASER } from '@app/services/tools/eraser-service';
import { EraserComponent } from './eraser.component';

describe('EraserComponent', () => {
    let component: EraserComponent;
    let fixture: ComponentFixture<EraserComponent>;
    // let eraserMock: jasmine.SpyObj<EraserService>;

    beforeEach(async(() => {
        // const eraserSpy = jasmine.createSpyObj('EraserService', ['onMouseMove']);

        TestBed.configureTestingModule({
            declarations: [EraserComponent],
            // providers: [{ provide: EraserService, useValue: eraserSpy }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EraserComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('sets new position when emit from subscription', async(() => {
        const mouseEvent = {
            offsetX: 10,
            offsetY: 10,
        } as MouseEvent;
        const service = TestBed.inject(EraserService);
        const serviceSetter = spyOn(service, 'onMouseMove').and.callThrough();
        const componentSetter = spyOn(component, 'setPosition').and.callThrough();
        service.onMouseMove(mouseEvent);

        expect(serviceSetter).toHaveBeenCalled();
        expect(componentSetter).toHaveBeenCalled();
        expect(componentSetter).toHaveBeenCalledWith(mouseEvent);
    }));

    it('sets new size when emit from subscription', async(() => {
        const newSize = 500;
        const service = TestBed.inject(EraserService);
        const serviceSetter = spyOn(service, 'setSize').and.callThrough();
        const componentSetter = spyOn(component, 'setSize').and.callThrough();
        service.setSize(newSize);

        expect(serviceSetter).toHaveBeenCalled();
        expect(componentSetter).toHaveBeenCalled();
        expect(componentSetter).toHaveBeenCalledWith(newSize);
    }));

    it('setSize should set cursor height and width if value over 5', () => {
        const newSize = 999;
        const mouseEventSpy = spyOn(component, 'setSize').and.callThrough();
        component.setSize(newSize);

        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(newSize);
        expect(component.size).toEqual(newSize);
        expect(component.cursor.style.height).toEqual(newSize + 'px');
        expect(component.cursor.style.width).toEqual(newSize + 'px');
    });

    it('setSize should set cursor height and width to minimum 5', () => {
        const valueUnderMin = 3;
        const mouseEventSpy = spyOn(component, 'setSize').and.callThrough();
        component.setSize(valueUnderMin);

        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(valueUnderMin);
        expect(component.size).toEqual(MIN_SIZE_ERASER);
        expect(component.cursor.style.height).toEqual(MIN_SIZE_ERASER + 'px');
        expect(component.cursor.style.width).toEqual(MIN_SIZE_ERASER + 'px');
    });

    it('setPosition should set the right offset position and visibility', () => {
        const event = {
            offsetX: 25,
            offsetY: 25,
        } as MouseEvent;
        const mouseEventSpy = spyOn(component, 'setPosition').and.callThrough();
        component.setPosition(event);

        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
        expect(component.cursor.style.visibility).toEqual('visible');
        expect(component.cursor.style.top).toEqual(event.offsetY - component.size / 2 + 'px');
        expect(component.cursor.style.left).toEqual(event.offsetX - component.size / 2 + 'px');
    });
});
