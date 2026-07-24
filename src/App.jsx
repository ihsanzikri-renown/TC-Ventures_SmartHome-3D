import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { RotateCcw, Orbit, MousePointerClick, Menu, House, LogOut, Footprints } from 'lucide-react'
import Scene from './components/Scene'
import InfoPanel from './components/InfoPanel'
import DeviceLegend from './components/DeviceLegend'
import Joystick from './components/Joystick'
import { hotspots } from './data/hotspots'
import './App.css'

// Lapisan seret-untuk-menengok saat mode jalan first-person. Elemen DOM biasa
// (bukan di dalam canvas), jadi tidak akan bentrok dengan drei/OrbitControls.
function LookLayer({ lookDeltaRef }) {
  const dragging = useRef(false)
  const last = useRef({ x: 0, y: 0 })

  const onPointerDown = (e) => {
    dragging.current = true
    last.current = { x: e.clientX, y: e.clientY }
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e) => {
    if (!dragging.current) return
    const dx = e.clientX - last.current.x
    const dy = e.clientY - last.current.y
    last.current = { x: e.clientX, y: e.clientY }
    lookDeltaRef.current.x += dx
    lookDeltaRef.current.y += dy
  }
  const onPointerUp = () => {
    dragging.current = false
  }

  return (
    <div
      className="look-layer"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    />
  )
}

