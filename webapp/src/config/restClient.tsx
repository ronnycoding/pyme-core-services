import envConfig from './env'

const { csrfTokenApi } = envConfig

// withCredentials: true,
export default {
  baseURL: csrfTokenApi,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  }
}
