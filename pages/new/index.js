import React, {useState, useContext, useCallback} from 'react'
import PropTypes from 'prop-types'
import {Pane, Heading, TabNavigation, Tab, Paragraph, BackButton, Button} from 'evergreen-ui'

import {getCommune} from '../../lib/geo-api'

import useHelp from '../../hooks/help'

import HelpContext from '../../contexts/help'

import CreateForm from './create-form'
import UploadForm from './upload-form'

function Index({defaultCommune, isDemo}) {
  const [index, setIndex] = useState(0)
  const {showHelp, setShowHelp, setSelectedIndex} = useContext(HelpContext)

  useHelp(0)

  const handleHelp = useCallback(() => {
    setSelectedIndex(0)
    setShowHelp(!showHelp)
  }, [setSelectedIndex, setShowHelp, showHelp])

  return (
    <Pane backgroundColor='white'>
      <Pane padding={16}>
        <Heading size={600} marginBottom={8}>Nouvelle Base Adresse Locale</Heading>
        <Paragraph>
          Sélectionnez une commune pour laquelle vous souhaitez créer ou modifier une Base Adresse Locale.
        </Paragraph>
      </Pane>

      <TabNavigation display='flex' marginLeft={16}>
        {['Créer', 'Importer un fichier CSV'].map((tab, idx) => (
          <Tab key={tab} id={tab} isSelected={index === idx} onSelect={() => setIndex(idx)}>
            {tab}
          </Tab>
        ))}
      </TabNavigation>

      <Pane flex={1} overflowY='scroll'>
        {index === 0 ? (
          <CreateForm defaultCommune={defaultCommune} isDemo={isDemo} />
        ) : (
          <UploadForm isDemo={isDemo} />
        )}

        <Pane display='flex' justifyContent='space-between' alignItems='center' flex={1} margin={16} marginTop={32}>
          <BackButton is='a' href='/'>Retour</BackButton>
          <Button height={32} iconAfter='help' onClick={handleHelp}>Besoin d’aide</Button>
        </Pane>
      </Pane>
    </Pane>
  )
}

Index.getInitialProps = async ({query}) => {
  let defaultCommune
  if (query.commune) {
    defaultCommune = await getCommune(query.commune, {
      fields: 'departement'
    })
  }

  return {
    defaultCommune,
    isDemo: Boolean(query.demo),
    layout: 'fullscreen'
  }
}

Index.propTypes = {
  defaultCommune: PropTypes.string,
  isDemo: PropTypes.bool
}

Index.defaultProps = {
  defaultCommune: null,
  isDemo: false
}

export default Index
