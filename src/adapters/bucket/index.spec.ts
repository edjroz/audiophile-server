import test from 'ava'
import mongodb from 'mongodb'
import debug from 'debug'
import MongoMemoryServer from 'mongodb-memory-server'

import BucketRepository from './'

test.before(async (t: any) => {
  let data: string;
  for (let i = 0; i <= 1e4; i++) {
    data += 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n'
  }
  // NOTE: data should be about 4MB in memory
  t.context.data = data
})
test.beforeEach(async (t: any) => {
  const newLocal = new MongoMemoryServer();
  const mongod = newLocal
  const uri = await mongod.getConnectionString()
  const connection = await mongodb.connect(uri, { useNewUrlParser: true })
  const db = connection.db('test')

  t.context = {
    mongod,
    connection,
    db
  }
  return t
})
test.afterEach(async (t: any) => {
  await t.context.mongod.stop()
})

test('can get Bucket from database', async (t: any) => {
  const { db } = t.context
  try {
    const bucket = new BucketRepository(db)
    t.pass('bucket was created')
  } catch (err) {
    debug('test:unit:repositoru:error')(err)
    t.fail('Could not create bucket from database')
  }
})
test.todo('can start read stream into bucket')
test.todo('can start write stream into bucket')
