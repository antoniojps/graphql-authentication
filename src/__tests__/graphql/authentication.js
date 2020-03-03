import request from 'supertest'
import { usersTokens, defaultUsers } from './seed/users'

export function runAuthenticationTests (app) {
  describe('authentication', () => {
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

        test('should return current user', done => {
          request(app)
            .post('/graphql')
            .set('Cookie', `token=${usersTokens.normal}; HttpOnly`)
            .send(CURRENT_USER)
            .expect(200)
            .expect(res => {
              expect(res.body.data.currentUser.email).toBe(
                defaultUsers.normal.email
              )
            })
            .end(done)
        })

        test('should return all users if admin', done => {
          request(app)
            .post('/graphql')
            .set('Cookie', `token=${usersTokens.admin}; HttpOnly`)
            .send(USERS)
            .expect(200)
            .expect(res => {
              expect(res.body.data.users.length).toBe(
                Object.keys(defaultUsers).length
              )
            })
            .end(done)
        })

        test('should return FORBIDDEN if not admin', done => {
          request(app)
            .post('/graphql')
            .set('Cookie', `token=${usersTokens.normal}; HttpOnly`)
            .send(USERS)
            .expect(200)
            .expect(res => {
              expect(res.body.errors[0].extensions.code).toBe('FORBIDDEN')
            })
            .end(done)
        })

        test('should return UNAUTHENTICATED if not logged in', done => {
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

      describe('user', () => {
        const USER = {
          query: `query user($id: ID!) {
         user(id: $id) {
          _id
          email
        }
      }`,
          variables: `{"id": "${defaultUsers.normal._id}"}`,
        }
        test('should return user to admin', done => {
          request(app)
            .post('/graphql')
            .set('Cookie', `token=${usersTokens.admin}; HttpOnly`)
            .send(USER)
            .expect(200)
            .expect(res => {
              expect(res.body.data.user._id).toBe(
                defaultUsers.normal._id.toHexString()
              )
              expect(res.body.data.user.email).toBe(defaultUsers.normal.email)
            })
            .end(done)
        })
        test('should return user to moderator', done => {
          request(app)
            .post('/graphql')
            .set('Cookie', `token=${usersTokens.moderator}; HttpOnly`)
            .send(USER)
            .expect(200)
            .expect(res => {
              expect(res.body.data.user._id).toBe(
                defaultUsers.normal._id.toHexString()
              )
              expect(res.body.data.user.email).toBe(defaultUsers.normal.email)
            })
            .end(done)
        })
        test('should return user to owner', done => {
          request(app)
            .post('/graphql')
            .set('Cookie', `token=${usersTokens.normal}; HttpOnly`)
            .send(USER)
            .expect(200)
            .expect(res => {
              expect(res.body.data.user._id).toBe(
                defaultUsers.normal._id.toHexString()
              )
              expect(res.body.data.user.email).toBe(defaultUsers.normal.email)
            })
            .end(done)
        })
        test('should return NULL email to other user', done => {
          request(app)
            .post('/graphql')
            .set('Cookie', `token=${usersTokens[3]}; HttpOnly`)
            .send(USER)
            .expect(200)
            .expect(res => {
              expect(res.body.data.user._id).toBe(
                defaultUsers.normal._id.toHexString()
              )
              expect(res.body.data.user.email).toBeFalsy()
            })
            .end(done)
        })
        test('should return NULL email to public', done => {
          request(app)
            .post('/graphql')
            .send(USER)
            .expect(200)
            .expect(res => {
              expect(res.body.data.user._id).toBe(
                defaultUsers.normal._id.toHexString()
              )
              expect(res.body.data.user.email).toBeFalsy()
            })
            .end(done)
        })
      })
    })
  })
}
