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

  constructor(private deviceService: DeviceService,
              private toastService: ToastrService) { }

  ngOnInit() {
    // TODO loading status
    this.deviceService.query().subscribe(
      (devices: Device[]) => {
        this.devices = devices;
      },
      (error) => {
        this.toastService.error('Error contacting server.');
      }
    );
    // TODO subscribe to devices state
  }

}
