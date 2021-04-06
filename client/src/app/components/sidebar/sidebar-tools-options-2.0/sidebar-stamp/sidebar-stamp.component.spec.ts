import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarStampComponent } from './sidebar-stamp.component';

describe('SidebarStampComponent', () => {
    let component: SidebarStampComponent;
    let fixture: ComponentFixture<SidebarStampComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SidebarStampComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarStampComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
