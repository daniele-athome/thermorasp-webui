import { Component, OnInit } from '@angular/core';
import { Device, DeviceForm } from "../../../core/models";
import { DeviceService } from "../../../core/services";
import { Router } from "@angular/router";

@Component({
  selector: 'app-device-create',
  templateUrl: './device-create.component.html',
  styleUrls: ['./device-create.component.scss']
})
export class DeviceCreateComponent implements OnInit {

  constructor(private deviceService: DeviceService, private router: Router) { }

  ngOnInit() {
  }

  save(device: Device) {
    // TODO loading status
    // TODO error handling
    this.deviceService.register(device).subscribe(
      (result: Device) => {
        console.log(result);
        this.router.navigate(['/devices']);
      }
    );
    console.log(device);
  }

  newDevice(): DeviceForm {
    let form = new DeviceForm();
    form.protocol = 'local';
    form.type = 'boiler_on_off';
    return form;
  }
}
