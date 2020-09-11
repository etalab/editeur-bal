import {getPublishedBasesLocales} from '../lib/adresse-backend'
import {getVoies, getNumeros} from '../lib/bal-api'

export const expandWithPublished = async basesLocales => {
  const publishedBasesLocales = await getPublishedBasesLocales()
  basesLocales.forEach(baseLocale => {
    baseLocale.published = Boolean(publishedBasesLocales.find(bal => bal.url.includes(baseLocale._id)))
  })

  return publishedBasesLocales
}

export const checkAnomalies = async basesLocales => {
  const anomalies = {}
  await Promise.all(basesLocales.map(async ({_id, communes}) => {
    const communesVoies = await Promise.all(communes.map(async codeCommune => {
      return getVoies(_id, codeCommune)
    }))

    communesVoies.forEach(voies => {
      voies.forEach(async voie => {
        if (voie.nom === voie.nom.toUpperCase()) {
          anomalies[_id] = {uppercase: true}
        }

        const numeros = await getNumeros(voie._id)
        numeros.forEach(({numero}) => {
          if (numero >= 5000) {
            if (anomalies[_id]) {
              anomalies[_id].virtual = true
            } else {
              anomalies[_id] = {virtual: true}
            }
          }
        })
      })
    })
  }))

  return anomalies
}
