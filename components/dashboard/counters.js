import React, {useCallback} from 'react'
import PropTypes from 'prop-types'
import {Pane, Heading} from 'evergreen-ui'
import {flattenDeep, uniq} from 'lodash'

import {colors} from '../../lib/colors'

import Counter from './counter'

const Counters = ({basesLocales}) => {
  const sortedCommuneList = useCallback(() => {
    return uniq(flattenDeep(basesLocales.filter(({communes}) => communes.length > 0).map(({communes}) => communes)))
  }, [basesLocales])

  const sortedBalByStatus = {
    published: basesLocales.filter(({published}) => published),
    readyToPublish: basesLocales.filter(({status}) => status === 'ready-to-publish'),
    draft: basesLocales.filter(({status}) => status === 'draft')
  }

  const mainData = [
    {label: 'BAL', values: basesLocales},
    {label: sortedCommuneList().length > 1 ? 'Communes' : 'Commune', values: sortedCommuneList()}
  ]

  const balByStatus = [
    {label: sortedBalByStatus.published.length > 1 ? 'Publiées' : 'Publiée', values: sortedBalByStatus.published, color: colors.green},
    {label: sortedBalByStatus.readyToPublish.length > 1 ? 'Prêtes à être publiées' : 'Prête à être publiée', values: sortedBalByStatus.readyToPublish, color: colors.blue},
    {label: sortedBalByStatus.draft.length > 1 ? 'Brouillons' : 'Brouillon', values: sortedBalByStatus.draft, color: colors.neutral}
  ]

  return (
    <>
      <div className='counters-container'>
        <div className='main-data-counters-container'>
          <Pane elevation={1} border='default'>
            <Heading marginY={10} textAlign='center' fontWeight='bold'>
              Chiffres clés
            </Heading>

            <div className='main-data-counters'>
              {mainData.map(({label, values, color}) => (
                <Counter key={label} label={label} value={values.length} color={color} size={30} />
              ))}
            </div>
          </Pane>
        </div>

        <div className='bal-counters-container'>
          <Pane elevation={1} border='default'>
            <Heading marginY={10} textAlign='center' fontWeight='bold'>
              BAL
            </Heading>
            <div className='bal-counters'>
              {balByStatus.map(({label, values, color}) => (
                <Counter key={label} label={label} value={values.length} color={color} size={30} />
              ))}
            </div>
          </Pane>
        </div>
      </div>

      <style jsx> {`
        .counters-container, .main-data-counters, .bal-counters {
          display: flex;
        }

        .counters-container {
          align-items: center;
        }

        .counters-container {
          justify-content: space-around;
          margin-bottom: 10px;
        }

        .main-data-counters, .bal-counters {
          justify-content: space-evenly;
          align-items: baseline;
        }

        .bal-counters-container, .main-data-counters-container{
          width: 30%;
        }

        .counters-counters-container, .map-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        .counters-counters-container {
          margin-bottom: 15px;
        }

        .map-container {
          margin-left: 10px;
        }

        @media only screen and (max-width: 960px) {
          .counters-container {
            flex-direction: column;
          }

          .main-data-counters, .bal-counters, .bal-counters-container, .main-data-counters-container {
            width: 100%;
          }

          .main-data-counters, .bal-counters {
            justify-content: space-evenly;
          }

          .main-data-counters-container, .map-container {
            margin-bottom: 10px;
          }

          .map-container {
            display: flex;
            flex-direction: column;
          }

          .map-container {
            margin: 10px 0;
          }
        }
      `}
      </style>
    </>
  )
}

Counters.propTypes = {
  basesLocales: PropTypes.array.isRequired
}

export default Counters
