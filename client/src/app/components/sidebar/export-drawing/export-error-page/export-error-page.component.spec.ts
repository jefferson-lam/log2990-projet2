import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportErrorPageComponent } from './export-error-page.component';

describe('ExportErrorPageComponent', () => {
  let component: ExportErrorPageComponent;
  let fixture: ComponentFixture<ExportErrorPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportErrorPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportErrorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
