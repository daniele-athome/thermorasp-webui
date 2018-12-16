import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { Schedule, ScheduleBehavior, VolatileScheduleBehavior } from '../models';


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

  set_active(schedule: Schedule): Observable<void> {
    return this.apiService
      .put('/schedules/active', schedule);
  }

  active_rollback(): Observable<void> {
    return this.apiService
      .put('/schedules/active/rollback');
  }

  active_behavior(): Observable<ScheduleBehavior> {
    return this.apiService
      .get('/schedules/active/behavior');
  }

  set_active_volatile_behavior(behavior: VolatileScheduleBehavior): Observable<void> {
    return this.apiService
      .post('/schedules/active/volatile', behavior);
  }

}
