import { Component, OnInit } from '@angular/core';
import { EventLog, EventLogService } from "../../../core";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-eventlog-list',
  templateUrl: './eventlog-list.component.html',
  styleUrls: ['./eventlog-list.component.scss']
})
export class EventLogListComponent implements OnInit {

  loading: boolean;

  events: EventLog[];

  constructor(private eventlogService: EventLogService,
              private toastService: ToastrService) {
    this.loading = true;
  }

  ngOnInit() {
    this.eventlogService.next().subscribe(
      (events: EventLog[]) => {
        this.loading = false;
        this.events = events;
      },
      (error) => {
        this.loading = false;
        this.toastService.error('Error contacting server.');
      }
    )
  }

  goPrev() {
    if (this.events.length > 0) {
      this.loading = true;
      const startId = this.events[0].id;
      this.eventlogService.next(startId).subscribe(
        (events: EventLog[]) => {
          this.loading = false;
          if (events.length > 0) {
            this.events = events;
          }
        },
        (error) => {
          this.loading = false;
          this.toastService.error('Error contacting server.');
        }
      );
    }
  }

  goNext() {
    if (this.events.length > 0) {
      this.loading = true;
      const startId = this.events[this.events.length - 1].id;
      this.eventlogService.next(startId).subscribe(
        (events: EventLog[]) => {
          this.loading = false;
          if (events.length > 0) {
            this.events = events;
          }
        },
        (error) => {
          this.loading = false;
          this.toastService.error('Error contacting server.');
        }
      );
    }
  }

}
