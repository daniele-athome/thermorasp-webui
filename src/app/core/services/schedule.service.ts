import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { Schedule, ScheduleBehavior } from '../models';


@Injectable()
export class ScheduleService {

  constructor (
    private apiService: ApiService
  ) {}

  query(): Observable<Schedule[]> {
    return this.apiService
      .get('/schedules');
  }

  get(id: number): Observable<Schedule> {
    return this.apiService
      .get('/schedules/' + id);
  }

  active(): Observable<Schedule> {
    return this.apiService
      .get('/schedules/active');
  }

  active_rollback(): Observable<void> {
    return this.apiService
      .put('/schedules/active/rollback');
  }

  active_behavior(): Observable<ScheduleBehavior> {
    return this.apiService
      .get('/schedules/active/behavior');
  }

}
