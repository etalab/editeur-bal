import React, {useState, useEffect, useMemo, useCallback} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import {Pane, Heading, Paragraph, Table, Tooltip, Icon, Badge, Spinner} from 'evergreen-ui'

import {listBasesLocales} from '../../lib/bal-api'
import {expandWithPublished, checkAnomalies} from '../../helpers/bases-locales'
import {formatDate} from '../../helpers/date'

import useFuse from '../../hooks/fuse'

function Index({basesLocales}) {
  const [anomalies, setAnomalies] = useState({})
  const [anomaliesLoading, setAnomaliesLoading] = useState(true)

  const [filtered, onFilter] = useFuse(basesLocales, 200, {
    keys: [
      'nom',
      'commune'
    ]
  })

  const statusBadge = useMemo(status => {
    if (status) {
      return status === 'published' ?
        <Badge color='green'>Publiée</Badge> :
        <Badge color='blue'>Prête à être publiée</Badge>
    }

    return <Badge color='neutral'>Brouillon</Badge>
  }, [])

  const handleSelect = baseLocale => {
    const {_id, communes} = baseLocale
    if (communes.length === 1) {
      Router.push(
        `/bal/commune?balId=${_id}&codeCommune=${communes[0]}`,
        `/bal/${_id}/communes/${communes[0]}`
      )
    } else {
      Router.push(`/bal?balId=${_id}`, `/bal/${_id}`)
    }
  }

  const getTooltip = useCallback(baseLocaleId => {
    const arr = []

    if (anomalies[baseLocaleId].uppercase) {
      arr.push('Nom de voie en lettre capitale')
    }

    if (anomalies[baseLocaleId].virtual) {
      arr.push('Numéro virtuel')
    }

    return arr.join(', ')
  }, [anomalies])

  useEffect(() => {
    const getAnomalies = async basesLocales => {
      const anomalies = await checkAnomalies(basesLocales)
      setAnomalies(anomalies)
      setAnomaliesLoading(false)
    }

    getAnomalies(basesLocales)
  }, [basesLocales])

  return (
    <Pane backgroundColor='white' display='flex' flexDirection='column' height='100%'>
      <Pane padding={16}>
        <Heading size={600} marginBottom={8}>Nouvelle Base Adresse Locale</Heading>
        <Paragraph>
          Sélectionnez une commune pour laquelle vous souhaitez créer ou modifier une Base Adresse Locale.
        </Paragraph>
      </Pane>

      <Table display='flex' flexDirection='column' flex={1}>
        <Table.Head>
          <Table.SearchHeaderCell placeholder='Recherche…' onChange={onFilter} />
          <Table.TextHeaderCell>Codes Communes</Table.TextHeaderCell>
          <Table.TextHeaderCell>Date de création</Table.TextHeaderCell>
          <Table.TextHeaderCell>Dernière mise à jour</Table.TextHeaderCell>
          <Table.TextHeaderCell>Statut</Table.TextHeaderCell>
          <Table.TextHeaderCell>Anomalies</Table.TextHeaderCell>
        </Table.Head>
        <Table.VirtualBody>
          {filtered.length > 0 ? filtered.map(baseLocale => (
            <Table.Row key={baseLocale._id} isSelectable onSelect={() => handleSelect(baseLocale._id)}>
              <Table.TextCell>{baseLocale.nom}</Table.TextCell>
              <Table.TextCell>{baseLocale.communes.length > 0 ? baseLocale.communes.join(', ') : '-'}</Table.TextCell>
              <Table.TextCell>{formatDate(baseLocale._created)}</Table.TextCell>
              <Table.TextCell>{formatDate(baseLocale._updated)}</Table.TextCell>
              <Table.Cell>
                {statusBadge}
              </Table.Cell>
              <Table.TextCell>
                {anomaliesLoading ? <Spinner size={16} /> :
                  anomalies[baseLocale._id] ? (
                    <Tooltip content={getTooltip(baseLocale._id)}>
                      <Icon icon='warning-sign' color='warning' />
                    </Tooltip>
                  ) :
                    <Icon icon='tick' color='success' />
                }
              </Table.TextCell>
            </Table.Row>
          )) : (
            <Table.Row>
              <Table.TextCell color='muted' fontStyle='italic'>
                  Aucun résultat
              </Table.TextCell>
            </Table.Row>
          )}
        </Table.VirtualBody>
      </Table>
    </Pane>
  )
}

Index.getInitialProps = async () => {
  const basesLocales = await listBasesLocales()
  await expandWithPublished(basesLocales)

  return {
    basesLocales
  }
}

Index.propTypes = {
  basesLocales: PropTypes.array.isRequired
}

export default Index
