import { useEffect } from 'react'

interface ToastProps {
  message: string
  show: boolean
  onClose: () => void
}

export function Toast({ message, show, onClose }: ToastProps) {
  useEffect(() => {
    if (show) {
      const t = setTimeout(onClose, 4500)
      return () => clearTimeout(t)
    }
  }, [show, onClose])

  if (!show) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[1000]">
      <div className="bg-warm-800 text-white px-6 py-3 rounded-md text-[0.85rem] font-medium shadow-lg animate-toast-in">
        {message}
      </div>
    </div>
  )
}
