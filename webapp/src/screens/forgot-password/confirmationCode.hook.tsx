/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { useState } from 'react'
import { useFormik } from 'formik'

export default function useConfirmationCode() {
  const [displayErrorConfirmationCode, setDisplayErrorConfirmationCode] = useState({ code: '', message: '' })
  const [redirectToLogin, setRedirectToLogin] = useState(false)
  const [disableConfirmationCodeSubmit, setDisableConfirmationCodeSubmit] = useState(false)
  const [displaySuccessConfirmationCode, setDisplaySuccessConfirmationCode] = useState('')

  function handleCleanError() {
    const { code = '' } = displayErrorConfirmationCode
    if (code === 'UserNotFoundException') {
      setRedirectToLogin(true)
    }
    setDisplayErrorConfirmationCode({ code: '', message: '' })
  }

  interface ForgotPasswordValidatorPros {
    confirmationCode: string
    email: string
    password: string
  }

  const forgotPasswordValidator = (values: ForgotPasswordValidatorPros) => {
    // eslint-disable-next-line prefer-const
    let errors = {}
    if (!values.confirmationCode) {
      // @ts-ignore
      errors.confirmationCode = 'El código de confirmación es requerido.'
    } else if (values.confirmationCode.length !== 6) {
      // @ts-ignore
      errors.confirmationCode = 'El código de confirmación debe ser de 6 digitos.'
    }

    if (!values.email) {
      // @ts-ignore
      errors.email = 'Correo Electrónico es requerido.'
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      // @ts-ignore
      errors.email = 'Correo Electrónico es invalido.'
    }

    if (!values.password) {
      // @ts-ignore
      errors.password = 'La contraseña es requerida.'
    } else if (values.password.length < 8) {
      // @ts-ignore
      errors.password = 'La contraseña debe tener mínimo 8 caracteres.'
    }

    return errors
  }

  const { handleChange, handleSubmit, handleReset, isSubmitting, isValid, values, errors, setFieldValue } = useFormik({
    validateOnChange: true,
    isInitialValid: false,
    validate: forgotPasswordValidator,
    initialValues: {
      password: '',
      confirmationCode: '',
      email: '',
    },
    // eslint-disable-next-line no-shadow
    onSubmit: async (values) => {
      const { email, confirmationCode, password } = values
      setDisableConfirmationCodeSubmit(true)
      console.log({ email, confirmationCode, password })

      try {
        // await Auth.forgotPasswordSubmit(email, confirmationCode, password)
        setDisplaySuccessConfirmationCode('contraseña actualizada con éxito.')
      } catch (err) {
        const { code, message } = err
        setDisplayErrorConfirmationCode({ code, message })
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

  function handleSuccessPasswordUpdated() {
    setRedirectToLogin(true)
  }

  return {
    handleConfirmationCodeChange: handleChange,
    handleConfirmationCodeReset: handleReset,
    handleConfirmationCode: handleSubmit,
    confirmationCodeIsSubmitting: isSubmitting,
    confirmationCodeIsValid: isValid,
    confirmationCodeValues: values,
    confirmationCodeErrors: errors,
    confirmationCodeSetFieldValue: setFieldValue,
    displayErrorConfirmationCode,
    handleCleanError,
    redirectToLogin,
    disableConfirmationCodeSubmit,
    displaySuccessConfirmationCode,
    handleSuccessPasswordUpdated,
  }
}
