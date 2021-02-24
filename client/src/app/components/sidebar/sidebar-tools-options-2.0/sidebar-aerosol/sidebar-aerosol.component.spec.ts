import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsManagerService } from '@app/services/manager/settings-manager';
import { SidebarAerosolComponent } from './sidebar-aerosol.component';

// tslint:disable:no-any
describe('SidebarAerosolComponent', () => {
  let component: SidebarAerosolComponent;
  let fixture: ComponentFixture<SidebarAerosolComponent>;
  let toolSizeChangedSubscribeSpy: jasmine.Spy<any>;
  let waterDropSizeChangedSubcribeSpy: jasmine.Spy<any>;
  let emitEmissionNumberSubscribeSpy: jasmine.Spy<any>;
  let settingsManagerService: SettingsManagerService;

  const MAX_WIDTH = 200;
  const NO_JUNCTION_RADIUS = 0;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SidebarAerosolComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarAerosolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    settingsManagerService = TestBed.inject(SettingsManagerService);
    toolSizeChangedSubscribeSpy = spyOn(component.toolSizeChanged, 'subscribe');
    waterDropSizeChangedSubcribeSpy = spyOn(component.waterDropSizeChanged, 'subscribe');
    emitEmissionNumberSubscribeSpy = spyOn(component.numberOfEmissions, 'subscribe');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('emitToolSize should emit tool size', () => {
    const emitSpy = spyOn(component.toolSizeChanged, 'emit');
    component.toolSize = NO_JUNCTION_RADIUS;
    component.emitToolSize();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('emitWaterDropSize should emit particle size', () => {
    const emitSpy = spyOn(component.waterDropSizeChanged, 'emit');
    component.waterDropSize = 25;
    component.emitWaterDropSize();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('emitEmissionNumber should emit number of emissions', () => {
    const emitSpy = spyOn(component.numberOfEmissions, 'emit');
    component.emissionCount = 10;
    component.emitEmissionNumber();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('setMax should return input value if it is equal or under MAXWIDTH', () => {
    const newWitdh = MAX_WIDTH;
    const returnValue = component.setMax(newWitdh);
    expect(returnValue).toEqual(newWitdh);
  });

  it('should call subscribe method when created', () => {
    component.ngOnInit();
    expect(toolSizeChangedSubscribeSpy).toHaveBeenCalled();
    expect(waterDropSizeChangedSubcribeSpy).toHaveBeenCalled();
    expect(emitEmissionNumberSubscribeSpy).toHaveBeenCalled();
  });

  it('should call setLineWidth() from settingsManager after tool size change', () => {
    const setLineWidthSpy = spyOn(settingsManagerService, 'setLineWidth');
    component.ngOnInit();
    component.emitToolSize();
    expect(setLineWidthSpy).toHaveBeenCalled();
  });

  it('should call setWaterDropWidth() from settingsManager after particle size change', () => {
    const setWaterDropWidth = spyOn(settingsManagerService, 'setWaterDropWidth');
    component.ngOnInit();
    component.emitWaterDropSize();
    expect(setWaterDropWidth).toHaveBeenCalled();
  });

  it('should call setEmissionCount() from settingsManager after emission count change', () => {
    const setEmissionCount = spyOn(settingsManagerService, 'setEmissionCount');
    component.ngOnInit();
    component.emitEmissionNumber();
    expect(setEmissionCount).toHaveBeenCalled();
  });
});
