/* eslint-disable @typescript-eslint/ban-ts-ignore */
import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
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

import 'react-phone-input-2/lib/style.css'
import './forgotpassword.css'

import useForgetPassword from './forgotPassword.hook'
import useConfirmationCode from './confirmationCode.hook'

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

export default function ForgotPasswordScreen() {
  const classes = useStyles()
  // @ts-ignore
  const {
    handleChange,
    handleSubmit,
    isSubmitting,
    isValid,
    values,
    errors,
    displayErrorForgotPassword,
    handleCleanError,
    redirectToLogin,
    displaySuccess,
    enableConfirmationCode,
  } = useForgetPassword()

  const {
    handleConfirmationCodeChange,
    confirmationCodeValues,
    confirmationCodeErrors,
    confirmationCodeSetFieldValue,
    handleConfirmationCode,
    disableConfirmationCodeSubmit,
    displayErrorConfirmationCode,
    displaySuccessConfirmationCode,
    handleSuccessPasswordUpdated,
    redirectToLogin: redirectToLoginConfirmationCode,
  } = useConfirmationCode()

  // const { user } = useUser()

  // if (Object.keys(user).length) return <Redirect to="/home" />

  if (redirectToLogin || redirectToLoginConfirmationCode) return <Redirect to="/login" />

  const handleSetEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e.target.value)
    handleConfirmationCodeChange(e.target.value)
  }

  return (
    <BaseLayout>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Recuperar Contraseña
          </Typography>
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <Grid>
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
                  onChange={handleSetEmail}
                  error={Boolean(errors.email)}
                  helperText={errors.email}
                  disabled={enableConfirmationCode}
                />
              </Grid>
              {enableConfirmationCode && (
                <Grid item xs={12}>
                  <ReactCodeInput
                    type="number"
                    fields={6}
                    onChange={(valConfirmationCode: string) =>
                      confirmationCodeSetFieldValue('confirmationCode', valConfirmationCode)
                    }
                    disabled={disableConfirmationCodeSubmit}
                  />
                  <FormHelperText variant="outlined">Enter your confirmation code</FormHelperText>
                  {confirmationCodeErrors.confirmationCode && (
                    <FormHelperText error variant="outlined">
                      {confirmationCodeErrors.confirmationCode}
                    </FormHelperText>
                  )}
                </Grid>
              )}
              {confirmationCodeValues.confirmationCode.length === 6 && (
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="new-password"
                    label="New Password"
                    type="password"
                    id="new-password"
                    autoComplete="new-password"
                    value={confirmationCodeValues.password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => confirmationCodeSetFieldValue('password', e.target.value)}
                    disabled={disableConfirmationCodeSubmit}
                  />
                  {confirmationCodeErrors.password && (
                    <FormHelperText error variant="outlined">
                      {confirmationCodeErrors.password}
                    </FormHelperText>
                  )}
                </Grid>
              )}
            </Grid>
            {enableConfirmationCode ? (
              <Button
                type="button"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={() => handleConfirmationCode()}
                disabled={disableConfirmationCodeSubmit}
              >
                Enviar código de confirmación
              </Button>
            ) : (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={!isValid || isSubmitting}
              >
                Recuperar contraseña
              </Button>
            )}
            <Grid container justify="flex-end">
              <Grid item>
                <Link to="/login">¿Ya tienes una cuenta? haz click aquí</Link>
              </Grid>
            </Grid>
          </form>
        </div>
        {displayErrorConfirmationCode.message !== '' && (
          <SnackBarNotification variant="error" message={displayErrorConfirmationCode.message} />
        )}
        {displayErrorForgotPassword.message !== '' && (
          <SnackBarNotification
            variant="error"
            message={displayErrorForgotPassword.message}
            onCloseNotification={handleCleanError}
          />
        )}
        {displaySuccess !== '' && <SnackBarNotification variant="success" message={displaySuccess} />}
        {displaySuccessConfirmationCode !== '' && (
          <SnackBarNotification
            variant="success"
            message={displaySuccessConfirmationCode}
            onCloseNotification={handleSuccessPasswordUpdated}
          />
        )}
        <Copyright />
      </Container>
    </BaseLayout>
  )
}
