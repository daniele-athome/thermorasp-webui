import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from "./routes/dashboard/dashboard.component";

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'devices', loadChildren: './routes/devices/devices.module#DevicesModule'},
  { path: 'sensors', loadChildren: './routes/sensors/sensors.module#SensorsModule'},
  { path: 'schedules', loadChildren: './routes/schedules/schedules.module#SchedulesModule'},
  { path: 'stats', loadChildren: './routes/stats/stats.module#StatsModule'},
  { path: 'eventlog', loadChildren: './routes/eventlog/eventlog.module#EventLogModule'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
