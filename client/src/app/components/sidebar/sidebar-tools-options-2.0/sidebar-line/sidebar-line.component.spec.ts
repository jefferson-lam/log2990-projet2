import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarLineComponent } from './sidebar-line.component';

describe('SidebarLineComponent', () => {
  let component: SidebarLineComponent;
  let fixture: ComponentFixture<SidebarLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarLineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
