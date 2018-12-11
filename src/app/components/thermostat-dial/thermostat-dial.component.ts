import { Component, OnInit } from '@angular/core';

import * as thermostat from './dial';

@Component({
  selector: 'app-thermostat-dial',
  templateUrl: './thermostat-dial.component.html',
  styleUrls: ['./thermostat-dial.component.scss']
})
export class ThermostatDialComponent implements OnInit {

  private dial: thermostat.ThermostatDial;

  constructor() { }

  ngOnInit() {
    const options = new thermostat.ThermostatDialOptions();
    options.onSetTargetTemperature = (targetTemperature: number) => {
      console.log('Requested: ' + targetTemperature);
    };
    this.dial = new thermostat.ThermostatDial(document.getElementById('dashboard-thermostat'), options);
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

}
