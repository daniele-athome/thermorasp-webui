import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as $ from "jquery";
import 'fullcalendar';
import 'fullcalendar-scheduler';
import * as moment from 'moment';
import { Device, Schedule, ScheduleBehavior, Sensor } from "../../../core/models";
import { getMinutesInDay, getTemperatureColor } from "../../../shared";
import { AssertionError } from "assert";
import { SwalComponent } from "@toverux/ngx-sweetalert2";
import { DeviceService, ScheduleService, SensorService } from "../../../core/services";
import { ToastrService } from "ngx-toastr";
import { combineLatest } from "rxjs";

@Component({
  selector: 'app-schedule-view',
  templateUrl: './schedule-view.component.html',
  styleUrls: ['./schedule-view.component.scss']
})
export class ScheduleViewComponent implements OnInit {

  /** List of all configured sensors. */
  private sensors: CheckableSensor[];

  /** List of all configured devices. */
  private devices: CheckableDevice[];

  @ViewChild('scheduleView')
  private scheduleElement: ElementRef;

  @ViewChild('temperatureDialog')
  private temperatureDialog: SwalComponent;

  @Input()
  temperatureForm: SetTemperatureForm;

  private _schedule: Schedule;

  private calendar$: JQuery;

  private _error: boolean;

  loading: boolean;

  constructor(private scheduleService: ScheduleService,
              private sensorService: SensorService,
              private deviceService: DeviceService,
              private toastService: ToastrService) {
    this.loading = true;
    this._error = false;
  }

  ngOnInit() {
    this.calendar$ = $(this.scheduleElement.nativeElement);
    this.calendar$.fullCalendar({
      slotLabelFormat: 'H:mm',
      timeFormat: 'H:mm',
      editable: false,
      selectable: false,
      nowIndicator: true,
      eventOverlap: false,
      header: false,
      height: 'auto',
      timezone: 'UTC',
      defaultDate: '2000-01-01',
      now: moment.utc('2000-01-01 ' + moment().format('HH:mm'), 'YYYY-MM-DD HH:mm'),
      defaultView: 'timelineDay',
      views: {
        timelineWeek: {
          type: 'timeline',
          duration: { days: 1 }
        }
      },
      //slotWidth: 50,
      resourceAreaWidth: 100,
      resourceLabelText: 'Days',
      resources: [
        {id: '1', title: 'Monday'},
        {id: '2', title: 'Tuesday'},
        {id: '3', title: 'Wednesday'},
        {id: '4', title: 'Thursday'},
        {id: '5', title: 'Friday'},
        {id: '6', title: 'Saturday'},
        {id: '7', title: 'Sunday'},
      ],
      select: (start, end, jsEvent, view, resource) => this.onRangeSelected(start, end, resource),
      eventClick: (event, jsEvent, view) => this.onEventClick(event),
      eventResize: (event, delta, revertFunc, jsEvent, ui, view) => this.onEventResize(event),
      eventDrop: (event, delta, revertFunc, jsEvent, ui, view) => this.onEventMove(event),
      schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source'
    });
    this.calendar$.fullCalendar('option', 'slotWidth', 50);
  }

  @Input('schedule')
  set schedule(value: Schedule) {
    this.error = false;
    this._schedule = value;
    if (this._schedule) {
      // Schedule will be loaded after configuration
      // I don't like this though
      this.loadConfiguration();
    }
    else {
      this.loading = false;
    }
  }

  get schedule(): Schedule {
    return this._schedule;
  }

  set error(value: boolean) {
    this._error = value;
    if (value) {
      this.loading = false;
    }
  }

  get error(): boolean {
    return this._error;
  }

  private loadSchedule() {
    const events = [];
    this._schedule.behaviors.forEach(
      (behavior: ScheduleBehavior) => {
        events.push(...this.createEvents(behavior));
      }
    );

    console.log(events);
    this.calendar$.fullCalendar('removeEventSources', null);
    this.calendar$.fullCalendar('addEventSource', events);
    this.calendar$.fullCalendar('option', 'selectable', true);
    this.calendar$.fullCalendar('option', 'editable', true);
    this.loading = false;
  }

