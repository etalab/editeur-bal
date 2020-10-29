import React from 'react'
import PropTypes from 'prop-types'
import {TextInputField} from 'evergreen-ui'

const SelectDate = ({min, max, start, end, setStartDate, setEndDate}) => {
  return (
    <div className='date-container'>
      <TextInputField
        id='start'
        min={min}
        max={end}
        value={start}
        marginX={8}
        label='Date de début'
        type='date'
        onChange={event => setStartDate(event.target.value)}
      />
      <TextInputField
        id='end'
        min={start}
        max={max}
        value={end}
        label='Date de fin'
        type='date'
        onChange={event => setEndDate(event.target.value)}
      />
      <style jsx>{`
        .date-container {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        @media screen and (max-width: 360px) {
          .date-container {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}

SelectDate.propTypes = {
  min: PropTypes.string.isRequired,
  max: PropTypes.string.isRequired,
  start: PropTypes.string.isRequired,
  end: PropTypes.string.isRequired,
  setStartDate: PropTypes.func.isRequired,
  setEndDate: PropTypes.func.isRequired
}

export default SelectDate
