import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportCompletePageComponent } from './export-complete-page.component';

describe('ExportCompletePageComponent', () => {
  let component: ExportCompletePageComponent;
  let fixture: ComponentFixture<ExportCompletePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportCompletePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportCompletePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
