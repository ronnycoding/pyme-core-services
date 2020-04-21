import React, { useEffect, useState } from 'react'
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'

import ProfileCard from 'components/profile-card'
import TopBar from 'components/topbar'
import { useUser } from 'state/user'
import useFackeData from 'fake'
import BaseLayout from 'components/base-layout'

export default function Welcome() {
  const { getDataUsers } = useFackeData()

  const { user, resetUser: handleLogout } = useUser()

  const [dataUsers, setDataUsers] = useState([])

  // useEffect(() => {
  //   console.log({
  //     user,
  //     handleLogout,
  //   })
  // }, [user, handleLogout])

  useEffect(() => {
    if (!dataUsers.length) {
      getDataUsers(18).then(({ results }: any) => setDataUsers(results))
    }
  }, [getDataUsers, dataUsers])

  return (
    <BaseLayout>
      <Container>
        <CssBaseline />
        <TopBar isLogged={Boolean(Object.keys(user).length)} handleLogout={handleLogout} />
        <Box mt={2}>
          <Grid item xs={12}>
            <Grid container justify="center" spacing={1}>
              {dataUsers.map(({ login }: any) => (
                <ProfileCard key={login.uuid} image="https://www.petmd.com/sites/default/files/Acute-Dog-Diarrhea-47066074.jpg" />
              ))}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </BaseLayout>
  )
}
