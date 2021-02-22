import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarPolygoneComponent } from './sidebar-polygone.component';

describe('SidebarPolygoneComponent', () => {
  let component: SidebarPolygoneComponent;
  let fixture: ComponentFixture<SidebarPolygoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarPolygoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarPolygoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
