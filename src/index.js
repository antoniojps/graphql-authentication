import setupDatabase from './setup/database'
import setupPassport from './setup/passport'
import setupExpress from './setup/express'

function main () {
  setupDatabase()
  setupPassport()
  setupExpress()
}

main()
