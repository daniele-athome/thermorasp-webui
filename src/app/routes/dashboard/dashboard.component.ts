import { Component, OnInit, ViewChild } from '@angular/core';
import { ScheduleService, SensorService } from "../../core/services";
import { ScheduleBehavior, SensorReading } from "../../core/models";
import { IMqttMessage, MqttService } from "ngx-mqtt";
import { ThermostatDialComponent } from "../../components/thermostat-dial/thermostat-dial.component";
import { Subscription } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild('dial')
  dial: ThermostatDialComponent;

  private readonly temp_readings: Map<string, SensorReading>;

  private readonly activeScheduleSubs: Subscription[];

  constructor(
    private scheduleService: ScheduleService,
    private sensorService: SensorService,
    private mqttService: MqttService
  ) {
    this.temp_readings = new Map();
    this.activeScheduleSubs = [];
  }

  ngOnInit() {
    this.loadActiveSchedule();
  }

  rollbackActiveSchedule() {
    this.scheduleService.active_rollback().subscribe(
      () => {
        this.loadActiveSchedule();
      }
    );
  }

  private cancelSubscriptions() {
    this.activeScheduleSubs.forEach(
      (sub: Subscription) => {
        sub.unsubscribe();
      }
    );
    this.activeScheduleSubs.length = 0;
  }

  private loadActiveSchedule() {
    this.cancelSubscriptions();
    this.scheduleService.active_behavior().subscribe(
      (behavior: ScheduleBehavior) => {
        behavior.sensors.forEach(
          (sensor_id: string) => {
            this.subscribeToAmbientSensor(sensor_id);
          }
        );
      },
      (error: any) => {
        console.log(error);
        if (error.status == 404) {
          console.log('No active behavior, falling back to watching all sensors');
        }
      }
    );
  }

  private subscribeToAmbientSensor(sensor_id: string) {
    // request topic for sensor
    this.sensorService.topic(sensor_id).subscribe(
      (sensor_topic: string) => {
        const sub = this.mqttService.observe(sensor_topic + '/temperature').subscribe(
          (message: IMqttMessage) => {
            this.temp_readings.set(sensor_id, JSON.parse(message.payload.toString()));
            this.updateAmbientTemperature();
          }
        );
        this.activeScheduleSubs.push(sub);
      }
    );
  }

  private updateAmbientTemperature() {
    let sum: number = 0;
    let count: number = 0;
    this.temp_readings.forEach(
      (reading: SensorReading) => {
        // TODO account for different unit
        if (reading.unit == 'celsius') {
          sum += reading.value;
          count++;
        }
      }
    );
    if (count > 0) {
      this.dial.ambient_temperature = sum / count;
      console.log("Ambient temperature: " + this.dial.ambient_temperature);
    }
  }
}
