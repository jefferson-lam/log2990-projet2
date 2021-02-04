import { async, ComponentFixture, TestBed } from '@angular/core/testing';

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

    it('');
});
