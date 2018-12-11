import { Component, OnInit, ViewChild } from '@angular/core';
import { ScheduleService, SensorService } from "../../core/services";
import { ScheduleBehavior, SensorReading } from "../../core/models";
import { IMqttMessage, MqttService } from "ngx-mqtt";
import { ThermostatDialComponent } from "../../components/thermostat-dial/thermostat-dial.component";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild('dial')
  dial: ThermostatDialComponent;

  private readonly temp_readings: Map<string, SensorReading>;

  constructor(
    private scheduleService: ScheduleService,
    private sensorService: SensorService,
    private mqttService: MqttService
  ) {
    this.temp_readings = new Map();
  }

  ngOnInit() {
    this.scheduleService.active_behavior().subscribe(
      (behavior: ScheduleBehavior) => {
        behavior.sensors.forEach(
          (sensor_id: string) => {
            this.subscribeToAmbientSensor(sensor_id);
          }
        );
      }
    );
  }

  rollbackActiveSchedule() {
    // TODO
  }

  private subscribeToAmbientSensor(sensor_id: string) {
    // request topic for sensor
    this.sensorService.topic(sensor_id).subscribe(
      (sensor_topic: string) => {
        this.mqttService.observe(sensor_topic + '/temperature').subscribe(
          (message: IMqttMessage) => {
            this.temp_readings.set(sensor_id, JSON.parse(message.payload.toString()));
            this.updateAmbientTemperature();
          }
        );
      }
    );
  }

  private updateAmbientTemperature() {
    if (this.temp_readings.size > 0) {
      let sum: number = 0;
      this.temp_readings.forEach(
        (reading: SensorReading) => {
          // TODO watch out for different unit
          sum += reading.value;
        }
      );
      this.dial.ambient_temperature = sum / this.temp_readings.size;
    }
  }
}
