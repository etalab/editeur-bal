import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {Pane, Heading, TabNavigation, Tab, Paragraph, BackButton} from 'evergreen-ui'

import {getCommune} from '../../lib/geo-api'

import Footer from '../../components/footer'

import CreateForm from './create-form'
import UploadForm from './upload-form'
import TestForm from './test-form'

function Index({defaultCommune, isTest}) {
  const [index, setIndex] = useState(0)

  return (
    <Pane backgroundColor='white'>
      <Pane padding={16}>
        <Heading size={600} marginBottom={8}>Nouvelle Base Adresse Locale</Heading>
        <Paragraph>
          Sélectionnez une commune pour laquelle vous souhaitez créer ou modifier une Base Adresse Locale.
        </Paragraph>
      </Pane>

      {isTest ? (
        <TestForm />
      ) :
        (<>
          <TabNavigation display='flex' marginLeft={16}>
            {['Créer', 'Importer un fichier CSV'].map((tab, idx) => (
              <Tab key={tab} id={tab} isSelected={index === idx} onSelect={() => setIndex(idx)}>
                {tab}
              </Tab>
            ))}
          </TabNavigation>

          <Pane flex={1} overflowY='scroll'>
            {index === 0 ? (
              <CreateForm defaultCommune={defaultCommune} isTest={isTest} />
            ) : (
              <UploadForm />
            )}
          </Pane>
        </>)}

      <Pane margin={16} marginTop={32}>
        <BackButton is='a' href='/'>Retour</BackButton>
      </Pane>
      <Footer />
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
    isTest: query.test === '1',
    layout: 'fullscreen'
  }
}

Index.propTypes = {
  defaultCommune: PropTypes.string,
  isTest: PropTypes.bool
}

Index.defaultProps = {
  defaultCommune: null,
  isTest: false
}

export default Index
