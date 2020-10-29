import React, {useCallback} from 'react'
import PropTypes from 'prop-types'
import {Pane, Heading} from 'evergreen-ui'
import {Bar} from 'react-chartjs-2'

import {colors} from '../../lib/colors'

const BalCreationChart = ({height, data}) => {
  const options = {
    maintainAspectRatio: false,
    tooltips: {
      mode: 'index'
    },
    scales: {
      xAxes: [{
        type: 'time',
        time: {
          unit: 'month'
        },
        stacked: true,
        gridLines: {
          offsetGridLines: true
        },
        offset: true
      }],
      yAxes: [{
        stacked: true
      }]
    }
  }

  const sumByStatus = useCallback(status => {
    const sums = []

    const filterByStatus = data.map(item => item.filter(bal => {
      return status === 'published' ? bal.published : bal.status === status
    }).length)

    if (filterByStatus.length > 0) {
      const addedBal = filterByStatus.reduce((totalValue, currentValue) => {
        sums.push(totalValue)
        const sum = totalValue + currentValue
        return sum
      })
      sums.push(addedBal)
    }

    return sums
  }, [data])

  const datasets = [
    {
      label: 'Publiées',
      data: sumByStatus('published'),
      backgroundColor: colors.green
    },
    {
      label: 'Prêtes à être publiées',
      data: sumByStatus('ready-to-publish'),
      backgroundColor: colors.blue
    },
    {
      label: 'Brouillons',
      data: sumByStatus('draft'),
      backgroundColor: colors.neutral
    }
  ]

  const dataChart = {
    labels: data.map(data => data[0].day),
    datasets
  }

  return (
    <div className='chart-container'>
      <Pane padding={8} elevation={1} border='default'>
        <Heading marginBottom={16} textAlign='center'>
          Cumul de la création des BAL
        </Heading>
        <div className='chart'>
          <Bar height={height} data={dataChart} options={options} />
        </div>
      </Pane>
      <style jsx>{`
        .chart-container {
          width: 50vw;
        }

        .chart{
          position: relative;
        }

        @media screen and (max-width: 960px) {
          .chart-container {
            width: 100%;
          }
        }
        `}</style>
    </div>

  )
}

BalCreationChart.propTypes = {
  height: PropTypes.number,
  data: PropTypes.array.isRequired
}

BalCreationChart.defaultProps = {
  height: null
}

export default BalCreationChart
