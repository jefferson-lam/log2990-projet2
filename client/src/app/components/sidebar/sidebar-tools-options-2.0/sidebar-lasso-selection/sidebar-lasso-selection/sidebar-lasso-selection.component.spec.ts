import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarLassoSelectionComponent } from './sidebar-lasso-selection.component';

describe('SidebarLassoSelectionComponent', () => {
    let component: SidebarLassoSelectionComponent;
    let fixture: ComponentFixture<SidebarLassoSelectionComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SidebarLassoSelectionComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarLassoSelectionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
