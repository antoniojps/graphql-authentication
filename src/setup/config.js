const env = process.env.NODE_ENV || 'development'

const configObj = {
  test: {
    PORT: 3000,
    MONGODB_URI: 'mongodb://localhost:27017/PubgAppTest',
    JWT_SECRET: 'ohthisissosecret123',
  },
  development: {
    PORT: 3000,
    MONGODB_URI: 'mongodb://localhost:27017/PubgApp',
    JWT_SECRET: 'ohthisisevenmoresecret',
  },
}

if (env === 'development' || env === 'test') {
  const config = configObj[env]
  Object.keys(config).forEach(key => {
    process.env[key] = config[key]
  })
}
