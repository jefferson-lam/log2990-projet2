import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as EraserConstants from '@app/constants/eraser-constants';
import { SidebarEraserComponent } from './sidebar-eraser.component';

describe('SidebarEraserComponent', () => {
    let component: SidebarEraserComponent;
    let fixture: ComponentFixture<SidebarEraserComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SidebarEraserComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarEraserComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('changeEraserSize should set size to MAX_SIZE_ERASER if over MAX_SIZE_ERASER', () => {
        component.changeEraserSize(EraserConstants.MAX_SIZE_ERASER + 1);
        expect(component.size).toEqual(EraserConstants.MAX_SIZE_ERASER);
    });

    it('changeEraserSize should set size to MIN_SIZE_ERASER if under MIN_SIZE_ERASER', () => {
        component.changeEraserSize(EraserConstants.MIN_SIZE_ERASER - 1);
        expect(component.size).toEqual(EraserConstants.MIN_SIZE_ERASER);
    });

    it('changeEraserSize should set size to value if between MAX and MIN_SIZE_ERASER', () => {
        const medianSize = EraserConstants.MIN_SIZE_ERASER + (EraserConstants.MAX_SIZE_ERASER - EraserConstants.MIN_SIZE_ERASER) / 2;
        component.changeEraserSize(medianSize);
        expect(component.size).toEqual(medianSize);
    });

    it('inputDiv should be assigned value of validated size', () => {
        const medianSize = EraserConstants.MIN_SIZE_ERASER + (EraserConstants.MAX_SIZE_ERASER - EraserConstants.MIN_SIZE_ERASER) / 2;
        component.changeEraserSize(medianSize);

        // tslint:disable:no-string-literal
        expect(component['inputDiv'].value).toBe(medianSize.toString());
        // tslint:enable:no-string-literal
    });
});
