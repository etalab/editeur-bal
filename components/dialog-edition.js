import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {Pane, Dialog, SelectField, Button} from 'evergreen-ui'

const DialogEdition = ({selectedNumeros}) => {
  const [isShown, setIsShown] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleComplete = () => {
    setIsShown(false)
    setIsLoading(false)
  }

  const handleClick = () => {
    setIsShown(true)
  }

  const handleConfirm = () => {
    setIsShown(false)
    console.log(selectedNumeros)
  }

  return (
    <Pane>
      <Dialog
        isShown={isShown}
        title='Modification des types de position'
        isConfirmLoading={isLoading}
        cancelLabel='Annuler'
        confirmLabel={isLoading ? 'Chargement...' : 'Enregistrer'}
        onCloseComplete={() => handleComplete()}
        onConfirm={() => handleConfirm()}
      >
        <SelectField
          flex={1}
          label='Type'
          display='block'
          marginBottom={16}
        >
          <option value='entrée'>Entrée</option>
          <option value='délivrance postale'>Délivrance postale</option>
          <option value='bâtiment'>Bâtiment</option>
          <option value='cage d’escalier'>Cage d’escalier</option>
          <option value='logement'>Logement</option>
          <option value='parcelle'>Parcelle</option>
          <option value='segment'>Segment</option>
          <option value='service technique'>Service technique</option>
          <option value='inconnue'>Inconnue</option>
        </SelectField>
      </Dialog>

      <Button
        iconBefore='edit'
        appearance='primary'
        intent='infos'
        onClick={() => handleClick()}
      >
        Editer les numéros sélectionnés
      </Button>
    </Pane>
  )
}

DialogEdition.propTypes = {
  selectedNumeros: PropTypes.array.isRequired
}

export default DialogEdition
