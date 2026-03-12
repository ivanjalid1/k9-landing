// ═══ K9 MOVEMENT — PHP Email Service ═══
// Posts form data to api/send.php on your hosting.
// No third-party dependencies. No limits.

// In production, this should point to your PHP hosting URL
const API_URL = import.meta.env.VITE_API_URL || '/api/send.php'

export async function sendApplication(formData: Record<string, any>): Promise<{ success: boolean; ref?: string; demo?: boolean; error?: string }> {
  // Dev mode — if no PHP backend available, log and simulate
  const isDev = window.location.hostname === 'localhost'

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    if (res.ok) {
      const result = await res.json()
      return { success: true, ref: result.ref }
    }

    // If PHP endpoint not reachable in dev, fall back to demo
    if (isDev) {
      console.log('📧 PHP backend not available — demo mode')
      console.log('Form data that would be sent:')
      console.log(JSON.stringify(formData, null, 2))
      const ref = 'K9M-' + Date.now().toString(36).toUpperCase().slice(-6)
      return { success: true, ref, demo: true }
    }

    return { success: false, error: 'Server error' }
  } catch (err) {
    // Network error — in dev, simulate success
    if (isDev) {
      console.log('📧 PHP backend not available — demo mode')
      console.log('Form data that would be sent:')
      console.log(JSON.stringify(formData, null, 2))
      const ref = 'K9M-' + Date.now().toString(36).toUpperCase().slice(-6)
      return { success: true, ref, demo: true }
    }

    console.error('Send error:', err)
    return { success: false, error: 'Connection failed' }
  }
}
