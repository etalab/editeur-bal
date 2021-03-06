import React, {useCallback} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import {Pane, Heading, Paragraph, Button} from 'evergreen-ui'

import {expandWithPublished} from '../helpers/bases-locales'

import {listBasesLocales} from '../lib/bal-api'
import {sortBalByUpdate} from '../lib/sort-bal'

import PublicBasesLocalesList from '../components/bases-locales-list/public-bases-locales-list'

function All({basesLocales}) {
  const onCreate = useCallback(() => {
    Router.push('/new')
  }, [])

  return (
    <>
      <Pane padding={16} backgroundColor='white'>
        <Heading size={600} marginBottom={8}>Rechercher une Base Adresse Locale</Heading>
        <Paragraph>
          Sélectionnez une Base Adresse Locale que vous souhaitez visualiser, créer ou modifier.
        </Paragraph>
      </Pane>

      <Pane flex={1} overflowY='scroll'>
        <PublicBasesLocalesList basesLocales={basesLocales} sortBal={sortBalByUpdate} />
      </Pane>

      <Pane borderTop marginTop='auto' padding={16}>
        <Paragraph size={300} color='muted'>
          Vous pouvez également créer une nouvelle Base Adresse Locale.
        </Paragraph>
        <Button marginTop={10} appearance='primary' onClick={onCreate}>
          Créer une nouvelle Base Adresse Locale
        </Button>
      </Pane>
    </>
  )
}

All.getInitialProps = async () => {
  const basesLocales = await listBasesLocales()
  await expandWithPublished(basesLocales)

  return {
    basesLocales,
    layout: 'fullscreen'
  }
}

All.propTypes = {
  basesLocales: PropTypes.array.isRequired
}

export default All
