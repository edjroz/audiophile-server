import express from 'express'
import cors from 'cors'
import compression from 'compression'
import morgan from 'morgan'
import routes from './routes'

// TODO: Write implementations for config and services
export default (services: any, config: any) => {
  const app = express()
  app.use(morgan('common'))
  app.use(cors())
  app.use(compression())
  // app.get('/health', (req, res)=> {
  //   res.json({status: 'Service is running'})
  // })
  routes.map(route => route(app, services))
  return app
}
