import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Device, DeviceForm } from "../../../core/models";
import { NgForm } from "@angular/forms";

@Component({
  selector: 'app-device-form',
  templateUrl: './device-form.component.html',
  styleUrls: ['./device-form.component.scss']
})
export class DeviceFormComponent implements OnInit {

  @Input()
  model: Device;

  @Input()
  update: boolean;

  @Output()
  onSubmit: EventEmitter<DeviceForm> = new EventEmitter<DeviceForm>();

  constructor() { }

  ngOnInit() {
  }

  submit(form: NgForm) {
    this.onSubmit.emit(form.value);
  }

}
