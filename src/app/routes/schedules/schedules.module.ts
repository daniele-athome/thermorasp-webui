import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchedulesRoutingModule } from './schedules-routing.module';
import { ScheduleListComponent } from './schedule-list/schedule-list.component';

@NgModule({
  imports: [
    CommonModule,
    SchedulesRoutingModule
  ],
  declarations: [ScheduleListComponent]
})
export class SchedulesModule { }
