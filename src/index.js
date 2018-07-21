import setupDatabase from './setup/database'
import setupExpress from './setup/express'

function main () {
  setupDatabase()
  setupExpress()
}

main()
