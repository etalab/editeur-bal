import React, {useState, useEffect} from 'react'
import {Pane, Spinner} from 'evergreen-ui'
import {map} from 'lodash'

import {expandWithPublished} from '../helpers/bases-locales'

import {getBalAccess} from '../lib/tokens'
import {getBaseLocale} from '../lib/bal-api'

import BasesLocalesList from './bases-locales-list'

function UserBasesLocales() {
  const [basesLocales, setBasesLocales] = useState(null)
  const [balAccess, setBalAccess] = useState(getBalAccess())

  useEffect(() => {
    const getUserBals = async () => {
      const basesLocales = await Promise.all(
        map(balAccess, async (token, id) => {
          try {
            return await getBaseLocale(id, token)
          } catch (error) {
            console.log(`Impossible de récupérer la bal ${id}`)
          }
        }))

      const findedBasesLocales = basesLocales.filter(bal => Boolean(bal))

      await expandWithPublished(findedBasesLocales)

      setBasesLocales(findedBasesLocales)
    }

    if (balAccess) {
      getUserBals()
    }
  }, [balAccess])

  if (!basesLocales) {
    return (
      <Pane display='flex' alignItems='center' justifyContent='center' flex={1}>
        <Spinner />
      </Pane>
    )
  }

  if (basesLocales.length === 0) {
    return null
  }

  return (
    <Pane height='calc(100% - 52px)' overflow='none'>
      <BasesLocalesList basesLocales={basesLocales} updateBasesLocales={setBalAccess} />
    </Pane>
  )
}

export default UserBasesLocales
