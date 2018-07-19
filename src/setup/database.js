import mongoose from 'mongoose'

mongoose.Promise = global.Promise
mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true }
)

export default mongoose
