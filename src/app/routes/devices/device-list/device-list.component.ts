import { Component, OnInit } from '@angular/core';
import { Device, DeviceService } from "../../../core";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss']
})
export class DeviceListComponent implements OnInit {

  devices: Device[];

  loading: boolean;

  constructor(private deviceService: DeviceService,
              private toastService: ToastrService) {
    this.loading = true;
  }

  ngOnInit() {
    // TODO loading status
    this.deviceService.query().subscribe(
      (devices: Device[]) => {
        this.loading = false;
        this.devices = devices;
      },
      (error) => {
        this.loading = false;
        this.toastService.error('Error contacting server.');
      }
    );
    // TODO subscribe to devices state
  }

}
