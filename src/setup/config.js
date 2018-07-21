import configObj from './config/config.json'

const env = process.env.NODE_ENV || 'development'
if (env === 'development' || env === 'test') {
  const config = configObj[env]
  Object.keys(config).forEach(key => {
    process.env[key] = config[key]
  })
}
