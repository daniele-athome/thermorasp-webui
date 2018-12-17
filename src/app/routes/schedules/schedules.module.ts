import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { SweetAlert2Module } from "@toverux/ngx-sweetalert2";

import { SchedulesRoutingModule } from './schedules-routing.module';
import { ScheduleListComponent } from './schedule-list/schedule-list.component';
import { ScheduleViewComponent } from './schedule-view/schedule-view.component';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    SchedulesRoutingModule,
    SweetAlert2Module,
    SharedModule
  ],
  declarations: [ScheduleListComponent, ScheduleViewComponent]
})
export class SchedulesModule { }
