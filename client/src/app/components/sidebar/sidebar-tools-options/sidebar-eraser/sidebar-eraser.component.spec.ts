import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAX_SIZE_ERASER, MIN_SIZE_ERASER } from '@app/services/tools/eraser-service';
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
        component.changeEraserSize(MAX_SIZE_ERASER + 1);
        expect(component.size).toEqual(MAX_SIZE_ERASER);
    });

    it('changeEraserSize should set size to MIN_SIZE_ERASER if under MIN_SIZE_ERASER', () => {
        component.changeEraserSize(MIN_SIZE_ERASER - 1);
        expect(component.size).toEqual(MIN_SIZE_ERASER);
    });

    it('changeEraserSize should set size to value if between MAX and MIN_SIZE_ERASER', () => {
        const medianSize = MIN_SIZE_ERASER + (MAX_SIZE_ERASER - MIN_SIZE_ERASER) / 2;
        component.changeEraserSize(medianSize);
        expect(component.size).toEqual(medianSize);
    });

    it('inputDiv should be assigned value of validated size', () => {
        const medianSize = MIN_SIZE_ERASER + (MAX_SIZE_ERASER - MIN_SIZE_ERASER) / 2;
        component.changeEraserSize(medianSize);

        // tslint:disable:no-string-literal
        expect(component['inputDiv'].value).toBe(medianSize.toString());
        // tslint:enable:no-string-literal
    });
});
