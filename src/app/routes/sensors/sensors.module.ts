import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SensorsRoutingModule } from './sensors-routing.module';
import { SensorListComponent } from './sensor-list/sensor-list.component';
import { TempUnitPipe } from "../../pipes/temp-unit.pipe";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  declarations: [SensorListComponent, TempUnitPipe],
  imports: [
    CommonModule,
    SensorsRoutingModule,
    SharedModule
  ]
})
export class SensorsModule { }
