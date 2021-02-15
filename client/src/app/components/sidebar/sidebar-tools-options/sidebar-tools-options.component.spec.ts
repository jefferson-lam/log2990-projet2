import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarToolsOptionsComponent } from './sidebar-tools-options.component';

describe('SidebarToolsOptionsComponent', () => {
  let component: SidebarToolsOptionsComponent;
  let fixture: ComponentFixture<SidebarToolsOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarToolsOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarToolsOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
