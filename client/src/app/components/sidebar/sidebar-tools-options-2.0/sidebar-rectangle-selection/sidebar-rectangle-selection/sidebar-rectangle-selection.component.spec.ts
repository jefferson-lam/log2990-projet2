import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarRectangleSelectionComponent } from './sidebar-rectangle-selection.component';

describe('SidebarRectangleSelectionComponent', () => {
    let component: SidebarRectangleSelectionComponent;
    let fixture: ComponentFixture<SidebarRectangleSelectionComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SidebarRectangleSelectionComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarRectangleSelectionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
