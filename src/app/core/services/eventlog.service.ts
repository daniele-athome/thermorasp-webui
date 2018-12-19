import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { EventLog } from '../models';
import { HttpParams } from "@angular/common/http";


@Injectable()
export class EventLogService {

  constructor (
    private apiService: ApiService
  ) {}

  next(start_id?, page_size?): Observable<EventLog[]> {
    const options = new HttpParams()
      .set('start_id', start_id ? start_id : '')
      .set('page_size', page_size ? page_size : '');
    return this.apiService
      .get('/eventlog/next', options);
  }

  prev(start_id?, page_size?): Observable<EventLog[]> {
    const options = new HttpParams()
      .set('start_id', start_id ? start_id : '')
      .set('page_size', page_size ? page_size : '');
    return this.apiService
      .get('/eventlog/prev', options);
  }

}
