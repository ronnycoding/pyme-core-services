import React, { createContext, useReducer, useMemo, useContext } from 'react'

type UserState = {
  user: {}
}

type UserContextProps = {
  state: UserState
  dispatch: ({ type, payload }: { type: string; payload?: object }) => void
}

const UserContext = createContext({} as UserContextProps)

function userReducer(state: UserState, action: { type: string; payload?: object }) {
  switch (action.type) {
    case 'SET_USER':
      return {
        user: {
          ...action.payload,
        },
      }
    case 'UPDATE_USER':
      return {
        user: {
          ...state.user,
          ...action.payload,
        },
      }
    case 'RESET':
      return {
        user: {},
      }
    default:
      throw new Error(`Unsupported action type: ${action.type}`)
  }
}

function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error(`useUser must be used within a CountProvider`)
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const [state, dispatch] = context
  const setUser = (user: object) => dispatch({ type: 'SET_USER', payload: { ...user } })
  const resetUser = () => dispatch({ type: 'RESET' })
  const { user } = state
  return {
    user,
    setUser,
    resetUser,
  }
}

function UserProvider(props: object) {
  const [state, dispatch] = useReducer(userReducer, { user: {} })
  const user = useMemo(() => [state, dispatch], [state])
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <UserContext.Provider value={user} {...props} />
}

export { UserProvider, useUser }
