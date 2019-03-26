import React, {useMemo, useContext} from 'react'
import {Marker} from 'react-map-gl'
import {Text} from 'evergreen-ui'
import {css} from 'glamor' // eslint-disable-line import/no-extraneous-dependencies

import MarkerContext from '../../contexts/marker'

function NumeroMarker({numero, showNumero}) {
  const {marker} = useContext(MarkerContext)

  const position = numero.positions[0]

  const markerStyle = useMemo(() => css({
    borderRadius: 20,
    marginTop: -10,
    marginLeft: -10,
    color: 'transparent',
    whiteSpace: 'nowrap',
    background: showNumero ? 'rgba(0, 0, 0, 0.7)' : null,

    '&:before': {
      content: ' ',
      backgroundColor: '#1070ca',
      border: '1px solid white',
      display: 'inline-block',
      width: 8,
      height: 8,
      borderRadius: '50%',
      marginLeft: 6
    },

    '& > span': {
      display: showNumero ? 'inline-block' : 'none'
    },

    '&:hover': showNumero ? null : {
      background: 'rgba(0, 0, 0, 0.7)',

      '& > span': {
        display: 'inline-block'
      }
    }
  }), [showNumero])

  if (!position) {
    return null
  }

  if (marker && marker.id === numero._id) {
    return null
  }

  const {coordinates} = position.point

  return (
    <Marker
      longitude={coordinates[0]}
      latitude={coordinates[1]}
      captureDrag={false}
      className={markerStyle}
    >
      <Text color='white' paddingLeft={8} paddingRight={10}>
        {numero.numeroComplet}
      </Text>
    </Marker>
  )
}

export default NumeroMarker
