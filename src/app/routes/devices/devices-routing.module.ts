import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeviceListComponent } from "./device-list/device-list.component";
import { DeviceCreateComponent } from "./device-create/device-create.component";

const routes: Routes = [
  { path: '', component: DeviceListComponent },
  { path: 'create', component: DeviceCreateComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DevicesRoutingModule { }
