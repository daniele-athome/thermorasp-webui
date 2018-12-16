import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DeviceService, ScheduleService, SensorService } from "../../core/services";
import {
  Device,
  DeviceState,
  ScheduleBehavior,
  Sensor,
  SensorReading,
  VolatileScheduleBehavior
} from "../../core/models";
import { IMqttMessage, MqttService } from "ngx-mqtt";
import { ThermostatDialComponent } from "../../components/thermostat-dial/thermostat-dial.component";
import { combineLatest, Subscription } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { differenceInSeconds, parse } from 'date-fns';
import { environment } from "../../../environments/environment";
import { getCurrentMinute, getTodayLastMinute } from "../../shared";
import { delay } from "rxjs/operators";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  @ViewChild('dial')
  dial: ThermostatDialComponent;

  loading: boolean = true;

  /** Latest device states by device ID. */
  private readonly device_states: Map<string, DeviceState>;
  /** Latest sensor readings by sensor ID. */
  private readonly temp_readings: Map<string, SensorReading>;
  /** Subscriptions to sensors for the currently active behavior. */
  private readonly activeBehaviorSubs: Subscription[];

  /** Currently active behavior, if any. */
  private currentBehavior: ScheduleBehavior;

  /** List of all configured sensors. */
  private sensors: Sensor[];

  /** List of all configured devices. */
  private devices: Device[];

  constructor(
    private scheduleService: ScheduleService,
    private sensorService: SensorService,
    private deviceService: DeviceService,
    private mqttService: MqttService,
    private toastService: ToastrService
  ) {
    this.device_states = new Map();
    this.temp_readings = new Map();
    this.activeBehaviorSubs = [];
  }

  ngOnInit() {
    this.mqttService.onOffline.subscribe(
      () => {
        this.toastService.error('Error contacting MQTT broker.');
      }
    );
    this.loadConfiguration();
  }

  ngOnDestroy() {
    this.cancelSubscriptions();
  }

  rollbackActiveSchedule() {
    this.dial.loading = true;
    this.scheduleService.active_rollback().pipe(delay(500)).subscribe(
      () => this.loadActiveSchedule(),
      (error) => {
        this.toastService.error('Error contacting server.');
      }
    );
  }

  private loadConfiguration() {
    this.dial.loading = true;
    const config = combineLatest(
      this.sensorService.query(),
      this.deviceService.query());
    config.subscribe(
      ([sensors, devices]) => {
        this.sensors = sensors;
        this.devices = devices;
        this.loadActiveSchedule();
        this.loading = false;
      },
      (error) => {
        this.toastService.error('Error contacting server.');
      }
    )
  }

  onSetTargetTemperature(target_temperature: number) {
    console.log('Temperature requested: ' + target_temperature);
    const behavior = {
      name: 'generic.TargetTemperatureBehavior',
      order: 0,
      start_time: getCurrentMinute(),
      end_time: getTodayLastMinute(),
      config: {
        target_temperature: target_temperature
      },
      sensors: this.getCurrentSensors(),
      devices: this.getCurrentDevices(),
    } as VolatileScheduleBehavior;

    this.scheduleService.set_active_volatile_behavior(behavior).pipe(delay(0)).subscribe(
      () => {
        this.loadActiveSchedule();
      },
      (error) => {
        this.toastService.error('Error contacting server.');
      }
    );
  }

  private getCurrentSensors(): string[] {
    if (this.currentBehavior) {
      return this.currentBehavior.sensors;
    }
    else {
      return this.sensors.map((x: Sensor) => x.id);
    }
  }

  private getCurrentDevices(): string[] {
    if (this.currentBehavior) {
      return this.currentBehavior.devices;
    }
    else {
      return this.devices.map((x: Device) => x.id);
    }
  }

  private cancelSubscriptions() {
    this.activeBehaviorSubs.forEach(
      (sub: Subscription) => sub.unsubscribe()
    );
    this.activeBehaviorSubs.length = 0;
  }

  private loadActiveSchedule() {
    this.cancelSubscriptions();
    this.currentBehavior = null;

    this.scheduleService.active_behavior().subscribe(
      (behavior: ScheduleBehavior) => {
        this.currentBehavior = behavior;

        // target temperature
        if ('target_temperature' in behavior.config) {
          this.dial.target_temperature = behavior.config['target_temperature'];
        }

        behavior.sensors.forEach(
          (sensor_id: string) => {
            this.subscribeToAmbientSensor(sensor_id);
          }
        );
        behavior.devices.forEach(
          (device_id: string) => {
            this.subscribeToDevice(device_id);
          }
        )
      },
      (error) => {
        if (error.error == 'not-found') {
          this.toastService.warning('No active program, monitoring all sensors and devices.');

          this.sensors.forEach(
            (sensor: Sensor) => this.subscribeToAmbientTemperature(sensor.id, sensor.topic)
          );
          this.devices.forEach(
            (device: Device) => this.subscribeToDeviceState(device.id, device.topic)
          );
        }
        else {
          this.toastService.error('Error contacting server.');
        }
      }
    );
  }

  private subscribeToAmbientSensor(sensor_id: string) {
    const sensor = this.sensors.find((sensor) => sensor.id == sensor_id);
    if (sensor) {
      this.subscribeToAmbientTemperature(sensor.id, sensor.topic);
    }
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
    this.activeBehaviorSubs.push(sub);
  }

  private subscribeToDevice(device_id: string) {
    const device = this.devices.find((device) => device.id == device_id);
    if (device) {
      this.subscribeToDeviceState(device.id, device.topic);
    }
  }

  private subscribeToDeviceState(device_id: string, device_topic: string) {
    const sub = this.mqttService.observe(device_topic + '/state').subscribe(
      (message: IMqttMessage) => {
        const data = JSON.parse(message.payload.toString()) as DeviceState;
        data.id = device_id;
        this.device_states.set(device_id, data);
        this.updateDeviceState();
      }
    );
    this.activeBehaviorSubs.push(sub);
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

  private updateDeviceState() {
    let enabled = false;
    this.device_states.forEach(
      (state: DeviceState) => {
        enabled = enabled || state.enabled;
      }
    );
    // TODO mode should be read from behavior
    this.dial.hvac_state = enabled ? 'heating' : 'off';
  }
}
