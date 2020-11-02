import {groupBy} from 'lodash'

const getUnit = dayRange => {
  if (dayRange >= 0 && dayRange <= 31) {
    return 'day'
  }

  if (dayRange > 31 && dayRange < 180) {
    return 'week'
  }

  return 'month'
}

export const historyCharts = (basesLocales, dayRange) => {
  const unit = getUnit(dayRange)
  const data = Object.values(groupBy(basesLocales, unit))

  return {unit, data}
}
