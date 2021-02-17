import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarRectangleComponent } from './sidebar-rectangle.component';

describe('SidebarRectangleComponent', () => {
  let component: SidebarRectangleComponent;
  let fixture: ComponentFixture<SidebarRectangleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarRectangleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarRectangleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
