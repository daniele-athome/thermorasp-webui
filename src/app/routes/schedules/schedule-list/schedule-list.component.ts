import { Component, OnInit, ViewChild } from '@angular/core';
import { ScheduleService } from "../../../core/services";
import { Schedule } from "../../../core/models";
import { ScheduleViewComponent } from "../schedule-view/schedule-view.component";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-schedule-list',
  templateUrl: './schedule-list.component.html',
  styleUrls: ['./schedule-list.component.scss']
})
export class ScheduleListComponent implements OnInit {

  @ViewChild('schedule')
  currentSchedule: ScheduleViewComponent;

  schedules: Schedule[];

  loading: boolean;

  constructor(private scheduleService: ScheduleService,
              private toastService: ToastrService) {
    this.loading = true;
  }

  ngOnInit() {
    // time to fill it!
    this.loadActiveSchedule();
    this.loadSchedules();
  }

  private loadActiveSchedule() {
    // TODO what if there is no active schedule?
    this.scheduleService.active().subscribe(
      (schedule: Schedule) => {
        this.currentSchedule.schedule = schedule;
      },
      (error) => {
        this.toastService.error('Error contacting server.');
        this.currentSchedule.error = true;
      }
    );
  }

  private loadSchedules() {
    this.scheduleService.query().subscribe(
      (schedules: Schedule[]) => {
        this.schedules = schedules;
        this.loading = false;
      },
      (error) => {
        this.toastService.error('Error contacting server.');
        this.loading = false;
      }
    )
  }

}
