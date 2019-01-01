import { Injectable } from '@angular/core';
import { HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';

import * as moment from 'moment';

import { ApiService } from './api.service';
import { Sensor, SensorForm, SensorReading } from '../models';


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

  register(sensor: SensorForm): Observable<Sensor> {
    return this.apiService
      .post('/sensors/register', sensor);
  }

  unregister(sensor_id: string): Observable<Sensor> {
    return this.apiService
      .post('/sensors/unregister', {id: sensor_id});
  }

  latest_readings(sensor_type?: string): Observable<SensorReading[]> {
    const options = sensor_type ?
      new HttpParams().set('sensor_type', sensor_type) : null;
    return this.apiService
      .get('/sensors/reading', options);
  }

  readings_list(from: moment.Moment, to: moment.Moment, sensor_type?: string): Observable<SensorReading[]> {
    let options = new HttpParams()
      .set('from', from.format('YYYY-MM-DDTHH:mm:ss'))
      .set('to', to.format('YYYY-MM-DDTHH:mm:ss'));
    if (sensor_type) {
      options = options.set('sensor_type', sensor_type);
    }
    return this.apiService
      .get('/sensors/readings', options);
  }

}
