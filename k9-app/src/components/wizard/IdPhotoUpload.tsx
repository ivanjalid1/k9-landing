import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'

interface IdPhotoUploadProps {
  value: string
  onChange: (dataURL: string) => void
  error?: string
}

const MAX_INPUT_BYTES = 25 * 1024 * 1024 // raw file from camera/gallery
const MAX_OUTPUT_BYTES = 4 * 1024 * 1024 // compressed JPEG (server accepts up to 10MB)
const MAX_DIMENSION = 1600

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => { URL.revokeObjectURL(url); resolve(img) }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('decode')) }
    img.src = url
  })
}

/** Downscale + re-encode as JPEG so uploads stay small (also strips EXIF metadata). */
async function compressImage(file: File): Promise<string> {
  const img = await loadImage(file)
  const scale = Math.min(1, MAX_DIMENSION / Math.max(img.naturalWidth, img.naturalHeight))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(img.naturalWidth * scale)
  canvas.height = Math.round(img.naturalHeight * scale)
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('canvas')
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

  let quality = 0.85
  let dataURL = canvas.toDataURL('image/jpeg', quality)
  // base64 is ~4/3 of the binary size
  while (dataURL.length * 0.75 > MAX_OUTPUT_BYTES && quality > 0.4) {
    quality -= 0.15
    dataURL = canvas.toDataURL('image/jpeg', quality)
  }
  return dataURL
}

export function IdPhotoUpload({ value, onChange, error }: IdPhotoUploadProps) {
  const cameraRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)
  const [processing, setProcessing] = useState(false)
  const [localError, setLocalError] = useState('')

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = '' // allow re-selecting the same file
    if (!file) return
    setLocalError('')
    if (!file.type.startsWith('image/')) {
      setLocalError('Please choose an image file (JPG or PNG).')
      return
    }
    if (file.size > MAX_INPUT_BYTES) {
      setLocalError('This image is too large. Please choose a smaller photo.')
      return
    }
    setProcessing(true)
    try {
      onChange(await compressImage(file))
    } catch {
      setLocalError('We could not read this image. Please try a JPG or PNG photo.')
    } finally {
      setProcessing(false)
    }
  }

  const shownError = localError || error

  return (
    <div className="mb-5">
      <label className="block text-[0.82rem] font-semibold text-warm-700 mb-1.5 tracking-wide">
        Photo ID<span className="text-red-500 ml-0.5">*</span>
      </label>
      <p className="text-[0.78rem] text-warm-500 mb-3">
        Take a photo or upload an image of a government-issued ID (e.g. driver's licence). It is only sent to K9 Movement with your application.
      </p>

      {/* Hidden inputs: one opens the camera on mobile, the other the gallery / file picker */}
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} data-testid="id-photo-camera" />
      <input ref={galleryRef} type="file" accept="image/*" className="hidden" onChange={handleFile} data-testid="id-photo-input" />

      {value ? (
        <div className="flex items-center gap-4 p-3 border-[1.5px] rounded-xl bg-forest-50/60 border-forest-600">
          <img src={value} alt="ID preview" className="w-24 h-16 object-cover rounded-md border border-warm-200 bg-white" />
          <div className="flex-1 min-w-0">
            <p className="text-[0.85rem] font-semibold text-forest-700">ID photo added ✓</p>
            <button
              type="button"
              onClick={() => onChange('')}
              className="text-[0.78rem] text-red-500 hover:text-red-700 transition-colors cursor-pointer"
            >
              Remove / replace
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5 max-sm:grid-cols-1">
          <button
            type="button"
            disabled={processing}
            onClick={() => cameraRef.current?.click()}
            className={`py-3 px-4 border-2 border-dashed rounded-xl text-[0.88rem] font-semibold transition-all duration-300 cursor-pointer disabled:opacity-60
              ${shownError ? 'border-red-400 bg-red-50 text-red-600' : 'border-forest-300 text-forest-600 hover:bg-forest-50 hover:border-forest-500'}`}
          >
            📷 Take Photo
          </button>
          <button
            type="button"
            disabled={processing}
            onClick={() => galleryRef.current?.click()}
            className={`py-3 px-4 border-2 border-dashed rounded-xl text-[0.88rem] font-semibold transition-all duration-300 cursor-pointer disabled:opacity-60
              ${shownError ? 'border-red-400 bg-red-50 text-red-600' : 'border-forest-300 text-forest-600 hover:bg-forest-50 hover:border-forest-500'}`}
          >
            🖼️ Choose from Gallery
          </button>
        </div>
      )}

      {processing && <p className="text-[0.78rem] text-warm-500 mt-2">Processing photo...</p>}
      {shownError && <p className="text-[0.78rem] text-red-500 mt-1">{shownError}</p>}
    </div>
  )
}
