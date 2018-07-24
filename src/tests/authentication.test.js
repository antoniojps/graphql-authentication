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
    const USERS = {
      query: `
      {
        users {
          email
        }
      }`,
    }

    const CURRENT_USER = {
      query: `
      {
        currentUser {
          email
        }
      }`,
    }

    it('should return current user', done => {
      request(app)
        .post('/graphql')
        .set('Cookie', `token=${usersTokens[1]}; HttpOnly`)
        .send(CURRENT_USER)
        .expect(200)
        .expect(res => {
          expect(res.body.data.currentUser.email).toBe(defaultUsers[1].email)
        })
        .end(done)
    })

    it('should return all users if admin', done => {
      request(app)
        .post('/graphql')
        .set('Cookie', `token=${usersTokens[0]}; HttpOnly`)
        .send(USERS)
        .expect(200)
        .expect(res => {
          expect(res.body.data.users.length).toBe(defaultUsers.length)
        })
        .end(done)
    })

    it('should return FORBIDDEN if not admin', done => {
      request(app)
        .post('/graphql')
        .set('Cookie', `token=${usersTokens[1]}; HttpOnly`)
        .send(USERS)
        .expect(200)
        .expect(res => {
          expect(res.body.errors[0].extensions.code).toBe('FORBIDDEN')
        })
        .end(done)
    })

    it('should return UNAUTHENTICATED if not logged in', done => {
      request(app)
        .post('/graphql')
        .send(USERS)
        .expect(200)
        .expect(res => {
          expect(res.body.errors[0].extensions.code).toBe('UNAUTHENTICATED')
        })
        .end(done)
    })
  })
})
