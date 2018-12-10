import { Component, OnInit } from '@angular/core';
import { Sensor, SensorReading, SensorService } from "../../../core";

@Component({
  selector: 'app-sensor-list',
  templateUrl: './sensor-list.component.html',
  styleUrls: ['./sensor-list.component.scss']
})
export class SensorListComponent implements OnInit {

  sensors: Sensor[];
  temp_readings: {};

  constructor(private sensorService: SensorService) { }

  ngOnInit() {
    // TODO loading status
    this.sensorService.query().subscribe(
      (sensors: Sensor[]) => {
        this.sensors = sensors;
        this.getTemperatureReadings();
      }
    );
  }

  private getTemperatureReadings() {
    this.sensorService.readings('temperature').subscribe(
      (readings: SensorReading[]) => {
        let result = {};
        readings.forEach((value: SensorReading) => {
          result[value.sensor_id] = value;
        });
        this.temp_readings = result;
      }
    );

  }

}
