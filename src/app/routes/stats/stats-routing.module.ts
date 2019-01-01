import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StatsMenuComponent } from "./stats-menu/stats-menu.component";
import { StatsTempReadingsComponent } from "./stats-temp-readings/stats-temp-readings.component";

const routes: Routes = [
  { path: '', component: StatsMenuComponent },
  { path: 'temp_readings', component: StatsTempReadingsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatsRoutingModule { }
