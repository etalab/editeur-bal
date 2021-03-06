import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import {Strong, Pane, SelectField, Heading, Icon, Small, TrashIcon, MapMarkerIcon, IconButton, Button, AddIcon} from 'evergreen-ui'

import MarkersContext from '../../contexts/markers'

import {positionsTypesList} from '../../lib/positions-types-list'

function PositionEditor({isToponyme}) {
  const {markers, addMarker, updateMarker, removeMarker} = useContext(MarkersContext)

  const handleAddMarker = () => {
    addMarker({type: isToponyme ? 'segment' : 'entrée'})
  }

  const handleChange = (e, marker) => {
    updateMarker(marker._id, {...marker, type: e.target.value})
  }

  const deletePosition = (e, marker) => {
    e.preventDefault()
    removeMarker(marker._id)
  }

  return (
    <>
      <Pane display='grid' gridTemplateColumns='2fr .5fr 1fr 1fr .5fr'>
        <Strong fontWeight={400}>Type</Strong>
        <div />
        <Strong fontWeight={400}>Latitude</Strong>
        <Strong fontWeight={400}>Longitude</Strong>
        <div />

        {markers.map(marker => (
          <>
            <SelectField
              defaultValue={marker.type}
              marginBottom={8}
              height={32}
              onChange={e => handleChange(e, marker)}
            >
              {positionsTypesList.map(positionType => (
                <option key={positionType.value} value={positionType.value} selected={marker.type === positionType.value}>{positionType.name}</option>
              ))}
            </SelectField>
            <Icon icon={MapMarkerIcon} size={22} margin='auto' />
            <Heading size={100} marginY='auto'>
              <Small>{marker.latitude && marker.latitude.toFixed(6)}</Small>
            </Heading>
            <Heading size={100} marginY='auto'>
              <Small>{marker.longitude && marker.longitude.toFixed(6)}</Small>
            </Heading>
            <IconButton
              disabled={markers.length === 1}
              appearance='default'
              iconSize={15}
              icon={TrashIcon}
              intent='danger'
              onClick={e => deletePosition(e, marker)}
            />
          </>
        ))}

      </Pane>
      <Button
        type='button'
        iconBefore={AddIcon}
        appearance='primary'
        intent='success'
        width='100%'
        marginBottom={16}
        display='flex'
        justifyContent='center'
        onClick={handleAddMarker}
      >
        {`Ajouter une position au ${isToponyme ? 'toponyme' : 'numéro'}`}
      </Button>
    </>
  )
}

PositionEditor.propTypes = {
  isToponyme: PropTypes.bool
}

PositionEditor.defaultProps = {
  isToponyme: false
}

export default PositionEditor
