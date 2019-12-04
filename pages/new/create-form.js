import React, {useState, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import {Pane, TextInputField, Checkbox, Button, Alert} from 'evergreen-ui'

import {storeBalAccess} from '../../lib/tokens'
import {createBaseLocale, addCommune, populateCommune} from '../../lib/bal-api'

import useFocus from '../../hooks/focus'
import {useInput, useCheckboxInput} from '../../hooks/input'

import {CommuneSearchField} from '../../components/commune-search'

function CreateForm({defaultCommune, isDemo}) {
  const [isLoading, setIsLoading] = useState(false)
  const [nom, onNomChange] = useInput(
    defaultCommune ? `Adresses de ${defaultCommune.nom}` : ''
  )
  const [email, onEmailChange] = useInput('')
  const [populate, onPopulateChange] = useCheckboxInput(true)
  const [commune, setCommune] = useState(defaultCommune ? defaultCommune.code : null)
  const [error, setError] = useState()
  const focusRef = useFocus()

  const onSelect = useCallback(commune => {
    setCommune(commune.code)
  }, [])
  const onSubmit = useCallback(async e => {
    e.preventDefault()

    setIsLoading(true)
    setError(false)

    try {
      const bal = await createBaseLocale({
        nom,
        emails: [
          email
        ]
      })

      storeBalAccess(bal._id, bal.token)

      await addCommune(bal._id, commune, bal.token)

      if (populate) {
        await populateCommune(bal._id, commune, bal.token)
      }

      Router.push(
        `/bal/commune?balId=${bal._id}&codeCommune=${commune}`,
        `/bal/${bal._id}/communes/${commune}`
      )
    } catch (error) {
      setError(error)
    }
  }, [nom, email, commune, populate, setError])

  useEffect(() => {
    if (error) {
      setIsLoading(false)
    }
  }, [error])

  return (
    <Pane is='form' margin={16} padding={16} overflowY='scroll' background='tint2' onSubmit={onSubmit}>
      {!isDemo && (
        <>
          <TextInputField
            required
            innerRef={focusRef}
            autoComplete='new-password' // Hack to bypass chrome autocomplete
            name='nom'
            id='nom'
            value={nom}
            maxWidth={600}
            disabled={isLoading}
            label='Nom de la Base Adresse Locale'
            placeholder='Nom'
            onChange={onNomChange}
          />

          <TextInputField
            required
            type='email'
            name='email'
            id='email'
            value={email}
            maxWidth={400}
            disabled={isLoading}
            label='Votre adresse email'
            placeholder='nom@example.com'
            onChange={onEmailChange}
          />
        </>
      )}

      <CommuneSearchField
        required
        id='commune'
        defaultSelectedItem={defaultCommune}
        label='Commune'
        maxWidth={500}
        disabled={isLoading}
        hint='Vous pourrez ajouter plusieurs communes à la Base Adresse Locale plus tard.'
        onSelect={onSelect}
      />

      <Checkbox
        label='Importer les voies et numéros depuis la BAN'
        checked={populate}
        disabled={isLoading}
        onChange={onPopulateChange}
      />

      {error && (
        <Alert
          intent='danger'
          marginTop={8}
          title={error.message}
        />)}

      <Button height={40} marginTop={8} type='submit' appearance='primary' isLoading={isLoading}>
        {isLoading ? 'En cours de création…' : 'Créer la Base Adresse Locale'}
      </Button>
    </Pane>
  )
}

CreateForm.propTypes = {
  defaultCommune: PropTypes.object,
  isDemo: PropTypes.bool
}

CreateForm.defaultProps = {
  defaultCommune: null,
  isDemo: false
}

export default CreateForm