  private loadConfiguration() {
    const config = combineLatest(
      this.sensorService.query(),
      this.deviceService.query());
    config.subscribe(
      ([sensors, devices]) => {
        this.sensors = sensors as CheckableSensor[];
        this.devices = devices as CheckableDevice[];
        this.loadSchedule();
      },
      (error) => {
        this.toastService.error('Error contacting server.');
      }
    )
  }

  /** Very crappy algorithm to create FullCalendar events for a behavior. */
  private createEvents(behavior: ScheduleBehavior): any[] {
    const events = [];
    const diff_mins = behavior.end_time - behavior.start_time;

    const days_span = Math.ceil(diff_mins / 60 / 24);
    console.log("Days spanning: " + days_span);
    const first_day = Math.floor(behavior.start_time / 60 / 24) + 1;
    const last_day = first_day + days_span;

    for (let day_index = first_day; day_index < last_day; day_index++) {
      console.log("Day " + day_index);
      if (day_index == first_day && day_index < (last_day - 1)) {
        console.log("BEGIN-MIDNIGHT");
        const start = moment.utc('2000-01-01 ' +
          Math.trunc((behavior.start_time - ((first_day - 1) * 60 * 24)) / 60) + ':' +
          behavior.start_time % 60, 'YYYY-MM-DD H:m');
        const end = moment.utc('2000-01-02 00:00', 'YYYY-MM-DD H:m');
        events.push(this.buildTargetTemperatureEvent(start, end,
          behavior.config['target_temperature'], String(day_index), behavior.sensors, behavior.devices));
      }
      else if (day_index > first_day && day_index < (last_day - 1)) {
        console.log("FULL-DAY");
        const start = moment.utc('2000-01-01 00:00', 'YYYY-MM-DD H:m');
        const end = moment.utc('2000-01-02 00:00', 'YYYY-MM-DD H:m');
        events.push(this.buildTargetTemperatureEvent(start, end,
          behavior.config['target_temperature'], String(day_index), behavior.sensors, behavior.devices));
      }
      else if (day_index > first_day && day_index == (last_day - 1)) {
        console.log("MIDNIGHT-END");
        const start = moment.utc('2000-01-01 00:00', 'YYYY-MM-DD H:m');
        const end = moment.utc('2000-01-01 ' +
          Math.trunc((behavior.end_time - ((last_day - 2) * 60 * 24)) / 60) + ':' +
          behavior.end_time % 60, 'YYYY-MM-DD H:m');
        events.push(this.buildTargetTemperatureEvent(start, end,
          behavior.config['target_temperature'], String(day_index), behavior.sensors, behavior.devices));
      }
      else if (day_index == first_day && day_index == (last_day - 1)) {
        console.log("MID-DAY");
        const start = moment.utc('2000-01-01 ' +
          Math.trunc((behavior.start_time - ((first_day - 1) * 60 * 24)) / 60) + ':' +
          behavior.start_time % 60, 'YYYY-MM-DD H:m');
        const end = moment.utc('2000-01-01 ' +
          Math.trunc((behavior.end_time - ((last_day - 2) * 60 * 24)) / 60) + ':' +
          behavior.end_time % 60, 'YYYY-MM-DD H:m');
        events.push(this.buildTargetTemperatureEvent(start, end,
          behavior.config['target_temperature'], String(day_index), behavior.sensors, behavior.devices));
      }
      else {
        // alert firefighters!!!
        throw new AssertionError({message: 'NOOOOOOOOOOOOOOOOO!!!!!'});
      }
    }

    return events;
  }

  onRangeSelected(start: moment.Moment, end: moment.Moment, resource) {
    console.log({start: start, end: end, resource: resource});

    this.temperatureForm = {
      temperature: 20,
    } as SetTemperatureForm;
    this.sensors.forEach((sensor: CheckableSensor) => sensor.checked = true);
    this.devices.forEach((device: CheckableDevice) => device.checked = true);
    this.temperatureDialog.show().then(
      (result) => {
        if (result.value) {
          this.setTemperature(start, end, resource, String(this.temperatureForm.temperature),
            this.selectedSensors, this.selectedDevices);
        }
      }
    );
  }

