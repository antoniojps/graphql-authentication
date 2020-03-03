import mongoose from 'mongoose'
import './config'

mongoose.Promise = global.Promise

export default async function () {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 10000,
    })
  } catch (err) {
    console.log('Failed connection to MONGO DATABASE')
    console.error(err.message)
  }
}
