import dotenv from 'dotenv'

dotenv.config()

export default {
  api: {
    port: process.env.PORT || 3000
  },
  dbUri: process.env.DB_URI,
  dbName: process.env.DB_NAME
}
