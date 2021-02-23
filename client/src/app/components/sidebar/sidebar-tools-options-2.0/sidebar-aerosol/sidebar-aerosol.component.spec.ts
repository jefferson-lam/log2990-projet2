import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarAerosolComponent } from './sidebar-aerosol.component';

describe('SidebarAerosolComponent', () => {
  let component: SidebarAerosolComponent;
  let fixture: ComponentFixture<SidebarAerosolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarAerosolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarAerosolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
