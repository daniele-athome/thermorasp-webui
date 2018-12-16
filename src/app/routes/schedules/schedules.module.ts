import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SweetAlert2Module } from "@toverux/ngx-sweetalert2";

import { SchedulesRoutingModule } from './schedules-routing.module';
import { ScheduleListComponent } from './schedule-list/schedule-list.component';
import { ScheduleViewComponent } from './schedule-view/schedule-view.component';

@NgModule({
  imports: [
    CommonModule,
    SchedulesRoutingModule,
    SweetAlert2Module
  ],
  declarations: [ScheduleListComponent, ScheduleViewComponent]
})
export class SchedulesModule { }
