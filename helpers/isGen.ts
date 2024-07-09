import dayjs from "dayjs"
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore' // ES 2015
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter' // ES 2015
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export function isWhat(attendee: { birthday: string }): string {
  if (isY(attendee)) {
    return 'Generation Y';
  }

  if (isX(attendee)) {
    return 'Generation X';
  }

  if (isBoomer(attendee)) {
    return 'Generation Boomer';
  }

  if (isSilent(attendee)) {
    return 'Generation Silent';
  }

  if (isZ(attendee)) {
    return 'Generation Z';
  }

  return 'Invalid Birthday';
}

export function isY(attendee: { birthday: string }): boolean {
  if (!attendee.birthday) return false
  return (
    dayjs(attendee.birthday).isSameOrAfter(dayjs('1981-01-01')) &&
    dayjs(attendee.birthday).isSameOrBefore(dayjs('1997-12-31'))
  )
}

export function isX(attendee: { birthday: string }): boolean {
  if (!attendee.birthday) return false
  return (
    dayjs(attendee.birthday).isSameOrAfter(dayjs('1965-01-01')) &&
    dayjs(attendee.birthday).isSameOrBefore(dayjs('1980-12-31'))
  )
}

export function isBoomer(attendee: { birthday: string }): boolean {
  if (!attendee.birthday) return false
  return (
    dayjs(attendee.birthday).isSameOrAfter(dayjs('1946-01-01')) &&
    dayjs(attendee.birthday).isSameOrBefore(dayjs('1964-12-31'))
  )
}

export function isSilent(attendee: { birthday: string }): boolean {
  if (!attendee.birthday) return false
  return (
    dayjs(attendee.birthday).isSameOrAfter(dayjs('1902-01-01')) &&
    dayjs(attendee.birthday).isSameOrBefore(dayjs('1945-12-31'))
  )
}

export function isZ(attendee: { birthday: string }): boolean {
  if (!attendee.birthday) return false
  return (
    dayjs(attendee.birthday).isSameOrAfter(dayjs('1998-01-01')) &&
    dayjs(attendee.birthday).isSameOrBefore(dayjs('2019-12-31'))
  )
}
