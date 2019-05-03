import anyTest, { TestInterface, ExecutionContext } from 'ava'
import { Readable } from 'stream'

import mongodb, { MongoClient, ObjectID } from 'mongodb'
import debug from 'debug'
import MongoMemoryServer from 'mongodb-memory-server'

import BucketRepository from './'

const DUMMY_TEXT: string = 'Lorem ipsum dolor'

interface Context {
  data: Readable
  buffer: Buffer
  mongod: any,
  connection: MongoClient
  db: mongodb.Db
}
const test = anyTest as TestInterface<Context>

test.before(async (t) => {
  const data: Readable = new Readable()
  const buffer: Buffer = Buffer.from(DUMMY_TEXT)
  data.push(buffer)
  data.push(null)
  
  t.context.data = data
  t.context.buffer = buffer
})
test.beforeEach(async (t) => {
  const newLocal = new MongoMemoryServer()
  const mongod = newLocal
  const uri = await mongod.getConnectionString()
  const connection = await mongodb.connect(uri, { useNewUrlParser: true })
  const db = connection.db('test')
  const { data, buffer } = t.context

  t.context = {
    buffer,
    connection,
    data,
    db,
    mongod
  }
})
test.afterEach(async (t) => {
  await t.context.mongod.stop()
})

test('can get Bucket from database', async (t) => {
  const { db } = t.context
  try {
    const _bucket = new BucketRepository(db)
    t.pass('bucket was created')
  } catch (err) {
    debug('test:unit:repository:error')(err)
    t.fail('Could not create bucket from database')
  }
})
test('can stream into bucket', async (t) => {
  const { db, buffer, data: expected } = t.context
  try {
    const bucket = new BucketRepository(db)
    const uploadStream = bucket.getUploadStream('song')
    const id = uploadStream.id
    const readable = new Readable()

    const pipeReadable = async (buf: Buffer, read: Readable) => {
      return new Promise((resolve, reject) => {
        read.push(buf)
        read.push(null)
        read.on('error', (err) => {
          debug('test:unit:repository:error')(err)
          reject(new Error('Error piping data to FS'))
        })

        // NOTE: wait until value is readable otherwise it will fail on next step
        while (!read.readable) {
          if (read.readable) {
            break
          }
        }
        if (read.readable) {
          resolve(read)
        }
      })
    }
    const upload = (readStream: Readable) => {
      return new Promise((resolve, reject) => {
        readStream.pipe(uploadStream)
        uploadStream.on('finish', () => {
          const oId = new ObjectID(String(id))
          const ReadStream = bucket.getDownloadStream(oId)
          const receivedData: Readable = new Readable()

          ReadStream.on('data', (chunk) => {
            receivedData.push(chunk)
            receivedData.push(null)
          })
          ReadStream.on('end', () => {
            t.deepEqual(receivedData, expected)
            t.pass('Data was streamed successfully')
            resolve()
          })
          ReadStream.on('error', (err) => {
            debug('test:unit:repository:error')(err)
            reject(new Error('Error reading from stream'))
          })
        })
      })
    }
    await pipeReadable(buffer, readable).then(upload)
  } catch (err) {
    debug('test:unit:repository:error')(err)
    t.fail('Could not create Write Song Stream')
  }
})
test.todo('can start write stream into bucket')
