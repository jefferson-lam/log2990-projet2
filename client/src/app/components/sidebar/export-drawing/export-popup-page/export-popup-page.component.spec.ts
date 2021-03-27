import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportPopupPageComponent } from './export-popup-page.component';

describe('ExportPopupPageComponent', () => {
  let component: ExportPopupPageComponent;
  let fixture: ComponentFixture<ExportPopupPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportPopupPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportPopupPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
