import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarRectangleSelectionComponent } from './sidebar-rectangle-selection.component';

describe('SidebarRectangleSelectionComponent', () => {
  let component: SidebarRectangleSelectionComponent;
  let fixture: ComponentFixture<SidebarRectangleSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarRectangleSelectionComponent ]
    })
    .compileComponents();
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
