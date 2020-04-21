import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ApolloProvider } from '@apollo/react-hooks'

import apolloClient from 'config/apolloClient'
import GlobalThemeOverride from 'theme'
import StateProvider from 'state'

type AppProviderProps = {
  children: JSX.Element
}

export default function AppProvider({ children }: AppProviderProps) {
  return (
    <StateProvider>
      <ApolloProvider client={apolloClient}>
        <GlobalThemeOverride>
          <BrowserRouter>{children}</BrowserRouter>
        </GlobalThemeOverride>
      </ApolloProvider>
    </StateProvider>
  )
}
