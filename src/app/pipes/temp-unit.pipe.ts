import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'temp_unit'
})
export class TempUnitPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value && value.unit) {
      switch (value.unit) {
        case 'celsius':
          return value.value + ' °C';
        default:
          return value.value;
      }
    }
    else {
      return '--';
    }
  }

}
