import { Component, OnInit } from '@angular/core';
import { Device, DeviceService } from "../../../core";

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss']
})
export class DeviceListComponent implements OnInit {

  devices: Device[];

  constructor(private deviceService: DeviceService) { }

  ngOnInit() {
    // TODO loading status
    this.deviceService.query().subscribe(
      (devices: Device[]) => {
        this.devices = devices;
      }
    );
  }

}
