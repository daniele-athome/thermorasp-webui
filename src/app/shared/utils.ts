
import * as moment from 'moment';
import { ColorGradient } from './color-gradient';

export function getCurrentMinute(): number {
  return getMinutesInDayForDate(moment());
}

export function getTodayLastMinute(): number {
  return getMinutesInDayForDate(moment().endOf('day').add(1, 'second'));
}

function getMinutesInDayForDate(date: moment.Moment): number {
  return ((date.isoWeekday() - 1) * 24 * 60) +
         (date.hour() * 60) +
          date.minute();
}

export function getMinutesInDay(day_index: number, date: moment.Moment): number {
  return ((day_index - 1) * 24 * 60) +
    (date.hour() * 60) +
    date.minute();
}

// gradient will be derived from this interval
const tempInterval = [15, 25];
const tempGradient = new ColorGradient(["#00f", "#f23700"]);

export function getTemperatureColor(temp: number): string {
  const percent = (temp - tempInterval[0]) / (tempInterval[1] - tempInterval[0]) * 100;
  return tempGradient.getHexColorAtPercent(percent);
}
