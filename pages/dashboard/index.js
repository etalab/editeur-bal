import React, {useState, useMemo} from 'react'
import PropTypes from 'prop-types'
import {Pane, Heading, Paragraph, Table, Badge} from 'evergreen-ui'

import {listBasesLocales} from '../../lib/bal-api'
import {expandWithPublished} from '../../helpers/bases-locales'
import {formatDate} from '../../helpers/date'

import useFuse from '../../hooks/fuse'

function Index({basesLocales}) {
  const [selected, setSelected] = useState(null)

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
        </Table.Head>
        <Table.VirtualBody>
          {filtered.length > 0 ? filtered.map(baseLocale => (
            <Table.Row key={baseLocale._id} isSelectable onSelect={() => setSelected(baseLocale)}>
              <Table.TextCell>{baseLocale.nom}</Table.TextCell>
              <Table.TextCell>{baseLocale.communes.length > 0 ? baseLocale.communes.join(', ') : '-'}</Table.TextCell>
              <Table.TextCell>{formatDate(baseLocale._created)}</Table.TextCell>
              <Table.TextCell>{formatDate(baseLocale._updated)}</Table.TextCell>
              <Table.Cell>
                {statusBadge}
              </Table.Cell>
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
