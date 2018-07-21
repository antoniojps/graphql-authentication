import mongoose from 'mongoose'
import './config'

mongoose.Promise = global.Promise

export default function () {
  mongoose.connect(
    process.env.MONGODB_URI,
    { useNewUrlParser: true }
  )
}
