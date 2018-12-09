import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { Device } from '../models';


@Injectable()
export class DeviceService {

  constructor (
    private apiService: ApiService
  ) {}

  query(): Observable<Device[]> {
    return this.apiService
      .get('/devices');
  }

}
