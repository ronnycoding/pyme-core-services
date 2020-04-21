/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import { useMutation } from '@apollo/react-hooks'

// import { useAuth } from 'state/auth'

import { CREATE_USER_BY_EMAIL } from './singup.graphql'

interface SingUpByEmailProps {
  firstName: string
  lastName: string
  email: string
  password: string
}

export default function useSignUp() {
  // const { setAuth } = useAuth()
  const [isEnableConfirmationCode, setIsEnableConfirmationCode] = useState(false)
  const [confirmationCode, setConfirmationCode] = useState('')
  const [displayError, setDisplayError] = useState({ code: '', message: '' })
  const [displaySuccess, setDisplaySuccess] = useState(false)
  const [redirectToLogin, setRedirectToLogin] = useState(false)

  // SignUp state
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [signUpByEmail, { error: signUpByEmailError, data: signUpByEmailData }] = useMutation<
    SingUpByEmailProps,
    SingUpByEmailProps
  >(CREATE_USER_BY_EMAIL, {
    variables: {
      firstName,
      lastName,
      email,
      password,
    },
  })

  interface SignUpValidatorProps {
    firstName: string
    lastName: string
    password: string
    email: string
  }

  const signUpValidator = (values: SignUpValidatorProps) => {
    // eslint-disable-next-line prefer-const
    let errors = {}
    if (!values.email) {
      // @ts-ignore
      errors.email = 'Correo Electrónico requerido.'
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      // @ts-ignore
      errors.email = 'Correo Electrónico invalido.'
    }

    if (!values.firstName) {
      // @ts-ignore
      errors.firstName = 'Nombre es requerido.'
    }

    if (!values.lastName) {
      // @ts-ignore
      errors.lastName = 'Apellido es requerido.'
    }

    if (!values.password) {
      // @ts-ignore
      errors.password = 'la contraseña es requerida.'
    } else if (values.password.length < 8) {
      // @ts-ignore
      errors.password = 'la contraseña debe tener un mínimo de 8 caracteres.'
    }

    return errors
  }

  const { handleChange, handleSubmit, handleReset, isSubmitting, isValid, values, errors } = useFormik({
    validateOnChange: true,
    isInitialValid: false,
    validate: signUpValidator,
    initialValues: {
      firstName: '',
      lastName: '',
      password: '',
      email: '',
    },
    // eslint-disable-next-line no-shadow
    onSubmit: async (values) => {
      // eslint-disable-next-line no-shadow
      const { firstName, lastName, password, email } = values

      try {
        setFirstName(firstName)
        setLastName(lastName)
        setEmail(email)
        setPassword(password)
        const result = signUpByEmail({ variables: { firstName, lastName, password, email } })
        console.log({ result })
        setIsEnableConfirmationCode(true)
      } catch (err) {
        const { code = '500', message } = err
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

  // await Auth.resendSignUp(username).then(() => {
  //   console.log('code resent successfully')
  //   setIsEnableConfirmationCode(true)
  // })

  function handleCleanError() {
    const { code = '' } = displayError
    if (code === 'UsernameExistsException') {
      setRedirectToLogin(true)
    }
    setDisplayError({ code: '', message: '' })
  }

  function handleSetErrorConfirmationCode(code: string, message: string) {
    setConfirmationCode('')
    setDisplayError({ code, message })
  }

  function handleConfirmationCode() {
    setDisplaySuccess(true)
  }

  function handleAccountCreatedSuccessfully() {
    setRedirectToLogin(true)
  }

  useEffect(() => {
    if (confirmationCode.length === 6) {
      // eslint-disable-next-line no-shadow
      const { email } = values
      console.log(email)
      // Auth.confirmSignUp(email, confirmationCode, {
      //   // Optional. Force user confirmation irrespective of existing alias. By default set to True.
      //   forceAliasCreation: true,
      // })
      //   .then(handleConfirmationCode)
      //   .catch(({ code, message }) => handleSetErrorConfirmationCode(code, message))
      try {
        handleConfirmationCode()
      } catch (error) {
        handleSetErrorConfirmationCode('234', 'error')
      }
    }
  }, [confirmationCode, values])

  useEffect(() => {
    if (signUpByEmailError) {
      console.log({
        signUpByEmailError,
      })
    }
  }, [signUpByEmailError])

  useEffect(() => {
    if (signUpByEmailData) {
      console.log(signUpByEmailData)
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      // const { token } = signUpByEmailData
      // setAuth(token)
    }
  }, [signUpByEmailData])

  return {
    values,
    handleChange,
    handleReset,
    isSubmitting,
    isValid,
    errors,
    handleSignUp: handleSubmit,
    handleAccountCreatedSuccessfully,
    isEnableConfirmationCode,
    setConfirmationCode,
    displayError,
    handleCleanError,
    displaySuccess,
    redirectToLogin,
  }
}
