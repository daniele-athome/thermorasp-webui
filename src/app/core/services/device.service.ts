import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { Device, DeviceForm } from '../models';


@Injectable()
export class DeviceService {

  constructor (
    private apiService: ApiService
  ) {}

  query(): Observable<Device[]> {
    return this.apiService
      .get('/devices');
  }

  register(device: DeviceForm): Observable<Device> {
    return this.apiService
      .post('/devices/register', device);
  }

  unregister(device_id: string): Observable<Device> {
    return this.apiService
      .post('/devices/unregister', {id: device_id});
  }

}
