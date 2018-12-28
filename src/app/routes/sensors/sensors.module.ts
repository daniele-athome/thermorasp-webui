import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { SensorsRoutingModule } from './sensors-routing.module';
import { SensorListComponent } from './sensor-list/sensor-list.component';
import { TempUnitPipe } from "../../pipes/temp-unit.pipe";
import { SharedModule } from "../../shared/shared.module";
import { SensorCreateComponent } from './sensor-create/sensor-create.component';
import { SensorFormComponent } from './sensor-form/sensor-form.component';
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [SensorListComponent, TempUnitPipe, SensorCreateComponent, SensorFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    SensorsRoutingModule,
    SharedModule,
    TooltipModule
  ]
})
export class SensorsModule { }
