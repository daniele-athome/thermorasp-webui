import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as $ from "jquery";
import 'fullcalendar';
import 'fullcalendar-scheduler';
import * as moment from 'moment';
import { Schedule, ScheduleBehavior } from "../../../core/models";
import { getMinutesInDay, getTemperatureColor } from "../../../shared";
import { AssertionError } from "assert";
import { SwalComponent } from "@toverux/ngx-sweetalert2";
import { ScheduleService } from "../../../core/services";
import { getDate } from "date-fns";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-schedule-view',
  templateUrl: './schedule-view.component.html',
  styleUrls: ['./schedule-view.component.scss']
})
export class ScheduleViewComponent implements OnInit {

  @ViewChild('scheduleView')
  private scheduleElement: ElementRef;

  @ViewChild('temperatureDialog')
  private temperatureDialog: SwalComponent;

  private _schedule: Schedule;

  private calendar$: JQuery;

  loading: boolean;

  constructor(private scheduleService: ScheduleService,
              private toastService: ToastrService) {
    this.loading = true;
  }

  ngOnInit() {
    this.calendar$ = $(this.scheduleElement.nativeElement);
    this.calendar$.fullCalendar({
      slotLabelFormat: 'H:mm',
      timeFormat: 'H:mm',
      editable: true,
      selectable: true,
      nowIndicator: true,
      header: false,
      height: 'auto',
      defaultDate: '2000-01-01',
      now: moment('2000-01-01 ' + moment().format('HH:mm'), 'YYYY-MM-DD HH:mm'),
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
      eventClick: (event, jsEvent, view) => this.onRangeClicked(event),
      // TODO eventResize: ()
      schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source'
    });
  }

  @Input('schedule')
  set schedule(value: Schedule) {
    this._schedule = value;
    this.loadSchedule();
  }

  get schedule(): Schedule {
    return this._schedule;
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
    this.loading = false;
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
        const start = moment('2000-01-01 ' +
          Math.trunc((behavior.start_time - ((first_day - 1) * 60 * 24)) / 60) + ':' +
          behavior.start_time % 60, 'YYYY-MM-DD H:m');
        const end = moment('2000-01-02 00:00', 'YYYY-MM-DD H:m');
        events.push(this.buildTargetTemperatureEvent(start, end,
          behavior.config['target_temperature'], String(day_index), behavior.sensors, behavior.devices));
      }
      else if (day_index > first_day && day_index < (last_day - 1)) {
        console.log("FULL-DAY");
        const start = moment('2000-01-01 00:00', 'YYYY-MM-DD H:m');
        const end = moment('2000-01-02 00:00', 'YYYY-MM-DD H:m');
        events.push(this.buildTargetTemperatureEvent(start, end,
          behavior.config['target_temperature'], String(day_index), behavior.sensors, behavior.devices));
      }
      else if (day_index > first_day && day_index == (last_day - 1)) {
        console.log("MIDNIGHT-END");
        const start = moment('2000-01-01 00:00', 'YYYY-MM-DD H:m');
        const end = moment('2000-01-01 ' +
          Math.trunc((behavior.end_time - ((last_day - 2) * 60 * 24)) / 60) + ':' +
          behavior.end_time % 60, 'YYYY-MM-DD H:m');
        events.push(this.buildTargetTemperatureEvent(start, end,
          behavior.config['target_temperature'], String(day_index), behavior.sensors, behavior.devices));
      }
      else if (day_index == first_day && day_index == (last_day - 1)) {
        console.log("MID-DAY");
        const start = moment('2000-01-01 ' +
          Math.trunc((behavior.start_time - ((first_day - 1) * 60 * 24)) / 60) + ':' +
          behavior.start_time % 60, 'YYYY-MM-DD H:m');
        const end = moment('2000-01-01 ' +
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
    this.temperatureDialog.show().then(
      (result) => {
        if (result.value) {
          this.setTemperature(start, end, resource, result.value);
        }
      }
    );
  }

  onRangeClicked(event) {
    this.temperatureDialog.inputValue = event.title;
    this.temperatureDialog.show().then(
      (result) => {
        if (result.value) {
          event.title = result.value;
          event.backgroundColor = getTemperatureColor(Number(result.value));
          this.calendar$.fullCalendar('updateEvent', event);
          this.updateBehavior();
        }
      }
    );
  }

  private setTemperature(start: moment.Moment, end: moment.Moment, resource, value: string) {
    this.calendar$.fullCalendar('renderEvent', this.buildTargetTemperatureTodayEvent(start, end, value, resource.id));
    this.updateBehavior();
  }

  private buildTargetTemperatureTodayEvent(start: moment.Moment, end: moment.Moment,
                                           temperature: string, resourceId: string) {
    return this.buildTargetTemperatureEvent(
      moment('2000-01-01 ' + start.format('HH:mm'), 'YYYY-MM-DD HH:mm'),
      moment('2000-01-01 ' + end.format('HH:mm'), 'YYYY-MM-DD HH:mm'),
      temperature, resourceId
    );
  }

  private buildTargetTemperatureEvent(start: moment.Moment, end: moment.Moment,
                                      temperature: string, resourceId: string,
                                      sensors?: string[], devices?: string[]) {
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
        const end_day_offset = (event.end == null || getDate(event.end) > 1) ? 1 : 0;
        behaviors.push({
          id: 0,
          schedule_id: this._schedule.id,
          behavior_name: event.behavior.name,
          behavior_order: event.behavior.order,
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
