import { Component, OnInit } from '@angular/core';

import * as thermostat from './dial';

@Component({
  selector: 'app-thermostat-dial',
  templateUrl: './thermostat-dial.component.html',
  styleUrls: ['./thermostat-dial.component.scss']
})
export class ThermostatDialComponent implements OnInit {

  private dial;

  constructor() { }

  ngOnInit() {
    const options = new thermostat.ThermostatDialOptions();
    options.onSetTargetTemperature = (targetTemperature: number) => {
      console.log('Requested: ' + targetTemperature);
    };
    this.dial = new thermostat.ThermostatDial(document.getElementById('dashboard-thermostat'), options);
  }

}
