import { Component, OnInit } from '@angular/core';
import { SensorService } from "../../../core/services";
import { Router } from "@angular/router";
import { SensorForm } from "../../../core/models";

@Component({
  selector: 'app-sensor-create',
  templateUrl: './sensor-create.component.html',
  styleUrls: ['./sensor-create.component.scss']
})
export class SensorCreateComponent implements OnInit {

  constructor(private sensorService: SensorService, private router: Router) { }

  ngOnInit() {
  }

  save(sensor: SensorForm) {
    // TODO loading status
    // TODO error handling
    this.sensorService.register(sensor).subscribe(
      (result) => {
        console.log(result);
        this.router.navigate(['/sensors']);
      }
    );
    console.log(sensor);
  }

  newSensor(): SensorForm {
    let form = {} as SensorForm;
    form.protocol = 'local';
    form.type = 'temperature';
    return form;
  }

}
