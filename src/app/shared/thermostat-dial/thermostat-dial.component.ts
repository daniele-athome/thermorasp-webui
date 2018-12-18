import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

import * as thermostat from './dial';

@Component({
  selector: 'app-thermostat-dial',
  templateUrl: './thermostat-dial.component.html',
  styleUrls: ['./thermostat-dial.component.scss']
})
export class ThermostatDialComponent implements OnInit {

  private dial: thermostat.ThermostatDial;

  private _loading: boolean = false;

  @ViewChild('dial')
  dialElement: ElementRef;

  @Output()
  onSetTargetTemperature: EventEmitter<number> = new EventEmitter();

  constructor() { }

  ngOnInit() {
    const options = new thermostat.ThermostatDialOptions();
    options.onSetTargetTemperature = (targetTemperature: number) => {
      this.onSetTargetTemperature.emit(targetTemperature);
    };
    this.dial = new thermostat.ThermostatDial(this.dialElement.nativeElement, options);
  }

  get loading(): boolean {
    return this._loading;
  }

  set loading(val: boolean) {
    this._loading = val;
    if (this.dial) {
      this.dial.loading = val;
    }
  }

  get target_temperature(): number {
    return this.dial.target_temperature;
  }

  set target_temperature(val: number) {
    this.dial.target_temperature = val;
  }

  get ambient_temperature(): number {
    return this.dial.ambient_temperature;
  }

  set ambient_temperature(val: number) {
    this.dial.ambient_temperature = val;
  }

  get hvac_state(): string {
    return this.dial.hvac_state;
  }

  set hvac_state(val: string) {
    this.dial.hvac_state = val;
  }

}
