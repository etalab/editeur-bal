import React, {useState, useCallback, useEffect} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import {Pane, Alert, Button, TextInputField} from 'evergreen-ui'

import {createBaseLocale, uploadBaseLocaleCsv} from '../../lib/bal-api'
import {storeBalAccess} from '../../lib/tokens'

import useFocus from '../../hooks/focus'
import {useInput} from '../../hooks/input'

import Uploader from '../../components/uploader'

function getFileExtension(name) {
  const pos = name.lastIndexOf('.')
  if (pos > 0) {
    return name.substr(pos + 1)
  }

  return null
}

const UploadForm = ({isDemo}) => {
  const [bal, setBal] = useState(null)
  const [file, setFile] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [nom, onNomChange] = useInput('')
  const [email, onEmailChange] = useInput('')
  const focusRef = useFocus()

  const onError = error => {
    setFile(null)
    setIsLoading(false)
    setError(error)
  }

  const onDrop = useCallback(([file]) => {
    if (getFileExtension(file.name) !== 'csv') {
      return onError('Ce type de fichier n’est pas supporté. Vous devez déposer un fichier CSV.')
    }

    if (file.size > 100 * 1024 * 1024) {
      return onError('Ce fichier est trop volumineux. Vous devez déposer un fichier de moins de 100 Mo.')
    }

    setFile(file)
    setError(null)
  }, [])

  const onSubmit = useCallback(async e => {
    e.preventDefault()

    setIsLoading(true)

    if (!bal) {
      try {
        const baseLocale = await createBaseLocale({
          nom,
          emails: [
            email
          ]
        })

        storeBalAccess(baseLocale._id, baseLocale.token)
        setBal(baseLocale)
      } catch (error) {
        setError(error)
      }
    }
  }, [bal, nom, email])

  useEffect(() => {
    async function upload() {
      try {
        const response = await uploadBaseLocaleCsv(bal._id, file, bal.token)
        if (!response.isValid) {
          throw new Error('Fichier invalide')
        }

        Router.push(`/bal?balId=${bal._id}`, `/bal/${bal._id}`)
      } catch (error) {
        setError(error.message)
      }
    }

    if (file && bal) {
      setIsLoading(true)
      upload()
    }
  }, [bal, error, file])

  useEffect(() => {
    if (file || error) {
      setIsLoading(false)
    }
  }, [error, file])

  return (
    <>
      <Pane is='form' padding={16} flex={1} overflowY='scroll' onSubmit={onSubmit}>
        <Uploader
          file={file}
          height={150}
          marginBottom={24}
          placeholder='Sélectionnez ou glissez ici votre fichier BAL au format CSV (maximum 100 Mo)'
          loadingLabel='Analyse en cours'
          disabled={isLoading}
          onDrop={onDrop}
        />

        {file && !isDemo && (
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

        {error && (
          <Alert marginBottom={16} intent='danger' title='Erreur'>
            {error.message}
          </Alert>
        )}

        {file && (
          <Button height={40} type='submit' appearance='primary' disabled={Boolean(error)} isLoading={isLoading}>
            {isLoading ? 'En cours de création…' : 'Créer la Base Adresse Locale'}
          </Button>
        )}
      </Pane>
    </>
  )
}

UploadForm.propTypes = {
  isDemo: PropTypes.bool
}

UploadForm.defaultProps = {
  isDemo: false
}

export default UploadForm
