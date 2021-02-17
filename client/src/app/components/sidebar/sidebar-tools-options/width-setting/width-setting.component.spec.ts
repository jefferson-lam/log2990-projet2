import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidthSettingComponent } from './width-setting.component';

describe('WidthSettingComponent', () => {
  let component: WidthSettingComponent;
  let fixture: ComponentFixture<WidthSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidthSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidthSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
