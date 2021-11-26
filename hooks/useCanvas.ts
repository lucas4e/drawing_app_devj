import * as React from 'react'
import { Linecap } from '../models/Linecap'

export function useCanvas(canvas: HTMLElement) {
  const [ctx, setCtx] = React.useState<CanvasRenderingContext2D | null>(null)
  const [isDrawing, setIsDrawing] = React.useState(false)
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 })
  const [lineWidth, setLineWidth] = React.useState(5)
  const [lineCap, setLineCap] = React.useState<Linecap>('round')
  const [strokeStyle, setStrokeStyle] = React.useState('#c0392b')

  React.useEffect(() => {
    setCtx((canvas as HTMLCanvasElement)?.getContext('2d'))
  }, [canvas])

  canvas?.addEventListener('mousemove', draw)
  canvas?.addEventListener('mousedown', startDrawing)
  canvas?.addEventListener('mouseenter', stopDrawing)

  function setPosition(e: { clientX: number; clientY: number }) {
    setMousePosition({ x: e.clientX, y: e.clientY })
  }

  function draw(event: { clientX: number; clientY: number }) {
    if (!isDrawing) return
    ctx?.lineTo(event.clientX, event.clientY)
    ctx?.stroke()
  }

  function startDrawing(event: { clientX: number; clientY: number }) {
    setIsDrawing(true)
    ctx?.beginPath()
    ctx?.moveTo(event.clientX, event.clientY)
  }

  function stopDrawing() {
    setIsDrawing(false)
  }
}
