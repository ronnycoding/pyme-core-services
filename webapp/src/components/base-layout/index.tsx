import React, { useEffect } from 'react'
import axios from 'axios'

import { useAuth } from 'state/auth'
import axiosConfig from 'config/restClient'

type AppProviderProps = {
  children: JSX.Element
}

export default function BaseLayout({ children }: AppProviderProps) {
  const { token, setAuth } = useAuth()

  useEffect(() => {
    if (!token) {
      axios.get(`csrf/`, axiosConfig).then((data) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        const { token: tokenCsrf } = data.data
        localStorage.setItem('csrftoken', tokenCsrf)
        // handle success
        setAuth(tokenCsrf)
      })
    }
  }, [setAuth, token])
  return <div>{children}</div>
}
