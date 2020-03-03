/*
  In order to connect to production server I had to add
  ?authSource=admin&w=1
  Read the issue:
  https://github.com/Automattic/mongoose/issues/4587#issuecomment-383306047
*/

import configObj from './config/config.json'

const env = process.env.NODE_ENV || 'production'
if (env === 'development' || env === 'test' || env === 'production') {
  const config = configObj[env]
  Object.keys(config).forEach(key => {
    process.env[key] = config[key]
  })
}
