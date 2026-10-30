// Form-only entry (form.k9movement.com). Renders the intake wizard at "/"
// and never imports the landing pages, so they are excluded from the bundle.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { IntakeApp } from './IntakeApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <IntakeApp />
  </StrictMode>,
)
