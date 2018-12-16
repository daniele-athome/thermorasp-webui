import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineLoadingComponent } from "./inline-loading";
import { ThermostatDialComponent } from "./thermostat-dial";

@NgModule({
  declarations: [InlineLoadingComponent, ThermostatDialComponent],
  imports: [
    CommonModule
  ],
  exports: [InlineLoadingComponent, ThermostatDialComponent]
})
export class SharedModule { }
