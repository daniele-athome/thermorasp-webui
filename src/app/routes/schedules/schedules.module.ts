import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchedulesRoutingModule } from './schedules-routing.module';
import { ScheduleListComponent } from './schedule-list/schedule-list.component';
import { ScheduleViewComponent } from './schedule-view/schedule-view.component';

@NgModule({
  imports: [
    CommonModule,
    SchedulesRoutingModule
  ],
  declarations: [ScheduleListComponent, ScheduleViewComponent]
})
export class SchedulesModule { }
