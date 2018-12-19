import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineLoadingComponent } from "./inline-loading";
import { ThermostatDialComponent } from "./thermostat-dial";
import { LogLevelToBootstrapPipe } from './pipes/log-level-to-bootstrap';

@NgModule({
  declarations: [InlineLoadingComponent, ThermostatDialComponent, LogLevelToBootstrapPipe],
  imports: [
    CommonModule
  ],
  exports: [InlineLoadingComponent, ThermostatDialComponent, LogLevelToBootstrapPipe]
})
export class SharedModule { }
