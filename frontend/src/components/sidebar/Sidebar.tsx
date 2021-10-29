import React from 'react'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router-dom'

import { FiArrowLeft } from 'react-icons/fi'

import { logoHappy } from '../../utils/MapMarker'

import './sidebar.css'

export default function Sidebar() {
  const { goBack } = useHistory()
  return (
    <aside className="sidebar">
      <Link to="/">
        <img src={logoHappy} alt="Happy" />
      </Link>

      <footer>
        <button type="button" onClick={goBack}>
          <FiArrowLeft size={24} color="#FFF" />
        </button>
      </footer>
    </aside>
  )
}
