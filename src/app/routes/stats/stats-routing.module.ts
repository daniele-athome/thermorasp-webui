import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StatsMenuComponent } from "./stats-menu/stats-menu.component";

const routes: Routes = [
  { path: '', component: StatsMenuComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatsRoutingModule { }
