import React, {useState} from 'react'

import {Checkbox} from 'evergreen-ui'

const MultipleEdition = ({id, code, positions, isSelected}) => {
  const [isChecked, setIsChecked] = useState(false)

  const handleChecked = event => {
    const target = event.target.checked
    setIsChecked(target)
  }

  if (isChecked) {
    isSelected(isChecked)
  }

  return (
    <>
      <Checkbox
        checked={isChecked}
        onChange={event => handleChecked(event)}
      />
    </>
  )
}

export default MultipleEdition
