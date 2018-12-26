import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Sensor, SensorForm } from "../../../core/models";
import { NgForm } from "@angular/forms";

@Component({
  selector: 'app-sensor-form',
  templateUrl: './sensor-form.component.html',
  styleUrls: ['./sensor-form.component.scss']
})
export class SensorFormComponent implements OnInit {

  @Input()
  model: Sensor;

  @Input()
  update: boolean;

  @Output()
  onSubmit: EventEmitter<SensorForm> = new EventEmitter<SensorForm>();

  constructor() { }

  ngOnInit() {
  }

  submit(form: NgForm) {
    this.onSubmit.emit(form.value);
  }

}
