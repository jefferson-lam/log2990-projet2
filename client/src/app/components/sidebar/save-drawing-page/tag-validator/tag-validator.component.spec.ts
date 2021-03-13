import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagValidatorComponent } from './tag-validator.component';

describe('TagValidatorComponent', () => {
  let component: TagValidatorComponent;
  let fixture: ComponentFixture<TagValidatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagValidatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