export default function App() {
  const [activeId, setActiveId] = useState(null)
  const [autoRotate, setAutoRotate] = useState(false)
  const [legendOpen, setLegendOpen] = useState(false)
  const [resetToken, setResetToken] = useState(0)
  const [interiorView, setInteriorView] = useState(false)
  const [garageOpen, setGarageOpen] = useState(false)

  const moveInputRef = useRef({ x: 0, y: 0 })
  const lookDeltaRef = useRef({ x: 0, y: 0 })

  const rawActiveHotspot = useMemo(
    () => hotspots.find((h) => h.id === activeId) ?? null,
    [activeId]
  )

  // Status "Pintu Garasi" bersifat dinamis (mengikuti garageOpen), jadi kita
  // timpa field status-nya di sini tanpa mengubah data statis di hotspots.js.
  const activeHotspot = useMemo(() => {
    if (!rawActiveHotspot) return null
    if (rawActiveHotspot.id === 'garage-door') {
      return {
        ...rawActiveHotspot,
        status: garageOpen ? 'Terbuka' : 'Tertutup',
        statusTone: garageOpen ? 'online' : 'locked',
      }
    }
    return rawActiveHotspot
  }, [rawActiveHotspot, garageOpen])

  const focusView = useMemo(() => {
    if (!activeHotspot || activeHotspot.zone !== 'exterior') return null
    return { camera: activeHotspot.camera, lookAt: activeHotspot.lookAt }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeHotspot, resetToken])

  const handleEnterHouse = useCallback(() => {
    setInteriorView(true)
    setActiveId(null)
    setLegendOpen(false)
  }, [])

  const handleExitHouse = useCallback(() => {
    setInteriorView(false)
    setActiveId(null)
  }, [])

  const handleToggleGarage = useCallback(() => {
    setGarageOpen((v) => !v)
  }, [])

  const handleAction = useCallback(
    (type) => {
      if (type === 'enter-house') handleEnterHouse()
      else if (type === 'toggle-garage') handleToggleGarage()
    },
    [handleEnterHouse, handleToggleGarage]
  )

  const handleSelect = useCallback((hotspot) => {
    if (hotspot.zone === 'interior') {
      setInteriorView(true)
    }
    setActiveId((current) => (current === hotspot.id ? current : hotspot.id))
    setLegendOpen(false)
  }, [])

  const handleClose = useCallback(() => setActiveId(null), [])

  const handleReset = useCallback(() => {
    setActiveId(null)
    setResetToken((t) => t + 1)
  }, [])

  // Kontrol keyboard (WASD / panah) — hanya aktif saat mode interior.
  useEffect(() => {
    if (!interiorView) return undefined
    const keys = new Set()
    const input = moveInputRef.current
    const update = () => {
      let x = 0
      let y = 0
      if (keys.has('KeyW') || keys.has('ArrowUp')) y -= 1
      if (keys.has('KeyS') || keys.has('ArrowDown')) y += 1
      if (keys.has('KeyA') || keys.has('ArrowLeft')) x -= 1
      if (keys.has('KeyD') || keys.has('ArrowRight')) x += 1
      input.x = x
      input.y = y
    }
    const onKeyDown = (e) => {
      keys.add(e.code)
      update()
    }
    const onKeyUp = (e) => {
      keys.delete(e.code)
      update()
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      input.x = 0
      input.y = 0
    }
  }, [interiorView])

  return (
    <div className="app">
      <Scene
        activeId={activeId}
        onSelect={handleSelect}
        autoRotate={autoRotate}
        focusView={focusView}
        interiorView={interiorView}
        garageOpen={garageOpen}
        moveInputRef={moveInputRef}
        lookDeltaRef={lookDeltaRef}
      />

      {interiorView && <LookLayer lookDeltaRef={lookDeltaRef} />}
      {interiorView && <div className="crosshair" aria-hidden="true" />}

      {/* Bingkai viewfinder */}
      <div className="frame" aria-hidden="true">
        <span className="frame__corner frame__corner--tl" />
        <span className="frame__corner frame__corner--tr" />
        <span className="frame__corner frame__corner--bl" />
        <span className="frame__corner frame__corner--br" />
      </div>

      {interiorView ? (
        <>
          <div className="hud-badge">
            <Footprints size={13} strokeWidth={2.4} />
            SEDANG DI DALAM RUMAH
          </div>
          <button type="button" className="hud-exit" onClick={handleExitHouse}>
            <LogOut size={16} strokeWidth={2.2} />
            <span>Keluar Rumah</span>
          </button>
          <Joystick moveInputRef={moveInputRef} />
          <p className="hint">
            <MousePointerClick size={13} strokeWidth={2.2} />
            Seret layar untuk menengok · Joystick / WASD untuk jalan · Ketuk titik untuk detail
          </p>
        </>
      ) : (
        <>
          <header className="hero">
            <p className="hero__eyebrow">
              <House size={13} strokeWidth={2.4} />
              DENAH INTERAKTIF · {hotspots.length} PERANGKAT PINTAR
            </p>
            <h1 className="hero__title">Rumah Pintar, Dijelaskan Titik demi Titik</h1>
            <p className="hero__subtitle">
              Putar model 3D, ketuk titik bernomor untuk detail, atau masuk ke dalam dan
              jalan-jalan langsung di ruang tamu, dapur, dan kamar mandi.
            </p>
          </header>

          <button
            type="button"
            className="legend-toggle"
            onClick={() => setLegendOpen(true)}
            aria-label="Buka daftar perangkat"
          >
            <Menu size={18} strokeWidth={2.2} />
          </button>

          <div className="controls">
            <button
              type="button"
              className={`controls__btn${autoRotate ? ' controls__btn--active' : ''}`}
              onClick={() => setAutoRotate((v) => !v)}
            >
              <Orbit size={15} strokeWidth={2.2} />
              <span>Putar Otomatis</span>
            </button>
            <button type="button" className="controls__btn" onClick={handleReset}>
              <RotateCcw size={15} strokeWidth={2.2} />
              <span>Reset Tampilan</span>
            </button>
            <button type="button" className="controls__btn controls__btn--enter" onClick={handleEnterHouse}>
              <Footprints size={15} strokeWidth={2.2} />
              <span>Masuk Rumah</span>
            </button>
          </div>

          <p className="hint">
            <MousePointerClick size={13} strokeWidth={2.2} />
            Seret untuk memutar · Gulir untuk zoom · Ketuk titik bernomor untuk detail
          </p>
        </>
      )}

      {!interiorView && (
        <DeviceLegend
          activeId={activeId}
          onSelect={handleSelect}
          isOpenMobile={legendOpen}
          onCloseMobile={() => setLegendOpen(false)}
        />
      )}
      {legendOpen && !interiorView && (
        <button
          type="button"
          className="legend-scrim"
          onClick={() => setLegendOpen(false)}
          aria-label="Tutup daftar perangkat"
        />
      )}

      <InfoPanel hotspot={activeHotspot} onClose={handleClose} onAction={handleAction} />
    </div>
  )
}
