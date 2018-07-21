import 'babel-polyfill'
import request from 'supertest'
import setupDatabase from './../setup/database'
import setupExpress from './../setup/express'
import expect from 'expect'
import { populateUsers, usersTokens, defaultUsers } from './seed/seed'

// test server
function initTestApp () {
  setupDatabase()
  return setupExpress()
}

const app = initTestApp()

beforeEach(populateUsers)

describe('QUERIES', () => {
  describe('users', () => {
    const query = {
      query: `
      {
        users {
          email
        }
      }`,
    }

    it('should return all users', done => {
      request(app)
        .post('/graphql')
        .set('Authorization', `Bearer ${usersTokens[0]}`)
        .send(query)
        .expect(200)
        .expect(res => {
          expect(res.body.data.users.length).toBe(defaultUsers.length)
        })
        .end(done)
    })

    it('should return UNAUTHENTICATED if not authenticated', done => {
      request(app)
        .post('/graphql')
        .set('Authorization', `Bearer hello`)
        .send(query)
        .expect(200)
        .expect(res => {
          expect(res.body.errors[0].extensions.code).toBe('UNAUTHENTICATED')
        })
        .end(done)
    })
  })
})
