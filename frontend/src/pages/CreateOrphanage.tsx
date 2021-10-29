import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import InputMask from 'react-input-mask'
import { Map, Marker, TileLayer } from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet'
import { FiPlus } from 'react-icons/fi'
import { useHistory } from 'react-router-dom'

import Sidebar from '../components/sidebar/Sidebar'
import { happyMapIcon } from '../utils/MapMarker'

import api from '../services/api'

import '../styles/pages/create-orphanage.css'

interface AddressData {
  place_id: number
  lat: number
  lon: number
  display_name: string
}

export default function OrphanagesMap() {
  const history = useHistory()
  const [position, setPosition] = useState({ latitude: 0, longitude: 0 })

  const [searchTerm, setSearchTerm] = useState('')
  const [delayedSearchTerm, setDelayedSearchTerm] = useState<AddressData>()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [about, setAbout] = useState('')
  const [instructions, setInstrucions] = useState('')
  const [opening_hours, setOpeningHours] = useState('')
  const [open_on_weekends, setOpenOnWeekends] = useState(true)
  const [images, setImages] = useState<File[]>([])
  const [previewImages, setPreviewImages] = useState<string[]>([])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      api
        .get(
          `https://nominatim.openstreetmap.org/search?format=json&limit=3&q=/${searchTerm}`
        )
        .then(response => {
          setDelayedSearchTerm(response.data[0])
        })
        .catch(response => console.log(response.data))
    }, 1000)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm])

  function handleSelectImages(event: ChangeEvent<HTMLInputElement>) {
    //console.log(event)
    if (!event.target.files) {
      return
    }
    const selectedImages = Array.from(event.target.files)
    setImages(selectedImages)

    const selectedImagesPreview = selectedImages.map(image => {
      //console.log(image)
      return URL.createObjectURL(image)
    })

    setPreviewImages(selectedImagesPreview)
  }

  function handleRemoveImages(event: string, index: number) {
    setPreviewImages(previewImages.filter(item => item !== event))
    setImages(images.splice(index - 1, 1))
  }

  function handleMapClick(event: LeafletMouseEvent) {
    const { lat, lng } = event.latlng

    setPosition({
      latitude: lat,
      longitude: lng
    })
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const { latitude, longitude } = position

    const data = new FormData()

    data.append('name', name)
    data.append('about', about)
    data.append('latitude', String(latitude))
    data.append('longitude', String(longitude))
    data.append('instructions', instructions)
    data.append('opening_hours', opening_hours)
    data.append('open_on_weekends', String(open_on_weekends))
    images.forEach(image => {
      data.append('images', image)
    })

    await api.post('orphanages', data)

    alert('Cadastro realizado com sucesso!')
    history.push('/app')
  }

  return (
    <div id="page-create-orphanage">
      <Sidebar />
      <main>
        <form onSubmit={handleSubmit} className="create-orphanage-form">
          <fieldset>
            <legend>Dados</legend>

            <Map
              center={[-27.2092052, -49.6401092]}
              style={{ width: '100%', height: 280 }}
              zoom={15}
              onClick={handleMapClick}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              {position.latitude !== 0 && (
                <Marker
                  interactive={false}
                  icon={happyMapIcon}
                  position={[position.latitude, position.longitude]}
                />
              )}
            </Map>

            <div className="input-block">
              <label htmlFor="address">Endereço</label>
              <input
                id="address"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="name">Nome da Instituição</label>
              <input
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="name">Whatsapp da Instituição</label>
              <InputMask
                mask="(+55) 99 99999.9999"
                id="phone"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="about">
                Sobre <span>Máximo de 300 caracteres</span>
              </label>
              <textarea
                id="name"
                maxLength={300}
                value={about}
                onChange={e => setAbout(e.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">
                {previewImages.map((image, index) => {
                  return (
                    <div key={image}>
                      <img src={image} alt={image} />
                      <button
                        type="button"
                        onClick={() => {
                          handleRemoveImages(image, index)
                        }}
                      >
                        X
                      </button>
                    </div>
                  )
                })}

                <label htmlFor="image[]" className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>
              </div>
              <input
                multiple
                onChange={handleSelectImages}
                onClick={e => ((e.target as HTMLTextAreaElement).value = '')}
                type="file"
                id="image[]"
              />
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea
                id="instructions"
                value={instructions}
                onChange={e => setInstrucions(e.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horário de funcionamento</label>
              <input
                id="opening_hours"
                value={opening_hours}
                onChange={e => setOpeningHours(e.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button
                  type="button"
                  className={open_on_weekends ? 'active' : ''}
                  onClick={() => setOpenOnWeekends(true)}
                >
                  Sim
                </button>
                <button
                  type="button"
                  className={!open_on_weekends ? 'not-active' : ''}
                  onClick={() => setOpenOnWeekends(false)}
                >
                  Não
                </button>
              </div>
            </div>
          </fieldset>

          <button className="primary-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  )
}
