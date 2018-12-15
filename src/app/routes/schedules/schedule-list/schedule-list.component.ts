import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as $ from 'jquery';
import 'fullcalendar';
import 'fullcalendar-scheduler';
import * as moment from 'moment';
import { ScheduleService } from "../../../core/services";
import { Schedule, ScheduleBehavior } from "../../../core/models";
import { AssertionError } from "assert";
import { getTemperatureColor } from "../../../shared";

@Component({
  selector: 'app-schedule-list',
  templateUrl: './schedule-list.component.html',
  styleUrls: ['./schedule-list.component.scss']
})
export class ScheduleListComponent implements OnInit {

  @ViewChild('schedule')
  scheduleElement: ElementRef;

  private calendar$: JQuery;

  constructor(private scheduleService: ScheduleService) { }

  ngOnInit() {
    this.calendar$ = $(this.scheduleElement.nativeElement);
    this.calendar$.fullCalendar({
      slotLabelFormat: 'H:mm',
      timeFormat: 'H:mm',
      editable: true,
      selectable: true,
      nowIndicator: true,
      header: {
        'left': 'title',
        'center': '',
        'right': '',
      },
      titleFormat: '[...]',
      height: 'auto',
      defaultDate: '2000-01-01',
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
      select: this.selectRange,
      schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source'
    });

    // time to fill it!
    this.loadSchedule();
  }

  private loadSchedule() {
    // TODO what if there is no active schedule?
    this.scheduleService.active().subscribe(
      (schedule: Schedule) => {
        this.calendar$.fullCalendar('option', 'titleFormat', '[' + schedule.name + ']');

        const events = [];
        schedule.behaviors.forEach(
          (behavior: ScheduleBehavior) => {
            events.push(...ScheduleListComponent.createEvents(behavior));
          }
        );

        console.log(events);
        this.calendar$.fullCalendar('removeEventSources', null);
        this.calendar$.fullCalendar('addEventSource', events);
      }
    );
  }

  /** Very crappy algorithm to create FullCalendar events for a behavior. */
  private static createEvents(behavior: ScheduleBehavior): any[] {
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
        events.push({
          title: behavior.config['target_temperature'],
          backgroundColor: getTemperatureColor(behavior.config['target_temperature']),
          textColor: 'white',
          resourceId: String(day_index),
          start: start,
          end: end,
        });
      }
      else if (day_index > first_day && day_index < (last_day - 1)) {
        console.log("FULL-DAY");
        const start = moment('2000-01-01 00:00', 'YYYY-MM-DD H:m');
        const end = moment('2000-01-02 00:00', 'YYYY-MM-DD H:m');
        events.push({
          title: behavior.config['target_temperature'],
          backgroundColor: getTemperatureColor(behavior.config['target_temperature']),
          textColor: 'white',
          resourceId: String(day_index),
          start: start,
          end: end,
        });
      }
      else if (day_index > first_day && day_index == (last_day - 1)) {
        console.log("MIDNIGHT-END");
        const start = moment('2000-01-01 00:00', 'YYYY-MM-DD H:m');
        const end = moment('2000-01-01 ' +
          Math.trunc((behavior.end_time - ((last_day - 2) * 60 * 24)) / 60) + ':' +
          behavior.end_time % 60, 'YYYY-MM-DD H:m');
        events.push({
          title: behavior.config['target_temperature'],
          backgroundColor: getTemperatureColor(behavior.config['target_temperature']),
          textColor: 'white',
          resourceId: String(day_index),
          start: start,
          end: end,
        });
      }
      else if (day_index == first_day && day_index == (last_day - 1)) {
        console.log("MID-DAY");
        const start = moment('2000-01-01 ' +
          Math.trunc((behavior.start_time - ((first_day - 1) * 60 * 24)) / 60) + ':' +
          behavior.start_time % 60, 'YYYY-MM-DD H:m');
        const end = moment('2000-01-01 ' +
          Math.trunc((behavior.end_time - ((last_day - 2) * 60 * 24)) / 60) + ':' +
          behavior.end_time % 60, 'YYYY-MM-DD H:m');
        events.push({
          title: behavior.config['target_temperature'],
          backgroundColor: getTemperatureColor(behavior.config['target_temperature']),
          resourceId: String(day_index),
          start: start,
          end: end,
        });
      }
      else {
        throw new AssertionError({message: 'NOOOOOOOOOOOOOOOOO!!!!!'});
      }
    }

    return events;
  }

  selectRange(start: moment.Moment, end: moment.Moment, jsEvent: MouseEvent, view, resource) {
    console.log({start: start, end: end, jsEvent: jsEvent, view: view, resource: resource})
  }

}
