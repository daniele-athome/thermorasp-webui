import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { Sensor, SensorReading } from '../models';
import { HttpParams } from "@angular/common/http";


@Injectable()
export class SensorService {

  constructor (
    private apiService: ApiService
  ) {}

  query(): Observable<Sensor[]> {
    return this.apiService
      .get('/sensors');
  }

  topic(sensor_id: string): Observable<string> {
    return this.apiService
      .get('/sensors/topic/' + sensor_id);
  }

  register(sensor: Sensor): Observable<Sensor> {
    return this.apiService
      .post('/sensors/register', sensor);
  }

  unregister(sensor: Sensor): Observable<Sensor> {
    return this.apiService
      .post('/sensors/unregister', sensor);
  }

  readings(sensor_type?: string): Observable<SensorReading[]> {
    const options = sensor_type ?
      new HttpParams().set('sensor_type', sensor_type) : null;
    return this.apiService
      .get('/sensors/reading', options);
  }

}
