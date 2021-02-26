import React from 'react'
import PropTypes from 'prop-types'
import {Pane, Table, Badge} from 'evergreen-ui'

const CommunesTable = ({communesList, badge, status}) => {
  return (
    communesList.length > 0 && (
      <Pane borderTop background='tint2'>
        <Table>
          <Table.Head>
            <Table.TextHeaderCell>
              Nom
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              Code INSEE
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              Département
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              Code Postaux
            </Table.TextHeaderCell>
            <Table.TextHeaderCell>
              Statut
            </Table.TextHeaderCell>
          </Table.Head>
          <Table.Body>
            {communesList.map(commune => (
              <Table.Row key={commune.code}>
                <Table.TextCell>{commune.nom}</Table.TextCell>
                <Table.TextCell>{commune.code}</Table.TextCell>
                <Table.TextCell>{commune.codeDepartement}</Table.TextCell>
                <Table.TextCell>{commune.codesPostaux.join(', ')}</Table.TextCell>
                <Table.Cell>
                  {status === 'demo' ? (
                    <Badge isSolid color='neutral'>DÉMO</Badge>
                  ) : (
                    <Badge color={badge.color}>{badge.label}</Badge>
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Pane>
    )
  )
}

CommunesTable.propTypes = {
  communesList: PropTypes.arrayOf(
    PropTypes.shape({
      nom: PropTypes.string,
      code: PropTypes.string,
      codeDepartement: PropTypes.string,
      codesPostaux: PropTypes.array
    })
  ).isRequired,
  badge: PropTypes.shape({
    color: PropTypes.string,
    label: PropTypes.string
  }).isRequired,
  status: PropTypes.string.isRequired
}

export default CommunesTable

