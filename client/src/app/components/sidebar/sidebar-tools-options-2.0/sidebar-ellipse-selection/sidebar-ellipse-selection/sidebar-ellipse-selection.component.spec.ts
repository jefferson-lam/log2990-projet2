import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarEllipseSelectionComponent } from './sidebar-ellipse-selection.component';

describe('SidebarEllipseSelectionComponent', () => {
    let component: SidebarEllipseSelectionComponent;
    let fixture: ComponentFixture<SidebarEllipseSelectionComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SidebarEllipseSelectionComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarEllipseSelectionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
