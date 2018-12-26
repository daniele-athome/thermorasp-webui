import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SensorListComponent } from "./sensor-list/sensor-list.component";
import { SensorCreateComponent } from "./sensor-create/sensor-create.component";

const routes: Routes = [
  { path: '', component: SensorListComponent },
  { path: 'create', component: SensorCreateComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SensorsRoutingModule { }
