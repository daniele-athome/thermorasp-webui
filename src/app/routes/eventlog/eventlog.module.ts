import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventLogRoutingModule } from './eventlog-routing.module';
import { EventLogListComponent } from './eventlog-list/eventlog-list.component';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  declarations: [EventLogListComponent],
  imports: [
    CommonModule,
    EventLogRoutingModule,
    SharedModule
  ]
})
export class EventLogModule { }
