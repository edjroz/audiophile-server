import 'reflect-metadata'

import { createServer } from 'http'
import mongodb from 'mongodb'
import debug from 'debug'

import createApi from '../api'

// TODO: create Config interface
export const CreateDbConnection = async (config: any) => {
  if (config.Uri) {
    throw new Error('Invalid Configuration, cannot get mongodb uri')
  }
  return new Promise((resolve, reject) => {
    mongodb.connect(config.dbUri, (err: Error, conn: any) => {
      if (err) {
        return reject(new Error(''))
      }
      return resolve(conn)
    })
  })
}
export const CreateServices = async () => {
  // TODO: investigate DI
  return new Promise(() => ({}))
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
  // ctx.dbConnection = await CreateDbConnection(config)
  ctx.services = {}
  ctx.httpServer = await StartApiServer(config.api, ctx.services)
  return ctx
}
