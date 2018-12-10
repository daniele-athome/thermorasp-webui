import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DevicesRoutingModule } from './devices-routing.module';
import { DeviceListComponent } from './device-list/device-list.component';
import { DeviceCreateComponent } from './device-create/device-create.component';
import { DeviceFormComponent } from './device-form/device-form.component';
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [DeviceListComponent, DeviceCreateComponent, DeviceFormComponent],
  imports: [
    FormsModule,
    CommonModule,
    DevicesRoutingModule
  ]
})
export class DevicesModule { }
