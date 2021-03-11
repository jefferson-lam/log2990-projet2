import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveCompletePageComponent } from './save-complete-page.component';

describe('SaveCompletePageComponent', () => {
  let component: SaveCompletePageComponent;
  let fixture: ComponentFixture<SaveCompletePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveCompletePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveCompletePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