  onEventClick(event) {
    this.temperatureForm = {
      temperature: event.title,
    } as SetTemperatureForm;
    this.sensors.forEach((sensor: CheckableSensor) => sensor.checked = (event.behavior.sensors.indexOf(sensor.id) >= 0));
    this.devices.forEach((device: CheckableDevice) => device.checked = (event.behavior.devices.indexOf(device.id) >= 0));
    this.temperatureDialog.show().then(
      (result) => {
        if (result.value) {
          event.title = this.temperatureForm.temperature;
          event.behavior.sensors = this.selectedSensors;
          event.behavior.devices = this.selectedDevices;
          event.backgroundColor = getTemperatureColor(Number(result.value));
          this.calendar$.fullCalendar('updateEvent', event);
          this.updateBehavior();
        }
      }
    );
  }

  private get selectedSensors() {
    return this.sensors
      .filter(opt => opt.checked)
      .map(opt => opt.id);
  }

  private get selectedDevices() {
    return this.devices
      .filter(opt => opt.checked)
      .map(opt => opt.id);
  }

  onEventResize(event) {
    this.updateBehavior();
  }

  onEventMove(event) {
    this.updateBehavior();
  }

  submitTemperature(form) {
    this.temperatureDialog.nativeSwal.clickConfirm();
  }

  private setTemperature(start: moment.Moment, end: moment.Moment, resource, value: string, sensors: string[], devices: string[]) {
    this.calendar$.fullCalendar('renderEvent', this.buildTargetTemperatureTodayEvent(start, end, value, resource.id, sensors, devices));
    this.updateBehavior();
  }

  private buildTargetTemperatureTodayEvent(start: moment.Moment, end: moment.Moment,
                                           temperature: string, resourceId: string,
                                           sensors: string[], devices: string[]) {
    return this.buildTargetTemperatureEvent(
      moment.utc('2000-01-01 ' + start.format('HH:mm'), 'YYYY-MM-DD HH:mm'),
      moment.utc('2000-01-01 ' + end.format('HH:mm'), 'YYYY-MM-DD HH:mm'),
      temperature, resourceId, sensors, devices
    );
  }

  private buildTargetTemperatureEvent(start: moment.Moment, end: moment.Moment,
                                      temperature: string, resourceId: string,
                                      sensors: string[], devices: string[]) {
    return {
      title: temperature,
      backgroundColor: getTemperatureColor(Number(temperature)),
      textColor: 'white',
      className: 'fc-temperature',
      resourceId: resourceId,
      start: start,
      end: end,
      behavior: {
        name: 'generic.TargetTemperatureBehavior',
        order: 10,
        config: {},
        sensors: sensors,
        devices: devices,
      }
    };
  }

  /** Reconstructs the whole schedule by reading events and sends it to the server. */
  private updateBehavior() {
    this.loading = true;
    const events = this.calendar$.fullCalendar('clientEvents', null);
    const behaviors: ScheduleBehavior[] = [];
    events.forEach(
      (event) => {
        console.log(event);
        // accounting for end-of-day threshold
        const end_day_offset = (event.end == null || event.end.date() > 1) ? 1 : 0;
        behaviors.push({
          id: 0,
          schedule_id: this._schedule.id,
          name: event.behavior.name,
          order: event.behavior.order,
          start_time: getMinutesInDay(Number(event.resourceId || event.resource.id), event.start),
          end_time: getMinutesInDay(Number(event.resourceId || event.resource.id)+end_day_offset, event.end),
          config: {
            target_temperature: Number(event.title),
            ...event.behavior.config,
          },
          sensors: event.behavior.sensors,
          devices: event.behavior.devices,
        } as ScheduleBehavior);
      }
    );

    console.log(behaviors);
    this.scheduleService.set_active({
      id: this._schedule.id,
      name: this._schedule.name,
      description: this._schedule.description,
      enabled: this._schedule.enabled,
      behaviors: behaviors
    } as Schedule).subscribe(
      () => {
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.toastService.error('Error contacting server. Changes might not have been saved.');
      }
    );
  }

}

export interface CheckableSensor extends Sensor {
  checked: boolean;
}

export interface CheckableDevice extends Device {
  checked: boolean;
}

export interface SetTemperatureForm {
  temperature: number;
  sensors: string[];
  devices: string[];
  //mode: 'heating'|'cooling';
}
