import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarPipetteComponent } from './sidebar-pipette.component';

describe('SidebarPipetteComponent', () => {
  let component: SidebarPipetteComponent;
  let fixture: ComponentFixture<SidebarPipetteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarPipetteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarPipetteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
