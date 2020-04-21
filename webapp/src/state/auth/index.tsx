import React, { createContext, useReducer, useContext } from 'react'

type AuthTokenProps = {
  token: string
}
type AuthContextProps = {
  state: AuthTokenProps
  dispatch: ({ type, payload }: { type: string; payload?: string }) => void
}

type ActionProps = {
  payload?: string
  type: string
}

const AuthContext = createContext({} as AuthContextProps)

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
function authReducer(state: AuthTokenProps, action: ActionProps) {
  switch (action.type) {
    case 'SET_TOKEN':
      return {
        token: action.payload,
      }
    case 'RESET':
      return {
        token: '',
      }
    default:
      throw new Error(`Unsupported action type: ${action.type}`)
  }
}

function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error(`useAuth must be used within a CountProvider`)
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const [state, dispatch] = context
  const setAuth = (token: string) => dispatch({ type: 'SET_TOKEN', payload: token })
  const resetAuth = () => dispatch({ type: 'RESET' })
  const { token } = state
  return {
    token,
    setAuth,
    resetAuth,
  }
}

function AuthProvider(props: object) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const [state, dispatch] = useReducer(authReducer, { token: '' })
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <AuthContext.Provider value={[state, dispatch]} {...props} />
}

export { AuthProvider, useAuth }
