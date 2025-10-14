import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const TIMEZONE = 'Asia/Ho_Chi_Minh';

/**
 * Get current date string in Asia/Ho_Chi_Minh timezone
 */
export function getCurrentDateString(): string {
  const zonedDate = toZonedTime(new Date(), TIMEZONE);
  return format(zonedDate, 'yyyy-MM-dd');
}

/**
 * Get current timestamp string
 */
export function getCurrentTimestamp(): string {
  const zonedDate = toZonedTime(new Date(), TIMEZONE);
  return format(zonedDate, 'yyyy-MM-dd HH:mm:ss.SSSSSS');
}

/**
 * Format date to string
 */
export function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}
