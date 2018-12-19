import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventLogListComponent } from "./eventlog-list/eventlog-list.component";

const routes: Routes = [
  { path: '', component: EventLogListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventLogRoutingModule { }
