import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {Heading, Badge, Card, Pane, Button, Tooltip, Table, Text, GlobeIcon, ChevronRightIcon, ChevronDownIcon, UserIcon, InfoSignIcon, TrashIcon, EditIcon} from 'evergreen-ui'
import {formatDistanceToNow, format} from 'date-fns'
import {fr} from 'date-fns/locale'

import {getCommune} from '../../lib/geo-api'

function getBadge(status) {
  switch (status) {
    case 'published':
      return {color: 'green', label: 'Publiée'}
    case 'ready-to-publish':
      return {color: 'blue', label: 'Prête à être publiée'}
    default:
      return {color: 'neutral', label: 'Brouillon'}
  }
}

const BaseLocaleCard = ({baseLocale, editable, onSelect, onRemove, initialIsOpen}) => {
  const {nom, communes, status, _updated, _created, emails} = baseLocale
  const [communesList, setCommunesList] = useState([])
  const [isOpen, setIsOpen] = useState(editable ? initialIsOpen : false)
  const majDate = formatDistanceToNow(new Date(_updated), {locale: fr})
  const createDate = format(new Date(_created), 'PPP', {locale: fr})
  const badge = getBadge(status)

  const handleIsOpen = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    const fetchCommunes = async code => {
      await Promise.all(
        code.map(async commune => {
          const newCommune = await getCommune(commune)
          setCommunesList(prevCommunes => [...prevCommunes, newCommune])
        })
      )
    }

    fetchCommunes(communes)
  }, [communes])

  return (
    <Card
      border
      elevation={2}
      margin={10}
      padding={12}
      display='grid'
      gridTemplateColumns='repeat(1fr)'
      background={baseLocale.status === 'demo' ? '#E4E7EB' : 'tint1'}
    >
      <Pane padding='.5em' display='flex' justifyContent='space-between' cursor='pointer' onClick={handleIsOpen}>
        <Pane>
          <Pane display='flex' flexDirection='row' justifyContent='start'>
            <GlobeIcon marginRight='.5em' marginY='auto' />
            <Heading fontSize='18px'>{nom}</Heading>
          </Pane>
          <Text fontSize='12px' fontStyle='italic'>{_updated ? 'Dernière mise à jour il y a ' + majDate : 'Jamais mise à jour'} - </Text>
          {communes.length === 0 ? (
            <Text fontSize='12px' fontStyle='italic'>Vide</Text>
          ) : communes.length < 2 ? (
            communesList.length > 0 && <Text fontSize='12px' fontStyle='italic'>{communesList[0].nom} ({communesList[0].codeDepartement}) </Text>
          ) : (
            <Text fontSize='12px' fontStyle='italic'>{communes.length} Communes</Text>
          )}
        </Pane>
        <Pane display='flex' flexDirection='row' justifyContent='space-between'>
          {!isOpen && (
            baseLocale.status === 'demo' ? (
              <Badge isSolid color='neutral' margin='auto'>DÉMO</Badge>
            ) : (
              <Badge color={badge.color} margin='auto'>{badge.label}</Badge>
            )
          )}
          {isOpen ? (
            <ChevronDownIcon size={25} marginX='1em' marginY='auto' />
          ) : (
            <ChevronRightIcon size={25} marginX='1em' marginY='auto' />
          )}
        </Pane>
      </Pane>

      {isOpen && (
        <>
          <Pane borderTop flex={3} display='flex' flexDirection='row' paddingTop='1em' marginBottom='8px'>
            <Pane flex={1} textAlign='center' margin='auto'>
              <Text>Créée le <Pane><b>{createDate}</b></Pane></Text>
            </Pane>

            {emails && editable && (
              <Pane flex={1} textAlign='center' padding='8px' display='flex' flexDirection='row' justifyContent='center' margin='auto'>
                <Text>{emails.length < 2 ? '1 Administrateur' : emails.length + ' Administrateurs'}</Text>
                <Tooltip
                  content={
                    emails.map(email => (
                      <Pane key={email} fontFamily='Helvetica Neue' padding='.5em'>
                        <UserIcon marginRight='.5em' style={{verticalAlign: 'middle'}} />
                        {email}
                      </Pane>
                    ))
                  }
                  appearance='card'
                >
                  <InfoSignIcon marginY='auto' marginX='.5em' />
                </Tooltip>
              </Pane>
            )}
            {!emails && editable && (
              <Pane flex={1} display='flex' flexDirection='row' justifyContent='center' marginY='auto' textAlign='center'>
                <Text><small><i>Pas d’administrateur<br /> pour les BAL de démonstration</i></small></Text>
              </Pane>
            )}
          </Pane>

          {communesList.length > 0 && (
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
                      <Table.TextCell>{commune.codesPostaux.map(code => `${code} `)}</Table.TextCell>
                      <Table.Cell>
                        {baseLocale.status === 'demo' ? (
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
          )}

          {editable ? (
            <Pane borderTop display='flex' justifyContent='space-between' paddingTop='1em'>
              {status === 'draft' || status === 'demo' ? (
                <Button iconAfter={TrashIcon} intent='danger' onClick={onRemove}>Supprimer</Button>
              ) : (
                <Tooltip content='Vous ne pouvez pas supprimer une BAL losrqu‘elle est prête à être publiée'>
                  <Button isActive iconAfter={TrashIcon}>Supprimer</Button>
                </Tooltip>
              )}
              <Button appearance='primary' iconAfter={EditIcon} marginRight='8px' onClick={onSelect}>Gérer les adresses</Button>
            </Pane>
          ) : (
            <Pane borderTop display='flex' justifyContent='flex-end' paddingTop='1em' marginTop='1em'>
              <Button appearance='primary' marginRight='8px' onClick={onSelect}>Consulter</Button>
            </Pane>
          )}

        </>
      )}

    </Card>
  )
}

BaseLocaleCard.defaultProps = {
  editable: false,
  onRemove: null,
  initialIsOpen: false
}

BaseLocaleCard.propTypes = {
  baseLocale: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    nom: PropTypes.string.isRequired,
    communes: PropTypes.array.isRequired,
    emails: PropTypes.array,
    _updated: PropTypes.string,
    _created: PropTypes.string,
    description: PropTypes.string,
    status: PropTypes.oneOf([
      'draft', 'ready-to-publish', 'published', 'demo'
    ])
  }).isRequired,
  initialIsOpen: PropTypes.bool,
  editable: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
  onRemove: PropTypes.func

}

export default BaseLocaleCard
