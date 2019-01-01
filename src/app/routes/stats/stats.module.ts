import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatsRoutingModule } from './stats-routing.module';
import { StatsMenuComponent } from './stats-menu/stats-menu.component';
import { StatsTempReadingsComponent } from './stats-temp-readings/stats-temp-readings.component';
import { HighchartsChartModule } from "highcharts-angular";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  declarations: [StatsMenuComponent, StatsTempReadingsComponent],
  imports: [
    CommonModule,
    SharedModule,
    HighchartsChartModule,
    StatsRoutingModule
  ]
})
export class StatsModule { }
