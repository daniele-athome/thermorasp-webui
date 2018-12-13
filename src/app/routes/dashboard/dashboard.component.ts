import { Component, OnInit, ViewChild } from '@angular/core';
import { ScheduleService, SensorService } from "../../core/services";
import { ScheduleBehavior, Sensor, SensorReading } from "../../core/models";
import { IMqttMessage, MqttService } from "ngx-mqtt";
import { ThermostatDialComponent } from "../../components/thermostat-dial/thermostat-dial.component";
import { Subscription } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { differenceInSeconds, parse } from 'date-fns';
import { environment } from "../../../environments/environment";

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
    private mqttService: MqttService,
    private toastService: ToastrService
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

  onSetTargetTemperature(target_temperature: number) {
    // TODO
    console.log('Temperature requested: ' + target_temperature);
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
    this.dial.loading = true;
    this.scheduleService.active_behavior().subscribe(
      (behavior: ScheduleBehavior) => {
        // target temperature
        if ('target_temperature' in behavior.config) {
          this.dial.target_temperature = behavior.config['target_temperature'];
        }

        behavior.sensors.forEach(
          (sensor_id: string) => {
            this.subscribeToAmbientSensor(sensor_id);
          }
        );
      },
      (error: any) => {
        console.log(error);
        if (error.error == 'not-found') {
          this.toastService.warning('No active program, monitoring all sensors.', null, {disableTimeOut: true});
          this.dial.loading = false;

          this.sensorService.query().subscribe(
            (sensors: Sensor[]) => {
              sensors.forEach(
                (sensor: Sensor) => {
                  this.subscribeToAmbientTemperature(sensor.id, sensor.topic);
                }
              );
            }
          );
        }
      }
    );
  }

  private subscribeToAmbientSensor(sensor_id: string) {
    // request topic for sensor
    this.sensorService.topic(sensor_id).subscribe(
      (sensor_topic: string) => {
        this.subscribeToAmbientTemperature(sensor_id, sensor_topic);
      }
    );
  }

  private subscribeToAmbientTemperature(sensor_id: string, sensor_topic: string) {
    const sub = this.mqttService.observe(sensor_topic + '/temperature').subscribe(
      (message: IMqttMessage) => {
        const data = JSON.parse(message.payload.toString()) as SensorReading;
        data.sensor_id = sensor_id;
        this.temp_readings.set(sensor_id, data);
        this.updateAmbientTemperature();
      }
    );
    this.activeScheduleSubs.push(sub);
  }

  private updateAmbientTemperature() {
    let sum: number = 0;
    let count: number = 0;
    this.temp_readings.forEach(
      (reading: SensorReading) => {
        // TODO account for different unit
        if (reading.unit == 'celsius' &&
            differenceInSeconds(new Date(), parse(reading.timestamp)) < environment.sensor_validity) {
          sum += reading.value;
          console.log(reading.sensor_id + '=' + reading.value);
          count++;
        }
      }
    );
    if (count > 0) {
      this.dial.ambient_temperature = sum / count;
      console.log("Ambient temperature: " + this.dial.ambient_temperature);
      this.dial.loading = false;
    }
  }
}
