/* eslint-disable @typescript-eslint/ban-ts-ignore */
import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
// import * as MaterialLink from '@material-ui/core/Link'
import { Link, Redirect } from 'react-router-dom'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import SnackBarNotification from 'components/snackbar-notification'
import Copyright from 'components/copyright'
import BaseLayout from 'components/base-layout'
// import { useUser } from 'state/user'

import useLogin from './login.hook'

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundColor: theme.palette.type === 'dark' ? theme.palette.grey[900] : theme.palette.grey[50],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

export default function SignInSide() {
  const classes = useStyles()
  const {
    handleChange,
    handleSubmit,
    // handleReset,
    isSubmitting,
    isValid,
    values,
    errors,
    displayError,
    handleCleanError,
    redirectToSignUp,
  } = useLogin()

  // const { user } = useUser()

  // if (Object.keys(user).length > 0) return <Redirect to="/home" />

  if (redirectToSignUp) return <Redirect to="/signUp" />

  return (
    <BaseLayout>
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} className={classes.image} />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Ingresar
            </Typography>
            <form className={classes.form} noValidate onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    label="Correo Electrónico"
                    name="email"
                    autoComplete="email"
                    value={values.email}
                    onChange={handleChange}
                    error={Boolean(errors.email)}
                    helperText={errors.email}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    onChange={handleChange}
                    error={Boolean(errors.password)}
                    helperText={errors.password}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={!isValid || isSubmitting}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
                </Grid>
                <Grid item>
                  <Link to="/signup">¿No tienes una contraseña? haz click aquí</Link>
                </Grid>
              </Grid>
              {displayError.message !== '' && (
                <SnackBarNotification variant="error" message={displayError.message} onCloseNotification={handleCleanError} />
              )}
              <Copyright />
            </form>
          </div>
        </Grid>
      </Grid>
    </BaseLayout>
  )
}
