
import { getHours, getMinutes, endOfDay, getISODay } from 'date-fns';
import { ColorGradient } from './color-gradient';

export function getCurrentMinute(): number {
  return getMinuteInDay(new Date());
}

export function getTodayLastMinute(): number {
  return getMinuteInDay(endOfDay(new Date()));
}

function getMinuteInDay(date: Date): number {
  return ((getISODay(date) - 1) * 24 * 60) +
         (getHours(date) * 60) +
          getMinutes(date);
}

// gradient will be derived from this interval
const tempInterval = [15, 25];
const tempGradient = new ColorGradient(["#00f", "#f23700"]);

export function getTemperatureColor(temp: number): string {
  const percent = (temp - tempInterval[0]) / (tempInterval[1] - tempInterval[0]) * 100;
  return tempGradient.getHexColorAtPercent(percent);
}
