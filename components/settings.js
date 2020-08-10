import React, {useState, useContext, useEffect, useCallback} from 'react'
import PropTypes from 'prop-types'
import {SideSheet, Pane, Heading, TextInputField, TextInput, IconButton, Button, Alert, Spinner, Label, toaster} from 'evergreen-ui'
import {isEqual} from 'lodash'

import {updateBaseLocale} from '../lib/bal-api'

import TokenContext from '../contexts/token'

import {useInput} from '../hooks/input'
import SettingsContext from '../contexts/settings'
import {validateEmail} from '../lib/utils/email'
import BalDataContext from '../contexts/bal-data'

const mailHasChanged = (listA, listB) => {
  return !isEqual([...listA].sort(), [...listB].sort())
}

const Settings = React.memo(({nomBaseLocale}) => {
  const {showSettings, setShowSettings} = useContext(SettingsContext)
  const {token, emails, reloadEmails} = useContext(TokenContext)
  const {baseLocale, reloadBaseLocale} = useContext(BalDataContext)

  const [isLoading, setIsLoading] = useState(false)
  const [balEmails, setBalEmails] = useState([])
  const [nomInput, onNomInputChange] = useInput(nomBaseLocale)
  const [email, onEmailChange, resetEmail] = useInput()
  const [hasChanges, setHasChanges] = useState(false)
  const [error, setError] = useState()

  useEffect(() => {
    setBalEmails(emails || [])
  }, [emails])

  const onRemoveEmail = useCallback(email => {
    setBalEmails(emails => emails.filter(e => e !== email))
  }, [])

  const onAddEmail = useCallback(e => {
    e.preventDefault()

    if (validateEmail(email)) {
      setBalEmails(emails => [...emails, email])
      resetEmail()
    } else {
      setError('Cet email n’est pas valide')
    }
  }, [email, resetEmail])

  const onSubmit = useCallback(async e => {
    e.preventDefault()

    setError(null)
    setIsLoading(true)

    try {
      await updateBaseLocale(baseLocale._id, {
        nom: nomInput.trim(),
        emails: balEmails
      }, token)

      await reloadEmails()
      await reloadBaseLocale()

      toaster.success('La Base Adresse Locale a été modifiée avec succès !')
    } catch (error) {
      setError(error.message)
    }

    setIsLoading(false)
  }, [baseLocale._id, nomInput, balEmails, token, reloadEmails, reloadBaseLocale])

  useEffect(() => {
    if (error) {
      setError(null)
    }
  }, [email]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (nomInput !== baseLocale.nom || mailHasChanged(emails || [], balEmails)) {
      setHasChanges(true)
    } else {
      setHasChanges(false)
    }
  }, [nomInput, balEmails, emails, baseLocale.nom])

  return (
    <SideSheet
      isShown={showSettings}
      onCloseComplete={() => setShowSettings(false)}
    >
      <Pane
        flexShrink={0}
        elevation={0}
        backgroundColor='white'
        padding={16}
        display='flex'
        alignItems='center'
        minHeight={64}
      >
        <Pane>
          <Heading>Paramètres de la Base Adresse Locale</Heading>
        </Pane>
      </Pane>

      <Pane
        display='flex'
        flex={1}
        flexDirection='column'
        overflowY='scroll'
      >
        {token ? (
          <Pane padding={16} is='form' onSubmit={onSubmit}>
            <TextInputField
              required
              name='nom'
              id='nom'
              value={nomInput}
              maxWidth={600}
              disabled={isLoading}
              label='Nom'
              placeholder='Nom'
              onChange={onNomInputChange}
            />

            <Label display='block' marginBottom={4}>
              Adresses email
              {' '}
              <span title='This field is required.'>*</span>
            </Label>
            {balEmails.map(email => (
              <Pane key={email} display='flex' marginBottom={8}>
                <TextInput
                  readOnly
                  disabled
                  type='email'
                  display='block'
                  width='100%'
                  maxWidth={400}
                  value={email}
                />
                {balEmails.length > 1 && (
                  <IconButton
                    type='button'
                    icon='delete'
                    marginLeft={4}
                    appearance='minimal'
                    intent='danger'
                    onClick={() => onRemoveEmail(email)}
                  />
                )}
              </Pane>
            ))}

            <Pane display='flex' marginBottom={16}>
              <TextInput
                display='block'
                type='email'
                width='100%'
                placeholder='Ajouter une adresse email…'
                maxWidth={400}
                isInvalid={Boolean(error && error.includes('mail'))}
                value={email}
                onChange={onEmailChange}
              />
              {email && !balEmails.includes(email) && (
                <IconButton
                  type='submit'
                  icon='add'
                  marginLeft={4}
                  disabled={!email}
                  appearance='minimal'
                  intent='default'
                  onClick={onAddEmail}
                />
              )}
            </Pane>

            {error && (
              <Alert marginBottom={16} intent='danger' title='Erreur'>
                {error}
              </Alert>
            )}

            <Button height={40} marginTop={8} type='submit' appearance='primary' disabled={!hasChanges} isLoading={isLoading}>
              {isLoading ? 'En cours…' : 'Enregistrer les changements'}
            </Button>
          </Pane>
        ) : token === false ? (
          <Pane padding={16}>
            <Alert intent='danger' title='Jeton de sécurité invalide ou non renseigné'>
              Vous n’avez pas accès aux paramètres de cette Base Adresse Locale.
            </Alert>
          </Pane>
        ) : (
          <Spinner size={64} margin='auto' />
        )}
      </Pane>
    </SideSheet>
  )
})

Settings.propTypes = {
  nomBaseLocale: PropTypes.string.isRequired
}

export default Settings