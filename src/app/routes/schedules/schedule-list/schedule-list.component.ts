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

  constructor(private scheduleService: ScheduleService,
              private toastService: ToastrService) { }

  ngOnInit() {
    // time to fill it!
    this.loadSchedule();
  }

  private loadSchedule() {
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

}
