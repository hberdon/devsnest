import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/design-system/tokens.css'
import '@/design-system/base.css'
import { ThemeProvider } from '@/store/theme.context'
import { DevToolsProvider } from '@/store/devtools.context'
import { CmdKProvider } from '@/store/cmd-palette.context'
import { Router } from '@/router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <DevToolsProvider>
        <CmdKProvider>
          <Router />
        </CmdKProvider>
      </DevToolsProvider>
    </ThemeProvider>
  </StrictMode>,
)
