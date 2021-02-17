import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarEllipseComponent } from './sidebar-ellipse.component';

describe('SidebarEllipseComponent', () => {
  let component: SidebarEllipseComponent;
  let fixture: ComponentFixture<SidebarEllipseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarEllipseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarEllipseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
