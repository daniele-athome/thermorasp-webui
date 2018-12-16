import { Component, OnDestroy, OnInit } from '@angular/core';
import { Sensor, SensorReading, SensorService } from "../../../core";
import { IMqttMessage, MqttService } from "ngx-mqtt";
import { Subscription } from "rxjs";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-sensor-list',
  templateUrl: './sensor-list.component.html',
  styleUrls: ['./sensor-list.component.scss']
})
export class SensorListComponent implements OnInit, OnDestroy {

  /** Subscriptions to sensors temperature. */
  private readonly temperatureSubs: Subscription[] = [];

  readonly temp_readings: {} = {};
  sensors: Sensor[];

  constructor(private mqttService: MqttService,
              private sensorService: SensorService,
              private toastService: ToastrService) { }

  ngOnInit() {
    this.mqttService.onOffline.subscribe(
      () => {
        this.toastService.error('Error contacting MQTT broker.');
      }
    );
    // TODO loading status
    this.sensorService.query().subscribe(
      (sensors: Sensor[]) => {
        this.sensors = sensors;
        this.getTemperatureReadings();
      },
      (error) => {
        this.toastService.error('Error contacting server.');
      }
    );
  }

  ngOnDestroy(): void {
    this.temperatureSubs.forEach(
      (sub: Subscription) => sub.unsubscribe()
    );
    this.temperatureSubs.length = 0;
  }

  private getTemperatureReadings() {
    this.sensors.forEach(
      (sensor: Sensor) => {
        const sub = this.mqttService.observe(sensor.topic + '/temperature').subscribe(
          (message: IMqttMessage) => {
            this.temp_readings[sensor.id] = JSON.parse(message.payload.toString()) as SensorReading;
          }
        );
        this.temperatureSubs.push(sub);
      }
    );
  }

}
