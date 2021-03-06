import React, {useState, useCallback} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import {Pane, Table, Paragraph} from 'evergreen-ui'

import {getBalAccess, getBalToken, removeBalAccess} from '../../lib/tokens'
import {sortBalByUpdate} from '../../lib/sort-bal'

import useFuse from '../../hooks/fuse'
import useError from '../../hooks/error'

import {listBasesLocales, removeBaseLocale} from '../../lib/bal-api'

import DeleteWarning from '../delete-warning'
import BaseLocaleCard from './base-locale-card'

function BasesLocalesList({basesLocales, updateBasesLocales, sortBal}) {
  const [toRemove, setToRemove] = useState(null)

  const [setError] = useError(null)

  const onBalSelect = useCallback(bal => {
    if (bal.communes.length === 1) {
      Router.push(
        `/bal/commune?balId=${bal._id}&codeCommune=${bal.communes[0]}`,
        `/bal/${bal._id}/communes/${bal.communes[0]}`
      )
    } else {
      Router.push(`/bal?balId=${bal._id}`, `/bal/${bal._id}`)
    }
  }, [])

  const [filtered, onFilter] = useFuse(basesLocales, 200, {
    keys: [
      'nom',
      'commune'
    ]
  })

  const onRemove = useCallback(async () => {
    try {
      const token = getBalToken(toRemove)
      await removeBaseLocale(toRemove, token)
      removeBalAccess(toRemove)
      const balAccess = getBalAccess()
      updateBasesLocales(balAccess)
    } catch (error) {
      setError(error.message)
    }

    setToRemove(null)
    setError(null)
  }, [setError, toRemove, updateBasesLocales])

  const handleRemove = useCallback((e, balId) => {
    e.stopPropagation()

    setToRemove(balId)
  }, [])

  return (
    <>
      {basesLocales.length > 0 && (
        <Pane borderTop>

          <DeleteWarning
            isShown={Boolean(toRemove)}
            content={(
              <Paragraph>
                Êtes vous bien sûr de vouloir supprimer cette Base Adresse Locale ? Cette action est définitive.
              </Paragraph>
            )}
            onCancel={() => setToRemove(null)}
            onConfirm={onRemove}
          />

          <Table>
            <Table.Head>
              <Table.SearchHeaderCell
                placeholder='Rechercher une Base Adresse Locale'
                onChange={onFilter}
              />
            </Table.Head>
            {filtered.length === 0 && (
              <Table.Row>
                <Table.TextCell color='muted' fontStyle='italic'>
                  Aucun résultat
                </Table.TextCell>
              </Table.Row>
            )}
            <Table.Body background='tint1'>
              {sortBal(filtered).map(bal => (
                <BaseLocaleCard
                  key={bal._id}
                  editable
                  baseLocale={bal}
                  initialIsOpen={basesLocales.length === 1}
                  onSelect={() => onBalSelect(bal)}
                  onRemove={e => handleRemove(e, bal._id)}
                />
              ))}
            </Table.Body>
          </Table>
        </Pane>
      )}
    </>
  )
}

BasesLocalesList.getInitialProps = async () => {
  const basesLocales = await listBasesLocales()

  return {
    basesLocales,
    layout: 'fullscreen'
  }
}

BasesLocalesList.defaultProps = {
  updateBasesLocales: null,
  sortBal: sortBalByUpdate
}

BasesLocalesList.propTypes = {
  basesLocales: PropTypes.array.isRequired,
  updateBasesLocales: PropTypes.func,
  sortBal: PropTypes.func
}

export default BasesLocalesList
