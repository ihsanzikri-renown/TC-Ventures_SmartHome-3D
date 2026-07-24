import { useRef } from 'react'

const MAX_RADIUS = 40

export default function Joystick({ moveInputRef }) {
  const baseRef = useRef(null)
  const knobRef = useRef(null)
  const dragging = useRef(false)
  const originRef = useRef({ x: 0, y: 0 })

  const setKnob = (dx, dy) => {
    if (knobRef.current) {
      knobRef.current.style.transform = `translate(${dx}px, ${dy}px)`
    }
  }

  const updateFromPoint = (clientX, clientY) => {
    let dx = clientX - originRef.current.x
    let dy = clientY - originRef.current.y
    const dist = Math.hypot(dx, dy)
    if (dist > MAX_RADIUS) {
      dx = (dx / dist) * MAX_RADIUS
      dy = (dy / dist) * MAX_RADIUS
    }
    setKnob(dx, dy)
    if (moveInputRef?.current) {
      moveInputRef.current.x = dx / MAX_RADIUS
      moveInputRef.current.y = dy / MAX_RADIUS
    }
  }

  const handlePointerDown = (e) => {
    e.stopPropagation()
    dragging.current = true
    const rect = baseRef.current.getBoundingClientRect()
    originRef.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
    e.currentTarget.setPointerCapture?.(e.pointerId)
    updateFromPoint(e.clientX, e.clientY)
  }

  const handlePointerMove = (e) => {
    if (!dragging.current) return
    e.stopPropagation()
    updateFromPoint(e.clientX, e.clientY)
  }

  const stop = (e) => {
    e.stopPropagation()
    dragging.current = false
    setKnob(0, 0)
    if (moveInputRef?.current) {
      moveInputRef.current.x = 0
      moveInputRef.current.y = 0
    }
  }

  return (
    <div
      ref={baseRef}
      className="joystick"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
    >
      <div ref={knobRef} className="joystick__knob" />
    </div>
  )
}
