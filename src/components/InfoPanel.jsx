import { X, CheckCircle2, ArrowRight } from 'lucide-react'

export default function InfoPanel({ hotspot, onClose, onAction }) {
  const isOpen = Boolean(hotspot)

  return (
    <aside className={`info-panel${isOpen ? ' info-panel--open' : ''}`} aria-hidden={!isOpen}>
      {hotspot && (
        <div className="info-panel__inner">
          <div className="info-panel__top">
            <span className="info-panel__code">{hotspot.code}</span>
            <button
              type="button"
              className="info-panel__close"
              onClick={onClose}
              aria-label="Tutup panel informasi"
            >
              <X size={18} strokeWidth={2.2} />
            </button>
          </div>

          <span className="info-panel__eyebrow">
            {hotspot.category}
            {hotspot.room ? ` · ${hotspot.room}` : ''}
          </span>
          <h2 className="info-panel__title">{hotspot.title}</h2>

          <div className={`info-panel__status info-panel__status--${hotspot.statusTone}`}>
            <span className="info-panel__status-dot" />
            STATUS · {hotspot.status}
          </div>

          <p className="info-panel__desc">{hotspot.description}</p>

          <p className="info-panel__features-label">Fitur</p>
          <ul className="info-panel__features">
            {hotspot.features.map((f) => (
              <li key={f}>
                <CheckCircle2 size={16} strokeWidth={2} />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          {hotspot.action && (
            <button
              type="button"
              className="info-panel__action"
              onClick={() => onAction?.(hotspot.action.type, hotspot)}
            >
              {hotspot.action.label}
              <ArrowRight size={15} strokeWidth={2.2} />
            </button>
          )}
        </div>
      )}
    </aside>
  )
}
