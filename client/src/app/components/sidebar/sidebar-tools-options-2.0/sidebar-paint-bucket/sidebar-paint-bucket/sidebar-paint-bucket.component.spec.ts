import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarPaintBucketComponent } from './sidebar-paint-bucket.component';

describe('SidebarPaintBucketComponent', () => {
  let component: SidebarPaintBucketComponent;
  let fixture: ComponentFixture<SidebarPaintBucketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarPaintBucketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarPaintBucketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
