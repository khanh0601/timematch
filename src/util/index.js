import zone from 'moment-timezone';
import '@stripe/stripe-js';
export function getTimezone() {
  return zone.tz.guess();
}
