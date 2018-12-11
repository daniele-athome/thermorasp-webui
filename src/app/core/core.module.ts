import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from "@angular/common/http";

import { ApiService, DeviceService, SensorService, ScheduleService } from "./services";

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  providers: [
    ApiService,
    DeviceService,
    SensorService,
    ScheduleService
  ]
})
export class CoreModule { }
