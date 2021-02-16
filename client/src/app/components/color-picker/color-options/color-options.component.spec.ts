import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorOptionsComponent } from './color-options.component';

describe('ColorOptionsComponent', () => {
    let component: ColorOptionsComponent;
    let fixture: ComponentFixture<ColorOptionsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColorOptionsComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorOptionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('confirmColorPick should emit new color', () => {
        const emitSpy = spyOn(component.newColor, 'emit');
        component.confirmColorPick();
        expect(emitSpy).toHaveBeenCalled();
    });

    it('confirmColorPick should emit false to close options', () => {
        const emitSpy = spyOn(component.showOptions, 'emit');
        component.confirmColorPick();
        expect(emitSpy).toHaveBeenCalled();
    });
});
