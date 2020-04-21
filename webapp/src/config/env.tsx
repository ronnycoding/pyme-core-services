const ENV = {
  development: {
    coreApi: {
      uri: 'https://api.consumopymecr.localhost/graphql/',
    },
    csrfTokenApi: 'https://api.consumopymecr.localhost/',
  },
  staging: {
    coreApi: {
      uri: 'https://api.consumopymecr.localhost/graphql/',
    },
    csrfTokenApi: 'https://api.consumopymecr.localhost/',
  },
  production: {
    coreApi: {
      uri: 'https://api.consumopymecr.localhost/graphql/',
    },
    csrfTokenApi: 'https://api.consumopymecr.localhost/',
  },
}

function getEnvVars(env = '') {
  if (env === 'production') return ENV.production
  if (env === 'staging') return ENV.staging
  return ENV.development
}

export default getEnvVars(process.env.REACT_APP_STAGE)
