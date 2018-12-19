import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'log_level_to_bootstrap'
})
export class LogLevelToBootstrapPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (value) {
      case 'info':
        return 'info';
      case 'warning':
        return 'warning';
      case 'error':
        return 'danger';
      case 'danger':
        // custom class
        return 'blood';
    }
  }

}
