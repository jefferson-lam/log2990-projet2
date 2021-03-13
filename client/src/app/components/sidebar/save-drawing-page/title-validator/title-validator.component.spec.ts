import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleValidatorComponent } from './title-validator.component';

describe('TitleValidatorComponent', () => {
  let component: TitleValidatorComponent;
  let fixture: ComponentFixture<TitleValidatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TitleValidatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TitleValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
