import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavePageErrorComponent } from './save-page-error.component';

describe('SavePageErrorComponent', () => {
  let component: SavePageErrorComponent;
  let fixture: ComponentFixture<SavePageErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavePageErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavePageErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
