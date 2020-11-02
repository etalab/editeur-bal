export function formatDateYYYYMMDD(iso = null) {
  const date = iso ? new Date(iso) : new Date()
  return date.toISOString().split('T')[0]
}

export function getWeek(dateToFormat) {
  const formatedDate = new Date(dateToFormat)
  formatedDate.setHours(0, 0, 0, 0)
  formatedDate.setDate((formatedDate.getDate() + 3) - ((formatedDate.getDay() + 6) % 7))
  const week = new Date(formatedDate.getFullYear(), 0, 4)
  return 1 + Math.round((((formatedDate.getTime() - week.getTime()) / 86400000) - 3 + ((week.getDay() + 6) % 7)) / 7)
}
