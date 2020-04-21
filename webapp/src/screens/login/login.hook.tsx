/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { useState } from 'react'
import { useFormik } from 'formik'

// import { useUser } from 'state/user'
// TODO: implement set token
// import { useAuth } from 'state/auth'

export default function useLogin() {
  // const { setUser } = useUser()
  // const { setAuth } = useAuth()
  const [displayError, setDisplayError] = useState({ code: '', message: '' })
  const [redirectToSignUp, setRedirectToSignUp] = useState(false)

  type LoginValidatorProps = {
    email: string
    password: string
  }

  const loginValidator = (values: LoginValidatorProps) => {
    // eslint-disable-next-line prefer-const
    let errors = {}
    if (!values.email) {
      // @ts-ignore
      errors.email = 'Correo Electrónico es requerido'
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      // @ts-ignore
      errors.email = 'Correo Electrónico es invalido'
    }

    if (!values.password) {
      // @ts-ignore
      errors.password = 'Contraseña es requerida'
    }

    return errors
  }

  function handleCleanError() {
    const { code = '' } = displayError
    if (code === 'UserNotFoundException') {
      setRedirectToSignUp(true)
    }
    setDisplayError({ code: '', message: '' })
  }

  const { handleChange, handleSubmit, handleReset, isSubmitting, isValid, values, errors } = useFormik({
    validateOnChange: true,
    isInitialValid: false,
    validate: loginValidator,
    initialValues: {
      password: '',
      email: '',
    },
    // eslint-disable-next-line no-shadow
    onSubmit: async (values) => {
      console.log(values)
      // const { email, password } = values

      try {
        // const user = await Auth.signIn(email, password)
        // const { attributes } = { email, password }
        // setUser({ email, password })
      } catch (err) {
        const { code, message } = err
        setDisplayError({ code, message })
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
    displayError,
    handleCleanError,
    redirectToSignUp,
  }
}
