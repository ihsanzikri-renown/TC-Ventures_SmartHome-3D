import {
  Lock,
  Video,
  Lightbulb,
  Thermometer,
  DoorOpen,
  Sun,
  Tv,
  UtensilsCrossed,
  Bath,
} from 'lucide-react'
import { hotspots } from '../data/hotspots'

const ICONS = {
  'door-lock': Lock,
  'doorbell-cam': Video,
  'porch-light': Lightbulb,
  'ac-thermostat': Thermometer,
  'garage-door': DoorOpen,
  'solar-panel': Sun,
  'living-room-tv': Tv,
  'kitchen-appliances': UtensilsCrossed,
  'bathroom-fixtures': Bath,
}

const exteriorHotspots = hotspots.filter((h) => h.zone === 'exterior')
const interiorHotspots = hotspots.filter((h) => h.zone === 'interior')

function LegendItem({ hotspot, isActive, onSelect }) {
  const Icon = ICONS[hotspot.id]
  return (
    <li>
      <button
        type="button"
        className={`legend__item${isActive ? ' legend__item--active' : ''}`}
        onClick={() => onSelect(hotspot)}
        aria-pressed={isActive}
      >
        <span className="legend__item-code">{hotspot.code}</span>
        <Icon size={16} strokeWidth={2} className="legend__item-icon" />
        <span className="legend__item-text">
          <span className="legend__item-title">{hotspot.title}</span>
          <span className="legend__item-cat">{hotspot.category}</span>
        </span>
      </button>
    </li>
  )
}

export default function DeviceLegend({ activeId, onSelect, isOpenMobile, onCloseMobile }) {
  return (
    <nav
      className={`legend${isOpenMobile ? ' legend--open' : ''}`}
      aria-label="Daftar perangkat rumah pintar"
    >
      <div className="legend__header">
        <p className="legend__title">Perangkat</p>
        <p className="legend__count">{hotspots.length} titik terpasang</p>
        <button
          type="button"
          className="legend__close-mobile"
          onClick={onCloseMobile}
          aria-label="Tutup daftar perangkat"
        >
          ×
        </button>
      </div>

      <div className="legend__scroll">
        <p className="legend__section">Eksterior</p>
        <ul className="legend__list">
          {exteriorHotspots.map((h) => (
            <LegendItem key={h.id} hotspot={h} isActive={activeId === h.id} onSelect={onSelect} />
          ))}
        </ul>

        <p className="legend__section">Interior (jelajah langsung)</p>
        <ul className="legend__list">
          {interiorHotspots.map((h) => (
            <LegendItem key={h.id} hotspot={h} isActive={activeId === h.id} onSelect={onSelect} />
          ))}
        </ul>
      </div>
    </nav>
  )
}
