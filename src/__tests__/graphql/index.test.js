import setupDatabase from '../../setup/database'
import setupExpress from '../../setup/express'
import { runAuthenticationTests } from './authentication'

import { populateDatabase } from './seed'

// start test server
function initTestApp () {
  setupDatabase()
  return setupExpress()
}

const { app, expressServer } = initTestApp()

function runTests (app, expressServer) {
  beforeEach(populateDatabase)
  afterAll(() => {
    expressServer.close()
    console.log('Closed test server')
  })
  describe('GraphQL', () => {
    // add graphql tests here
    runAuthenticationTests(app)
  })
}

runTests(app, expressServer)
