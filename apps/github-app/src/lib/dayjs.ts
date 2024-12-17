import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isBetween from 'dayjs/plugin/isBetween'
import customParseFormat from 'dayjs/plugin/customParseFormat'

// Extend dayjs with plugins
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
dayjs.extend(isBetween)
dayjs.extend(customParseFormat)

// Set default timezone to UTC
dayjs.tz.setDefault('UTC')

export { dayjs }

// Helper functions for common date operations
export const dateHelpers = {
  startOfDay: (date: Date | string) => dayjs(date).utc().startOf('day'),
  endOfDay: (date: Date | string) => dayjs(date).utc().endOf('day'),
  formatISO: (date: Date | string) => dayjs(date).utc().toISOString(),
  subtractDays: (date: Date | string, days: number) => dayjs(date).utc().subtract(days, 'day'),
  addDays: (date: Date | string, days: number) => dayjs(date).utc().add(days, 'day'),
  isBetween: (date: Date | string, start: Date | string, end: Date | string) =>
    dayjs(date).utc().isBetween(start, end, 'day', '[]'),
  toDate: (date: Date | string) => dayjs(date).utc().toDate()
}
