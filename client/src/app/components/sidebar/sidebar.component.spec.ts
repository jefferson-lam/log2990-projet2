import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SidebarComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('on mouseLeave should toggle visibility', () => {
        const toggleSpy = spyOn<any>(component, 'toggleOpen').and.callThrough();

        fixture.detectChanges();
        const btn = fixture.debugElement.nativeElement.querySelector('.tools-option-container');
        const mouseLeave = new MouseEvent('mouseleave');
        btn.dispatchEvent(mouseLeave);
        fixture.detectChanges();

        expect(toggleSpy).toHaveBeenCalled();
    });

    it('click on return button should return to main page', () => {
        const backSpy = spyOn<any>(component, 'backClick').and.callThrough();

        fixture.detectChanges();
        const btn = fixture.debugElement.nativeElement.querySelector('#return-button');
        btn.click();
        fixture.detectChanges();

        expect(backSpy).toHaveBeenCalled();
    });
});
