/* eslint-disable @typescript-eslint/ban-ts-ignore */
import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
// import Input from '@material-ui/core/Input'
import Grid from '@material-ui/core/Grid'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import FormHelperText from '@material-ui/core/FormHelperText'
// @ts-ignore
import ReactCodeInput from 'react-code-input'
import { Link, Redirect } from 'react-router-dom'

import SnackBarNotification from 'components/snackbar-notification'
import Copyright from 'components/copyright'
import BaseLayout from 'components/base-layout'
// import { useUser } from 'state/user'

// import 'react-phone-input-2/lib/material.css'
import 'react-phone-input-2/lib/style.css'
import './signup.css'

import useSignUp from './signup.hook'

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 2,
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

export default function SignUp() {
  const classes = useStyles()
  const {
    isSubmitting,
    isValid,
    errors,
    handleChange,
    values,
    handleSignUp,
    isEnableConfirmationCode,
    setConfirmationCode,
    displayError,
    handleCleanError,
    displaySuccess,
    handleAccountCreatedSuccessfully,
    redirectToLogin,
  } = useSignUp()

  // const { user } = useUser()

  // if (Object.keys(user).length) return <Redirect to="/home" />

  if (redirectToLogin) return <Redirect to="/login" />

  return (
    <BaseLayout>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Registrate
          </Typography>
          <form className={classes.form} noValidate onSubmit={handleSignUp}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="fname"
                  name="firstName"
                  variant="outlined"
                  required
                  fullWidth
                  id="firstName"
                  label="Nombre"
                  autoFocus
                  value={values.firstName}
                  onChange={handleChange}
                  error={Boolean(errors.firstName)}
                  helperText={errors.firstName}
                  disabled={isEnableConfirmationCode}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="lastName"
                  label="Apellido"
                  name="lastName"
                  autoComplete="lname"
                  value={values.lastName}
                  onChange={handleChange}
                  error={Boolean(errors.lastName)}
                  helperText={errors.lastName}
                  disabled={isEnableConfirmationCode}
                />
              </Grid>
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
                  disabled={isEnableConfirmationCode}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Contraseña"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={handleChange}
                  value={values.password}
                  error={Boolean(errors.password)}
                  helperText={errors.password}
                  disabled={isEnableConfirmationCode}
                />
              </Grid>
              {isEnableConfirmationCode && (
                <Grid item xs={12}>
                  <ReactCodeInput type="number" fields={6} onChange={setConfirmationCode} />
                  <FormHelperText variant="outlined">Ingresa tu código de confirmación.</FormHelperText>
                </Grid>
              )}
            </Grid>
            {!isEnableConfirmationCode && (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={!isValid || isSubmitting}
              >
                Registrate
              </Button>
            )}
            <Grid container justify="flex-end">
              <Grid item>
                <Link to="/login">¿Ya tienes una contraseña? haz click aquí</Link>
              </Grid>
            </Grid>
          </form>
        </div>
        {displayError.message !== '' && (
          <SnackBarNotification variant="error" message={displayError.message} onCloseNotification={handleCleanError} />
        )}
        {displaySuccess && (
          <SnackBarNotification
            variant="success"
            message="Account Created Successfully"
            onCloseNotification={handleAccountCreatedSuccessfully}
          />
        )}
        <Copyright />
      </Container>
    </BaseLayout>
  )
}
