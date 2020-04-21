import React from 'react'
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'
// import { Redirect } from 'react-router-dom'
// import Grid from '@material-ui/core/Grid'
// import Box from '@material-ui/core/Box'

// import { useUser } from 'state/user'
// import TopBar from 'components/topbar'
import BaseLayout from 'components/base-layout'

export default function Profile() {
  // const { user, resetUser: handleLogout } = useUser()

  // const userIsLogged = Boolean(Object.keys(user).length)

  // if (!userIsLogged) return <Redirect to="/login" />

  return (
    <BaseLayout>
      <Container>
        <CssBaseline />
        {/* <TopBar isLogged={userIsLogged} handleLogout={handleLogout} /> */}
      </Container>
    </BaseLayout>
  )
}
