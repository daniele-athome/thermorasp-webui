
import { getHours, getMinutes, getDay, endOfDay } from 'date-fns'

export function getCurrentMinute(): number {
  return getMinuteInDay(new Date());
}

export function getTodayLastMinute(): number {
  return getMinuteInDay(endOfDay(new Date()));
}

function getMinuteInDay(date: Date): number {
  return ((getDay(date) - 1) * 24 * 60) +
         (getHours(date) * 60) +
          getMinutes(date);
}
