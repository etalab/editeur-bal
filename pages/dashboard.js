import React, {useState, useMemo} from 'react'
import PropTypes from 'prop-types'
import {Heading, Pane} from 'evergreen-ui'

import {listBasesLocales} from '../lib/bal-api'
import {historyCharts} from '../lib/history-charts'
import {formatDateYYYYMMDD, getWeek} from '../lib/date'
import {expandWithPublished} from '../helpers/bases-locales'

import SelectDate from '../components/dashboard/select-date'
import Map from '../components/dashboard/map'
import Counters from '../components/dashboard/counters'
import StatusVariationChart from '../components/dashboard/status-variation-chart'
import BalCreationChart from '../components/dashboard/bal-creation-chart'

const MIN_DATE = '2019-04-11' // Date de la première BAL
const MAX_DATE = formatDateYYYYMMDD()

const Index = ({basesLocales}) => {
  const [startDate, setStartDate] = useState(MIN_DATE)
  const [endDate, setEndDate] = useState(MAX_DATE)

  const startDateTime = new Date(startDate)
  const endDateTime = new Date(endDate)
  const dayRange = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 3600 * 24)

  const filteredBasesLocales = useMemo(() => {
    return basesLocales.filter(({_created, day}) => {
      const createdDateTime = new Date(_created)

      if (dayRange > 0) {
        return createdDateTime >= startDateTime && createdDateTime <= endDateTime
      }

      return day === startDate
    })
  }, [basesLocales, dayRange, endDateTime, startDate, startDateTime])

  const history = useMemo(() => {
    return historyCharts(filteredBasesLocales, dayRange)
  }, [filteredBasesLocales, dayRange])

  return (
    <div className='index-container'>
      <Heading marginY={8} textAlign='center'>
        Tableau de bord des Bases adresse locales
      </Heading>

      <SelectDate
        min={MIN_DATE}
        max={MAX_DATE}
        start={startDate}
        end={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />

      <Counters
        basesLocales={filteredBasesLocales}
        startDate={new Date(startDate).getTime()}
        endDate={new Date(endDate).getTime()}
      />

      <StatusVariationChart height={300} {...history} />

      <div className='charts-map-container'>
        <div className='chart-bal-creation-container'>
          <BalCreationChart height={300} {...history} />
        </div>
        <Pane width='100%' elevation={1} border='default'>
          <Map />
        </Pane>
      </div>

      <style jsx>{`
        .index-container {
          padding: 0 16px;
          overflow-y: auto;
        }

        .chart-bal-creation-container {
          margin-right: 10px;
        }

        .charts-map-container {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
        }

        @media screen and (max-width: 960px) {
          .index-container {
            padding: 0;
          }

          .chart-bal-container {
            margin: 0;
          }

          .chart-bal-container, .charts-map-container {
            margin-bottom: 10px;
          }

          .charts-map-container {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}

Index.getInitialProps = async () => {
  const basesLocales = await listBasesLocales()
  const basesLocalesWithoutTest = basesLocales.filter((({isTest}) => !isTest))
  await expandWithPublished(basesLocalesWithoutTest)

  const datedBaseLocales = basesLocalesWithoutTest.map(baseLocale => {
    const {_created} = baseLocale
    const day = formatDateYYYYMMDD(_created)
    const [year, monthNumber] = day.split('-')
    const week = `${year}-${getWeek(formatDateYYYYMMDD(_created))}`
    const month = `${year}-${monthNumber}`

    return {...baseLocale, month, week, day}
  })

  return {
    basesLocales: datedBaseLocales
  }
}

Index.propTypes = {
  basesLocales: PropTypes.array.isRequired
}

export default Index
