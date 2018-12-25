import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as $ from "jquery";
import 'fullcalendar';
import 'fullcalendar-scheduler';
import * as moment from 'moment';
import { Device, Schedule, ScheduleBehavior, ScheduleSaved, Sensor } from "../../../core/models";
import { getMinutesInDay, getTemperatureColor } from "../../../shared";
import { AssertionError } from "assert";
import { SwalComponent } from "@toverux/ngx-sweetalert2";
import { DeviceService, ScheduleService, SensorService } from "../../../core/services";
import { ToastrService } from "ngx-toastr";
import { combineLatest, Observable } from "rxjs";
import swal from "sweetalert2";

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

  @ViewChild('scheduleDialog')
  private scheduleDialog: SwalComponent;

  @Input()
  temperatureForm: SetTemperatureForm;

  @Input()
  scheduleForm: ScheduleForm;

  @Output('onPersistComplete')
  commitCompleteEvent: EventEmitter<void> = new EventEmitter();

  @Output('onResetComplete')
  rollbackCompleteEvent: EventEmitter<void> = new EventEmitter();

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
      footer: false,
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
          behavior.config['target_temperature'], behavior.order, String(day_index), behavior.sensors, behavior.devices, behavior.id == 0));
      }
      else if (day_index > first_day && day_index < (last_day - 1)) {
        console.log("FULL-DAY");
        const start = moment.utc('2000-01-01 00:00', 'YYYY-MM-DD H:m');
        const end = moment.utc('2000-01-02 00:00', 'YYYY-MM-DD H:m');
        events.push(this.buildTargetTemperatureEvent(start, end,
          behavior.config['target_temperature'], behavior.order, String(day_index), behavior.sensors, behavior.devices, behavior.id == 0));
      }
      else if (day_index > first_day && day_index == (last_day - 1)) {
        console.log("MIDNIGHT-END");
        const start = moment.utc('2000-01-01 00:00', 'YYYY-MM-DD H:m');
        const end = moment.utc('2000-01-01 ' +
          Math.trunc((behavior.end_time - ((last_day - 2) * 60 * 24)) / 60) + ':' +
          behavior.end_time % 60, 'YYYY-MM-DD H:m');
        events.push(this.buildTargetTemperatureEvent(start, end,
          behavior.config['target_temperature'], behavior.order, String(day_index), behavior.sensors, behavior.devices, behavior.id == 0));
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
          behavior.config['target_temperature'], behavior.order, String(day_index), behavior.sensors, behavior.devices, behavior.id == 0));
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
      order: 10,
    } as SetTemperatureForm;
    this.sensors.forEach((sensor: CheckableSensor) => sensor.checked = true);
    this.devices.forEach((device: CheckableDevice) => device.checked = true);
    this.temperatureDialog.show().then(
      (result) => {
        if (result.value) {
          this.setTemperature(start, end, resource, this.temperatureForm.temperature, this.temperatureForm.order,
            this.selectedSensors, this.selectedDevices);
        }
      }
    );
  }

  onEventClick(event) {
    this.temperatureForm = {
      temperature: event.behavior.config['target_temperature'],
      order: event.behavior.order
    } as SetTemperatureForm;
    this.sensors.forEach((sensor: CheckableSensor) => sensor.checked = (event.behavior.sensors.indexOf(sensor.id) >= 0));
    this.devices.forEach((device: CheckableDevice) => device.checked = (event.behavior.devices.indexOf(device.id) >= 0));
    this.temperatureDialog.show().then(
      (result) => {
        if (result.value) {
          event.title = this.temperatureForm.temperature;
          event.behavior.config['target_temperature'] = this.temperatureForm.temperature;
          event.behavior.order = this.temperatureForm.order;
          event.behavior.sensors = this.selectedSensors;
          event.behavior.devices = this.selectedDevices;
          event.backgroundColor = getTemperatureColor(this.temperatureForm.temperature);
          this.calendar$.fullCalendar('updateEvent', event);
          this.updateActiveSchedule();
        }
        else if (result.dismiss == swal.DismissReason.cancel) {
          console.log(event);
          this.calendar$.fullCalendar('removeEvents', event._id);
          this.updateActiveSchedule();
        }
      }
    );
  }

  editSchedule() {
    this.scheduleForm = {
      name: this._schedule.name,
      description: this._schedule.description,
    } as ScheduleForm;
    this.scheduleDialog.show().then(
      (result) => {
        if (result.value) {
          this._schedule.name = this.scheduleForm.name;
          this._schedule.description = this.scheduleForm.description;
          this.updateActiveSchedule();
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
    this.updateActiveSchedule();
  }

  onEventMove(event) {
    this.updateActiveSchedule();
  }

  submitTemperature(form) {
    this.temperatureDialog.nativeSwal.clickConfirm();
  }

  submitSchedule(form) {
    this.scheduleDialog.nativeSwal.clickConfirm();
  }

  private setTemperature(start: moment.Moment, end: moment.Moment, resource, temperature: number, order: number, sensors: string[], devices: string[]) {
    this.calendar$.fullCalendar('renderEvent', this.buildTargetTemperatureTodayEvent(start, end, temperature, order, resource.id, sensors, devices));
    this.updateActiveSchedule();
  }

  private buildTargetTemperatureTodayEvent(start: moment.Moment, end: moment.Moment,
                                           temperature: number, order: number, resourceId: string,
                                           sensors: string[], devices: string[]) {
    return this.buildTargetTemperatureEvent(
      moment.utc('2000-01-01 ' + start.format('HH:mm'), 'YYYY-MM-DD HH:mm'),
      moment.utc('2000-01-01 ' + end.format('HH:mm'), 'YYYY-MM-DD HH:mm'),
      temperature, order, resourceId, sensors, devices, false
    );
  }

  private buildTargetTemperatureEvent(start: moment.Moment, end: moment.Moment,
                                      temperature: number, order: number, resourceId: string,
                                      sensors: string[], devices: string[], volatile: boolean) {
    return {
      title: String(temperature),
      backgroundColor: getTemperatureColor(temperature),
      textColor: 'white',
      className: 'fc-temperature',
      resourceId: resourceId,
      start: start,
      end: end,
      behavior: {
        name: 'generic.TargetTemperatureBehavior',
        order: order,
        config: {'target_temperature': temperature},
        sensors: sensors,
        devices: devices,
        volatile: volatile,
      }
    };
  }

  /** Reconstructs the whole schedule by reading events and sends it to the server. */
  private updateActiveSchedule() {
    this.loading = true;
    this.scheduleService.set_active(this.persistable_schedule).subscribe(
      () => {
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.toastService.error('Error contacting server. Changes might not have been saved.');
      }
    );
  }

  get persistable_schedule(): Schedule {
    const events = this.calendar$.fullCalendar('clientEvents', null);
    const behaviors: ScheduleBehavior[] = [];
    events.forEach(
      (event) => {
        console.log(event);
        // don't reassing an id to volatile events (e.g. set from dashboard)
        const behavior_id = event.behavior.volatile ? 0 : (behaviors.length + 1);

        // accounting for end-of-day threshold
        const end_day_offset = (event.end == null || event.end.date() > 1) ? 1 : 0;
        behaviors.push({
          id: behavior_id,
          //schedule_id: this._schedule.id,
          name: event.behavior.name,
          order: event.behavior.order,
          start_time: getMinutesInDay(Number(event.resourceId || event.resource.id), event.start),
          end_time: getMinutesInDay(Number(event.resourceId || event.resource.id)+end_day_offset, event.end),
          config: event.behavior.config,
          sensors: event.behavior.sensors,
          devices: event.behavior.devices,
        } as ScheduleBehavior);
      }
    );

    console.log(behaviors);
    return {
      id: this._schedule.id,
      name: this._schedule.name,
      description: this._schedule.description,
      enabled: this._schedule.enabled,
      behaviors: behaviors
    } as Schedule;
  }

  commitActive() {
    this.loading = true;
    let task: Observable<any>;
    const schedule = this.persistable_schedule;
    if (schedule.id > 0) {
      task = this.scheduleService.update(schedule);
    }
    else {
      task = this.scheduleService.create(schedule);
    }

    task.subscribe(
      (saved: ScheduleSaved) => {
        if (saved) {
          this._schedule.id = saved.id;
        }
        this.commitCompleteEvent.emit();
        this.toastService.success('Program persisted to database.');
        this.loading = false;
      },
      (error) => {
        this.toastService.error('Error contacting server. Changes might not have been saved.');
        this.loading = false;
      }
    );
  }

  rollbackActive() {
    this.loading = true;
    this.scheduleService.active_rollback().subscribe(
      () => {
        this.rollbackCompleteEvent.emit();
      },
      (error) => {
        if (error.error != 'not-found') {
          this.toastService.error('Error contacting server.');
          this.error = true;
        }
        else {
          this.schedule = this.emptySchedule();
        }
        this.loading = false;
      }
    );
  }

  private emptySchedule() {
    return {
      id: 0,
      name: 'New program',
      description: 'New program',
      enabled: true,
      behaviors: []
    } as Schedule;
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
  order: number;
  sensors: string[];
  devices: string[];
  //mode: 'heating'|'cooling';
}

export interface ScheduleForm {
  name: string;
  description: string;
}
