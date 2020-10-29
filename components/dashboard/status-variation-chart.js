import React, {useCallback} from 'react'
import PropTypes from 'prop-types'
import {Pane, Heading} from 'evergreen-ui'
import {Line} from 'react-chartjs-2'

import {colors} from '../../lib/colors'
import {formatDateYYYYMMDD} from '../../lib/date'

const StatusVariationChart = ({height, unit, data}) => {
  const options = {
    maintainAspectRatio: false,
    tooltips: {
      mode: 'index'
    },
    hover: {
      mode: 'nearest',
      intersect: true
    },
    scales: {
      xAxes: [{
        type: 'time',
        time: {
          unit
        }
      }],
      yAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Nombre de BAL'
        }
      }]
    }
  }

  const filterByStatus = useCallback(statusToSearch => {
    return data.map(item => item.filter(({status}) => status === statusToSearch).length)
  }, [data])

  const datasets = [
    {
      label: 'Publiées',
      data: data.map(item => item.filter(({published}) => published).length),
      borderColor: colors.green,
      backgroundColor: colors.green,
      fill: false
    },
    {
      label: 'Prêtes à être publiées',
      data: filterByStatus('ready-to-publish'),
      borderColor: colors.blue,
      backgroundColor: colors.blue,
      fill: false
    },
    {
      label: 'Brouillons',
      data: filterByStatus('draft'),
      borderColor: colors.neutral,
      backgroundColor: colors.neutral,
      fill: false
    }
  ]

  const dataChart = {
    labels: data.map(data => formatDateYYYYMMDD(data[0]._created)),
    datasets
  }

  return (
    <div className='chart-container'>
      <Pane padding={8} elevation={1} border='default'>
        <Heading marginBottom={16} textAlign='center'>
          Variation quotidienne de la publication des BAL
        </Heading>
        <div className='chart'>
          <Line height={height} data={dataChart} options={options} />
        </div>
      </Pane>
      <style jsx>{`
        .chart-container {
          margin: 0 auto;
          width: 95vw;
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

StatusVariationChart.propTypes = {
  height: PropTypes.number,
  unit: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired
}

StatusVariationChart.defaultProps = {
  height: null
}

export default StatusVariationChart
