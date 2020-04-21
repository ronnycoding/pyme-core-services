/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { useState } from 'react'
import { useFormik } from 'formik'

export default function useForgetPassword() {
  const [displayErrorForgotPassword, setDisplayErrorForgotPassword] = useState({ code: '', message: '' })
  const [redirectToLogin, setRedirectToLogin] = useState(false)
  const [displaySuccess, setDisplaySuccess] = useState('')
  const [enableConfirmationCode, setEnableConfirmationCode] = useState(false)

  function handleCleanError() {
    const { code = '' } = displayErrorForgotPassword
    if (code === 'UserNotFoundException') {
      setRedirectToLogin(true)
    }
    setDisplayErrorForgotPassword({ code: '', message: '' })
  }

  type ForgotPasswordValidator = {
    email: string
  }

  const forgotPasswordValidator = (values: ForgotPasswordValidator) => {
    // eslint-disable-next-line prefer-const
    let errors = {}
    if (!values.email) {
      // @ts-ignore
      errors.email = 'Correo Electrónico es requerido.'
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      // @ts-ignore
      errors.email = 'Correo Electrónico es invalido.'
    }

    return errors
  }

  const { handleChange, handleSubmit, handleReset, isSubmitting, isValid, values, errors } = useFormik({
    validateOnChange: true,
    isInitialValid: false,
    validate: forgotPasswordValidator,
    initialValues: {
      email: '',
    },
    // eslint-disable-next-line no-shadow
    onSubmit: async (values) => {
      const { email } = values

      try {
        // const recoveryPass = await Auth.forgotPassword(email)
        console.log(email)
        setEnableConfirmationCode(true)
        setDisplaySuccess(`Successfully`)
      } catch (err) {
        const { code, message } = err
        setDisplayErrorForgotPassword({ code, message })
        // if (err.code === 'UserNotConfirmedException') {
        //     // The error happens if the user didn't finish the confirmation step when signing up
        //     // In this case you need to resend the code and confirm the user
        //     // About how to resend the code and confirm the user, please check the signUp part
        // } else if (err.code === 'PasswordResetRequiredException') {
        //     // The error happens when the password is reset in the Cognito console
        //     // In this case you need to call forgotPassword to reset the password
        //     // Please check the Forgot Password part.
        // } else if (err.code === 'NotAuthorizedException') {
        //     // The error happens when the incorrect password is provided
        // } else if (err.code === 'UserNotFoundException') {
        //     // The error happens when the supplied username/email does not exist in the Cognito user pool
        // } else {
        //     console.log(err);
        // }
      }
    },
  })

  return {
    handleChange,
    handleSubmit,
    handleReset,
    isSubmitting,
    isValid,
    values,
    errors,
    displayErrorForgotPassword,
    handleCleanError,
    redirectToLogin,
    displaySuccess,
    enableConfirmationCode,
  }
}
