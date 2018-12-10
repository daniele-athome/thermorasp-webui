import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SensorListComponent } from "./sensor-list/sensor-list.component";

const routes: Routes = [
  { path: '', component: SensorListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SensorsRoutingModule { }