import React, {useContext, useState, useEffect, useCallback} from 'react'
import PropTypes from 'prop-types'
import {Pane, SideSheet, Heading, TextInputField, TextInput, IconButton, Button, Alert, Spinner, Label, toaster} from 'evergreen-ui'
import {isEqual} from 'lodash'
import {validateEmail} from '../lib/utils/email.js'

import {updateBaseLocale} from '../lib/bal-api'

import TokenContext from '../contexts/token'
import SettingsContext from '../contexts/settings'

import {useInput} from '../hooks/input'

const Settings = React.memo(({baseLocale, refreshBaseLocale}) => {
  const {showSettings, setShowSettings} = useContext(SettingsContext)
  const {token, emails, refreshEmails} = useContext(TokenContext)

  const [isLoading, setIsLoading] = useState(false)
  const [balEmails, setBalEmails] = useState([])
  const [nom, onNomChange] = useInput(baseLocale.nom)
  const [email, onEmailChange, resetEmail] = useInput()
  const [isValidMail, setIsValidMail] = useState(true)
  const [error, setError] = useState()
  const [hasChanges, setHasChanges] = useState(false)

  const mailHasChanged = (mailA, mailB) => {
    const mails = mailA || []
    return !isEqual([...mails].sort(), [...mailB].sort())
  }

  const reloadBaseLocale = useCallback(() => {
    setHasChanges(false)
    refreshBaseLocale()
    refreshEmails()
  }, [setHasChanges])

  const onRemoveEmail = useCallback(email => {
    setError(null)
    setBalEmails(emails => emails.filter(e => e !== email))
  }, [])

  const onAddEmail = useCallback(e => {
    e.preventDefault()

    const isValidMail = validateEmail(email)

    if (isValidMail) {
      setBalEmails(emails => [...emails, email])
      setError(null)
      resetEmail()
    } else {
      setError('Cette adresse n‘est pas valide')
    }
    
    setIsValidMail(isValidMail)
  }, [email, resetEmail])

  const onSubmit = useCallback(async e => {
    e.preventDefault()

    setIsLoading(true)

    try {
      await updateBaseLocale(baseLocale._id, {
        nom,
        emails: balEmails
      }, token)

      setError(null)
      reloadBaseLocale()

      toaster.success('La Base Adresse Locale a été modifiée avec succès !')
    } catch (error) {
      setError(error.message)
    }
    setIsLoading(false)
  }, [baseLocale._id, nom, balEmails, token])

  useEffect(() => {
    setBalEmails(emails || [])
  }, [emails])

  useEffect(() => {
    if (nom !== baseLocale.nom || mailHasChanged(emails, balEmails)) {
      setHasChanges(true)
    } else {
      setHasChanges(false)
    }
  }, [nom, balEmails, baseLocale.nom])

  return (
    <>
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
        >
          {token ? (
            <Pane padding={16} is='form' onSubmit={onSubmit}>
              <TextInputField
                required
                name='nom'
                id='nom'
                value={nom}
                maxWidth={600}
                disabled={isLoading}
                label='Nom'
                placeholder='Nom'
                onChange={onNomChange}
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
                  isInvalid={!isValidMail}
                  validationMessage='Cet email semble invalide'
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

              <Button 
                height={40}
                marginTop={8}
                type='submit'
                appearance='primary'
                disabled={!hasChanges}
                isLoading={isLoading}
              >
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
    </>
  )
})

Settings.propTypes = {
  baseLocale: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    nom: PropTypes.string.isRequired
  }).isRequired,
  refreshBaseLocale: PropTypes.func.isRequired
}

export default Settings