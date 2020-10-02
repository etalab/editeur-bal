import React from 'react'
import PropTypes from 'prop-types'
import {Badge, Card, Pane, Button, Tooltip, Icon} from 'evergreen-ui'
import {formatDistanceToNow, format} from 'date-fns'
import {fr} from 'date-fns/locale'

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

function BaseLocaleCard({baseLocale, editable, onSelect, onRemove}) {
  const {nom, communes, status, _updated, _created, emails} = baseLocale
  const badge = getBadge(status)

  return (
    <Card
      border
      elevation={2}
      margin={8}
      padding={12}
      fontFamily='Helvetica Neue'
      display='flex'
      flexDirection='column'
      justifyContent='space-between'
      background='tint1'
    >
      <Pane borderBottom marginBottom='12px' padding='.5em' display='flex' justifyContent='space-between'>
        <Pane marginBottom='8px'>
          <Pane fontSize='18px'>{nom}</Pane>
          <Pane fontSize='12px' fontStyle='italic'>{_updated ? 'Dernière mise à jour, il y a ' + formatDistanceToNow(new Date(_updated), {locale: fr}) : 'Jamais mise à jour'}</Pane>
        </Pane>
        <Pane justifyContent='flex-end'>
          <Badge color={badge.color}>{badge.label}</Badge>
        </Pane>
      </Pane>

      <Pane display='flex' flexDirection='row' flex={3}>
        <Pane flex={1} textAlign='center' margin='auto'>
          <Pane>Créée le <b>{format(new Date(_created), 'PPP', {locale: fr})}</b></Pane>
        </Pane>

        <Pane borderLeft borderRight flex={1} textAlign='center' padding='8px' margin='auto'>
          {communes.length < 2 ? 'Commune : ' : `${communes.length} Communes : `}
          {communes.map(commune => (
            <Pane key={commune}><b> - {commune}</b></Pane>
          ))}
        </Pane>

        {emails ? (
          <Pane flex={1} textAlign='center' padding='8px' display='flex' flexDirection='row' justifyContent='center' margin='auto'>
            {emails.length < 2 ? emails.length + ' Administrateur' : emails.length + ' Administrateurs'}
            <Tooltip
              content={
                emails.map(email => (
                  <Pane key={email} fontFamily='Helvetica Neue' padding='.5em'>
                    <Icon icon='user' marginRight='.5em' style={{verticalAlign: 'middle'}} />
                    {email}
                  </Pane>
                ))
              }
              appearance='card'
            >
              <Icon icon='info-sign' marginLeft='.5em' />
            </Tooltip>
          </Pane>
        ) : (
          <Pane flex={1} />
        )}
      </Pane>

      <Pane borderTop display='flex' justifyContent='space-between' paddingTop='1em' marginTop='1em'>
        {status === 'draft' && editable ? (
          <Button iconAfter='trash' intent='danger' onClick={onRemove}>Supprimer</Button>
        ) : (
          <Tooltip content='Vous ne pouvez pas supprimer une BAL losrqu‘elle est prête à être publiée'>
            <Button isActive iconAfter='trash' >Supprimer</Button>
          </Tooltip>
        )}
        <Button appearance='primary' iconAfter='edit' marginRight='8px' onClick={onSelect}>Modifier</Button>
      </Pane>

    </Card>
  )
}

BaseLocaleCard.defaultProps = {
  editable: false,
  onRemove: null
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
      'draft', 'ready-to-publish', 'published'
    ])
  }).isRequired,
  editable: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
  onRemove: PropTypes.func

}

export default BaseLocaleCard
