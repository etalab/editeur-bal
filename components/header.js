import React from 'react'
import Router from 'next/router'
import {Pane, Button, Link} from 'evergreen-ui'

const links = [
  {text: 'Guide de l’adressage', link: 'https://adresse.data.gouv.fr/guides'}
]

const Header = () => {
  return (
    <Pane borderBottom padding={16} backgroundColor='white' display='flex' justifyContent='space-between' alignItems='center' flexShrink='0' width='100%' maxHeight={76}>
      <img src='/static/images/mes-adresses.svg' alt='Page d’accueil du site mes-adresses.data.gouv.fr' onClick={() => Router.push('/')} />
      <Pane display='flex' justifyContent='space-around' alignItems='center'>
        {links.map(link => (
          <Button key={link.text} appearance='minimal' marginRight='12px' minHeight='55px'>
            <Link href={link.link} textDecoration='none' color='neutral' target='_blank'>
              {link.text}
            </Link>
          </Button>
        ))}
      </Pane>
      <style jsx>{`
        img:hover {
          cursor: pointer;
        }
      `}</style>
    </Pane>
  )
}

export default Header
