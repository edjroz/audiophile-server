import 'reflect-metadata'

import { createServer } from 'http'
import mongodb from 'mongodb'
import debug from 'debug'

import createApi from '../api'
import adapters from  '../adapters'

// TODO: create Config interface
export const CreateDbConnection = async ({ dbUri, dbName }: { dbUri: string, dbName: string }) => {
  if (!dbUri) {
    throw new Error('Invalid Configuration, cannot get mongodb uri')
  }
  if (!dbName) {
    throw new Error('Invalid Configuration, cannot get mongodb uri')
  }
  return new Promise((resolve, reject) => {
    mongodb.connect(dbUri, { useNewUrlParser: true },  (err: Error, conn: any) => {
      if (err) {
        debug('app:startup:database:error')(err)
        return reject(new Error("couldn't connect with database"))
      }
      return resolve(conn)
    })
  })
}
export const CreateServices = async (db: any) => {
  const services: { bucket: any } = {
    bucket: new adapters.BucketRepository(db)
  }
  return services;
}
export const StartApiServer = async (config: any, services: any) => {
  if (!config.port && (process.env.NODE_ENV === 'test' && config.port !== 0)) {
    throw new Error('The http server must be started with an available port')
  }
  if (!services) {
    throw new Error('The http server must be started with a valid core services')
  }
  return new Promise((resolve, reject) => {
    const server = createServer(createApi(services, config))
    server.on('error', err => reject(err))
    server.on('listening', () => {
      resolve(server)
    })
    server.listen(config.port)
    debug('app:startup:server')('🚀  take off')
  })
}

// TODO: create ctx interface
export const startApplication = async (config: any, ctx: any) => {
  ctx.dbConnection = await CreateDbConnection(config)
  ctx.services = await CreateServices(ctx.dbConnection.db(config.dbName))
  ctx.httpServer = await StartApiServer(config.api, ctx.services)
  return ctx
}
