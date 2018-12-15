import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from "./routes/dashboard/dashboard.component";

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'devices', loadChildren: './routes/devices/devices.module#DevicesModule'},
  { path: 'sensors', loadChildren: './routes/sensors/sensors.module#SensorsModule'},
  { path: 'schedules', loadChildren: './routes/schedules/schedules.module#SchedulesModule'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
