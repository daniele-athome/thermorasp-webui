import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { Inject, NgModule } from '@angular/core';
import { MqttModule, MqttService } from "ngx-mqtt";
import { SweetAlert2Module } from "@toverux/ngx-sweetalert2";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule } from "ngx-toastr";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { HighchartsChartModule } from "highcharts-angular";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { DashboardComponent } from './routes/dashboard/dashboard.component';
import { CoreModule } from "./core";
import { SharedModule } from "./shared/shared.module";

export function locationFactory() {
  return window.location;
}

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    HeaderComponent,
    FooterComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    CoreModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    MqttModule.forRoot({ connectOnCreate: false }),
    SweetAlert2Module.forRoot(),
    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    HighchartsChartModule,
    ToastrModule.forRoot({progressBar: true, positionClass: 'toast-top-right-nav'}),
    SharedModule
  ],
  providers: [
    { provide: 'LOCATION', useFactory: locationFactory }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private mqttService: MqttService,
              @Inject('LOCATION') private location: Location) {
    this.mqttService.connect({
      hostname: environment.mqtt_host || location.hostname,
      port: Number(environment.mqtt_port || (location.port ? location.port : "80")),
      path: environment.mqtt_path
    });
  }
}
