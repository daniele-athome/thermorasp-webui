import { Component, OnInit } from '@angular/core';
import {Device, DeviceService} from "../../core";

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss']
})
export class DevicesComponent implements OnInit {

  devices: Device[];

  constructor(private deviceService: DeviceService) { }

  ngOnInit() {
    this.deviceService.query().subscribe(
      (devices: Device[]) => {
        this.devices = devices;
      }
    );
  }

}
