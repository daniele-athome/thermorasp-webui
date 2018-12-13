import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgModule } from '@angular/core';
import { IMqttServiceOptions, MqttModule } from "ngx-mqtt";
import { SweetAlert2Module } from "@toverux/ngx-sweetalert2";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule } from "ngx-toastr";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { DashboardComponent } from './routes/dashboard/dashboard.component';
import { CoreModule } from "./core";
import { ThermostatDialComponent } from "./components/thermostat-dial/thermostat-dial.component";

const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  hostname: environment.mqtt_host,
  port: environment.mqtt_port,
  path: environment.mqtt_path
};

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    ThermostatDialComponent
  ],
  imports: [
    BrowserModule,
    CoreModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    MqttModule.forRoot(MQTT_SERVICE_OPTIONS),
    SweetAlert2Module.forRoot(),
    BrowserAnimationsModule,
    ToastrModule.forRoot({progressBar: true, positionClass: 'toast-top-right-nav'})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
