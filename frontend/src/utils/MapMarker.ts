import Leaflet from 'leaflet'

import mapMarkerImg from '../images/map-marker.svg'

export const logoHappy = mapMarkerImg

export const happyMapIcon = Leaflet.icon({
  iconUrl: mapMarkerImg,
  iconSize: [42, 50],
  iconAnchor: [20, 48],
  popupAnchor: [165, 20]
})
