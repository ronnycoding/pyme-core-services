import React from 'react'

import { UserProvider } from './user'
import { AuthProvider } from './auth'

type StateProviderProps = {
  children: JSX.Element
}

export default function StateProvider({ children }: StateProviderProps) {
  return (
    <AuthProvider>
      <UserProvider>{children}</UserProvider>
    </AuthProvider>
  )
}
