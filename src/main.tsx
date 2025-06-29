import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import PassportRedirect from './components/PassportRedirect.tsx'
import { passportInstance } from './utils/passport.ts'
import { createWeb3Modal } from '@web3modal/ethers/react'
import { ethersConfig, mainnet, projectId } from './utils/config.ts'
import { PassportContextProvider } from './context/PassportContext.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App passportInstance={passportInstance} />,
  },
  {
    path: "/passport-redirect",
    element: <PassportRedirect passportInstance={passportInstance} />,
  },
]);

createWeb3Modal({
  ethersConfig,
  chains: [mainnet],
  projectId,
  enableAnalytics: true,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-border-radius-master': '1px'
  },
  allowUnsupportedChain: false
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PassportContextProvider>
      <RouterProvider router={router} />
    </PassportContextProvider>
  </React.StrictMode>,
)
