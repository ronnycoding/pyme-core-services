const ENV = {
  development: 'devEncryptionKey',
  staging: 'stageEncryptionKey',
  production: 'prodEncryptionKey',
}

function getEnvVars(env = '') {
  if (env === 'production') return ENV.production
  if (env === 'staging') return ENV.staging
  return ENV.development
}

export default getEnvVars(process.env.REACT_APP_STAGE)
