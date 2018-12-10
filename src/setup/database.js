import mongoose from 'mongoose'
import './config'

mongoose.Promise = global.Promise

export default async function () {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI,
      { useNewUrlParser: true }
    )
  } catch (err) {
    console.log('Failed connection to MONGO DATABASE')
    console.error(err.message)
  }
}
