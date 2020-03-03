import { populateUsers } from './users'

export function populateDatabase () {
  return new Promise(async resolve => {
    await populateUsers()
    resolve()
  })
}
