import appdynamics from 'appdynamics'

appdynamics.profile({
  controllerHostName: 'monroe202607241142452.saas.appdynamics.com',
  controllerPort: 443,
  controllerSslEnabled: true,
  accountName: 'monroe202607241142452',
  accountAccessKey: 'maud4p3xttqn',
  applicationName: 'qbamart frontweb',
  tierName: 'v1',
  nodeName: 'process',
})

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
)
