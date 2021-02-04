import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarPencilComponent } from './sidebar-pencil.component';

describe('SidebarPencilComponent', () => {
    let component: SidebarPencilComponent;
    let fixture: ComponentFixture<SidebarPencilComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SidebarPencilComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarPencilComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
