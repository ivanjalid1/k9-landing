import React, { useRef, useEffect, useState, useCallback } from 'react'

interface SignaturePadProps {
  onSignatureChange: (dataURL: string) => void
}

export function SignaturePad({ onSignatureChange }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSigned, setHasSigned] = useState(false)
  const [isSigning, setIsSigning] = useState(false)
  const signatureDataRef = useRef('')

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const rect = container.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = 180 * dpr
    canvas.style.height = '180px'

    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.scale(dpr, dpr)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = '#1a3a2a'
    ctx.lineWidth = 2.5
  }, [])

  useEffect(() => {
    initCanvas()
    const handleResize = () => {
      // Save current signature before reinitializing
      if (signatureDataRef.current) {
        const savedData = signatureDataRef.current
        initCanvas()
        // Redraw saved signature at new dimensions
        const img = new Image()
        img.onload = () => {
          const canvas = canvasRef.current
          if (!canvas) return
          const ctx = canvas.getContext('2d')
          if (!ctx) return
          const dpr = window.devicePixelRatio || 1
          ctx.drawImage(img, 0, 0, canvas.width / dpr, canvas.height / dpr)
        }
        img.src = savedData
      } else {
        initCanvas()
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [initCanvas])

  const getPos = (e: any) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    const touch = e.touches ? e.touches[0] : e
    return { x: touch.clientX - rect.left, y: touch.clientY - rect.top }
  }

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    const canvas = canvasRef.current
    if (!canvas) return
    setIsDrawing(true)
    setIsSigning(true)
    const pos = getPos(e)
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return
    e.preventDefault()
    const canvas = canvasRef.current
    if (!canvas) return
    const pos = getPos(e)
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
    if (!hasSigned) setHasSigned(true)
  }

  const stopDraw = () => {
    setIsDrawing(false)
    setIsSigning(false)
    if (hasSigned && canvasRef.current) {
      const dataURL = canvasRef.current.toDataURL()
      signatureDataRef.current = dataURL
      onSignatureChange(dataURL)
    }
  }

  const clear = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasSigned(false)
    signatureDataRef.current = ''
    onSignatureChange('')
    initCanvas()
  }

  return (
    <div className="my-5">
      <label className="block text-[0.82rem] font-semibold text-warm-700 mb-2">
        Signature <span className="text-red-500">*</span>
      </label>

      <div
        ref={containerRef}
        className={`relative overflow-hidden rounded-xl transition-all duration-300
          ${isSigning
            ? 'border-2 border-forest-600 border-solid shadow-[0_0_0_3px_rgba(26,58,42,0.1)]'
            : 'border-2 border-dashed border-warm-300'
          }`}
      >
        <canvas
          ref={canvasRef}
          className="w-full block signature-canvas"
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
        />

        {/* Placeholder */}
        {!hasSigned && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-300">
            <svg className="w-9 h-9 text-warm-300 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
            </svg>
            <span className="text-[0.82rem] text-warm-400 font-medium">Draw your signature here</span>
          </div>
        )}
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={clear}
          className="px-4 py-2 text-[0.82rem] bg-transparent text-warm-500 hover:text-red-500 cursor-pointer transition-colors duration-300 font-[var(--font-body)] font-semibold border-none"
        >
          Clear Signature
        </button>
      </div>
    </div>
  )
}
