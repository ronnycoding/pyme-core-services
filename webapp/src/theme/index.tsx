import React from 'react'
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles'

const theme = createMuiTheme({
  overrides: {
    MuiButton: {
      root: {
        fontSize: '1rem',
      },
    },
  },
})

interface GlobalThemeOverride {
  children: JSX.Element
}

export default function GlobalThemeOverride({ children }: GlobalThemeOverride) {
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  )
}