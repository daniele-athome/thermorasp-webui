import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThermostatDialComponent } from './thermostat-dial.component';

describe('ThermostatDialComponent', () => {
  let component: ThermostatDialComponent;
  let fixture: ComponentFixture<ThermostatDialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThermostatDialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThermostatDialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
