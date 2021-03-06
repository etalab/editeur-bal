import React from 'react'
import {Pane, Paragraph, OrderedList, ListItem, Strong, Menu, Button, IconButton, MapMarkerIcon, AddIcon, ColumnLayoutIcon, MapIcon, MoreIcon, SendToMapIcon, TrashIcon} from 'evergreen-ui'

import Tuto from '../tuto'
import SubTuto from '../tuto/sub-tuto'
import Unauthorized from '../tuto/unauthorized'

import Sidebar from '../tuto/sidebar'
import Problems from './problems'

const before = (
  <Paragraph marginTop='default'>
    Affichez la liste des voies d’une commune en cliquant sur le nom de celle-ci se trouvant en haut à gauche de votre écran.
  </Paragraph>
)

const Voies = () => {
  return (
    <>
      <Pane>
        <Tuto title='Ajouter une voie'>
          {before}
          <OrderedList margin={8}>
            <ListItem>
              Cliquez sur le bouton
              <Button iconBefore={AddIcon} marginX={4} appearance='primary' intent='success'>Ajouter une voie</Button>
            </ListItem>
            <ListItem>
              Entrez le nom de la voie que vous souhaitez créer dans le champ <Strong size={500} fontStyle='italic'>Nom de la voie…</Strong>
            </ListItem>
            <ListItem>
              Pour terminer, cliquez sur le bouton <Button marginX={4} appearance='primary' intent='success'>Ajouter</Button>
            </ListItem>
          </OrderedList>
        </Tuto>

        <Tuto title='Ajouter un toponyme'>
          <SubTuto title='Depuis le menu latéral' icon={ColumnLayoutIcon}>
            {before}

            <OrderedList margin={8}>
              <ListItem>
                Cliquez sur le bouton
                <Button iconBefore={AddIcon} marginX={4} appearance='primary' intent='success'>Ajouter une voie</Button>
              </ListItem>
              <ListItem>
                Cochez la case <Strong size={500} fontStyle='italic'>Cette voie est un toponyme</Strong>
              </ListItem>
              <ListItem>
                Entrez le nom du toponyme que vous souhaitez créer dans le champ <Strong size={500} fontStyle='italic'>Nom du toponyme…</Strong>
              </ListItem>
              <ListItem>
                Un <MapMarkerIcon color='info' /> est apparu au centre de la carte, déplacez le à l’endroit souhaité à l’aide de votre souris
              </ListItem>
              <ListItem>
                Pour terminer, cliquez sur le bouton <Button marginX={4} appearance='primary' intent='success'>Ajouter</Button>
              </ListItem>
            </OrderedList>
          </SubTuto>

          <SubTuto title='Depuis la carte' icon={MapIcon}>
            <OrderedList margin={8}>
              <ListItem>
                <Pane display='flex' alignItems='center'>
                  Cliquez sur le bouton <IconButton marginLeft={8} icon={MapMarkerIcon} />
                </Pane>
              </ListItem>
              <ListItem>
                Un <MapMarkerIcon color='info' /> est apparu au centre de la carte, déplacez le à l’endroit souhaité à l’aide de votre souris
              </ListItem>
              <ListItem>
                Dans le nouveau menu qui est apparu, cochez la case <Strong size={500} fontStyle='italic'>Cette voie est un toponyme</Strong>
              </ListItem>
              <ListItem>
                Entrez le nom du toponyme que vous souhaitez créer dans le champ <Strong size={500} fontStyle='italic'>Nom du toponyme…</Strong>
              </ListItem>
              <ListItem>
                Pour terminer, cliquez sur le bouton <Button marginX={4} appearance='primary' intent='success'>Ajouter</Button>
              </ListItem>
            </OrderedList>
          </SubTuto>
        </Tuto>

        <Tuto title='Renommer une voie'>
          {before}

          <OrderedList margin={8}>
            <ListItem>Cliquez sur le du nom de la voie</ListItem>
            <ListItem>Éditer le nom de la voie</ListItem>
            <ListItem>
              Pour terminer, cliquez sur <Button marginX={4} appearance='primary' intent='success'>Modifier</Button>
            </ListItem>
          </OrderedList>

        </Tuto>

        <Tuto title='Consulter une voie'>
          {before}

          <SubTuto title='Depuis le menu latéral' icon={ColumnLayoutIcon}>
            <OrderedList margin={8}>
              <ListItem>
                Cliquez sur le bouton <Button background='tint1' iconBefore={MoreIcon} appearance='minimal' /> se situant à droite du nom de la voie
              </ListItem>
              <ListItem>
                <Pane display='flex' alignItems='center'>
                  Dans le menu qui vient d’apparaître, choisissez
                  <Menu.Item background='tint1' marginLeft={8} icon={SendToMapIcon}>
                    Consulter
                  </Menu.Item>
                </Pane>
              </ListItem>
            </OrderedList>
          </SubTuto>

          <SubTuto title='Depuis la carte' icon={MapIcon}>
            <OrderedList margin={8}>
              <ListItem>Cliquez sur le nom de la voie ou sur l’un de ses numéros</ListItem>
            </OrderedList>
          </SubTuto>
        </Tuto>

        <Tuto title='Supprimer une voie'>
          {before}

          <OrderedList margin={8}>
            <ListItem>
              Cliquez sur le bouton <Button background='tint1' iconBefore={MoreIcon} appearance='minimal' /> se situant à droite du nom de la voie
            </ListItem>
            <ListItem>
              <Pane display='flex' alignItems='center'>
                Dans le menu qui vient d’apparaître, choisissez
                <Menu.Item background='tint1' marginLeft={8} icon={TrashIcon} intent='danger'>
                  Supprimer…
                </Menu.Item>
              </Pane>
            </ListItem>
            <ListItem>Pour terminer, confirmez votre choix en cliquant sur <Button marginX={4} intent='danger' appearance='primary'>Supprimer</Button></ListItem>
          </OrderedList>
        </Tuto>

        <Tuto title='Supprimer un toponyme'>
          <SubTuto title='Depuis la carte' icon={MapIcon}>
            <OrderedList margin={8}>
              <ListItem>Faites un clique droit sur le toponyme</ListItem>
              <ListItem>
                <Pane display='flex' alignItems='center'>
                  Dans le menu qui vient d’apparaître, choisissez
                  <Menu.Item background='tint1' marginLeft={8} icon={TrashIcon} intent='danger'>
                    Supprimer…
                  </Menu.Item>
                </Pane>
              </ListItem>
            </OrderedList>
          </SubTuto>
        </Tuto>

        <Problems>
          <Unauthorized title='Je n’arrive pas à ajouter/supprimer une voie' />
          <Sidebar />
        </Problems>
      </Pane>
    </>
  )
}

export default Voies
