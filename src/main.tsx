import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/index.css'
import Scaling from './component/Scaling.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Scaling />
  </StrictMode>,
)
