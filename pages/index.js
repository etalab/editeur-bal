import React from 'react'
import dynamic from 'next/dynamic'
import Router from 'next/router'
import {Pane, Heading, Paragraph, Button, Spinner} from 'evergreen-ui'

const UserBasesLocales = dynamic(() => import('../components/user-bases-locales'), {
  ssr: false,
  loading: () => (
    <Pane display='flex' alignItems='center' justifyContent='center' height={400}>
      <Spinner />
    </Pane>
  )
})

function Index() {
  const onCreate = () => {
    Router.push('/new')
  }

  const onCreateDemo = () => {
    Router.push('/new?demo=true')
  }

  return (
    <>
      <Pane borderBottom padding={16} backgroundColor='white'>
        <Heading size={600} marginBottom={8}>Bienvenue sur l’Éditeur de Base Adresse Locale</Heading>
        <Paragraph>
          Créez une Base Adresse Locale ou sélectionnez une de vos Bases Adresse Locales afin de poursuivre son édition.
        </Paragraph>
      </Pane>

      <Pane display='flex' flexDirection='column'>
        <Pane flex={1} overflowY='scroll'>
          <UserBasesLocales />
        </Pane>

        <Pane
          display='flex'
          alignItems='center'
          justifyContent='center'
          padding={16}
        >
          <Button
            appearance='primary'
            height={40}
            iconBefore='plus'
            marginTop={10}
            marginRight={15}
            onClick={onCreate}
          >
            Créer Base Adresse Locale
          </Button>
          <Button
            height={40}
            iconBefore='plus'
            marginTop={10}
            marginLeft={15}
            onClick={onCreateDemo}
          >
            Créer une Base Locale de test
          </Button>
        </Pane>
      </Pane>
    </>
  )
}

Index.getInitialProps = async () => {
  return {
    layout: 'fullscreen'
  }
}

export default Index
