import { Html } from '@react-three/drei'

export default function HotspotPin({ hotspot, isActive, onSelect }) {
  return (
    <group position={hotspot.position}>
      <Html
        distanceFactor={9}
        zIndexRange={[10, 0]}
        center
        style={{ pointerEvents: 'auto' }}
      >
        <button
          type="button"
          className={`pin${isActive ? ' pin--active' : ''}`}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation()
            onSelect(hotspot)
          }}
          aria-label={`${hotspot.title} — ${hotspot.category}`}
          aria-pressed={isActive}
        >
          <span className="pin__ping" aria-hidden="true" />
          <span className="pin__dot">{hotspot.code}</span>
        </button>
      </Html>
    </group>
  )
}
