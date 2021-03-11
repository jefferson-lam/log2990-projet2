import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingPageComponent } from './saving-page.component';

describe('SavingPageComponent', () => {
  let component: SavingPageComponent;
  let fixture: ComponentFixture<SavingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
