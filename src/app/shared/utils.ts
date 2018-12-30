
import * as moment from 'moment';
import { ColorGradient } from './color-gradient';

export function getCurrentMinute(): number {
  return getMinutesInDayForDate(moment());
}

export function getTodayLastMinute(): number {
  const mins = getMinutesInDayForDate(moment().endOf('day').add(1, 'second'));
  if (!mins) {
    // special case: end of 7th day
    // ugly hack, I know
    return getMinutesInDayForDate(moment().endOf('day').subtract(59, 'second')) + 1;
  }
  return mins;
}

function getMinutesInDayForDate(date: moment.Moment): number {
  return ((date.isoWeekday() - 1) * 24 * 60) +
         (date.hour() * 60) +
          date.minute();
}

export function getMinutesInDay(day_index: number, date?: moment.Moment): number {
  return ((day_index - 1) * 24 * 60) +
    (date ? ((date.hour() * 60) +
    date.minute()) : 0);
}

export function getDifferenceFromNow(time: moment.Moment): number {
  return moment().diff(time, 'seconds');
}

// gradient will be derived from this interval
const tempInterval = [15, 25];
const tempGradient = new ColorGradient(["#00f", "#f23700"]);

export function getTemperatureColor(temp: number): string {
  const percent = (temp - tempInterval[0]) / (tempInterval[1] - tempInterval[0]) * 100;
  return tempGradient.getHexColorAtPercent(percent);
}
