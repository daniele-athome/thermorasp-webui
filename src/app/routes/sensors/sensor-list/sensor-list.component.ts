import { Component, OnDestroy, OnInit } from '@angular/core';
import { Sensor, SensorReading, SensorService } from "../../../core";
import { IMqttMessage, MqttService } from "ngx-mqtt";
import { Subscription } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { getDifferenceFromNow } from "../../../shared";
import * as moment from 'moment';

@Component({
  selector: 'app-sensor-list',
  templateUrl: './sensor-list.component.html',
  styleUrls: ['./sensor-list.component.scss']
})
export class SensorListComponent implements OnInit, OnDestroy {

  /** Subscriptions to sensors temperature. */
  private readonly subscriptions: Subscription[] = [];

  readonly temp_readings: {} = {};
  sensors: Sensor[];
  loading: boolean;

  constructor(private mqttService: MqttService,
              private sensorService: SensorService,
              private toastService: ToastrService) {
    this.loading = true;
  }

  ngOnInit() {
    this.subscriptions.push(this.mqttService.onOffline.subscribe(
      () => {
        this.toastService.error('Error contacting MQTT broker.');
      }
    ));
    // TODO loading status
    this.sensorService.query().subscribe(
      (sensors: Sensor[]) => {
        this.loading = false;
        this.sensors = sensors;
        this.getTemperatureReadings();
      },
      (error) => {
        this.loading = false;
        this.toastService.error('Error contacting server.');
      }
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(
      (sub: Subscription) => sub.unsubscribe()
    );
    this.subscriptions.length = 0;
  }

  private getTemperatureReadings() {
    this.sensors.forEach(
      (sensor: Sensor) => {
        const sub = this.mqttService.observe(sensor.topic + '/temperature').subscribe(
          (message: IMqttMessage) => {
            this.temp_readings[sensor.id] = JSON.parse(message.payload.toString()) as SensorReading;
          }
        );
        this.subscriptions.push(sub);
      }
    );
  }

  isReadingValid(reading: SensorReading) {
    return !reading.validity || getDifferenceFromNow(moment(reading.timestamp, 'YYYY-MM-DD[T]HH:mm:ss')) < reading.validity;
  }

}
