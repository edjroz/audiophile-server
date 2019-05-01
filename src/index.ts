import debug from 'debug'

import config from './config'
import { startApplication } from './loaders'

startApplication(config, {})
  .then(() => {
    console.log('App is running')
    debug('app:startup:success')('🌌  houston we have a success 🌕 ')
  })
  .catch(err => {
    debug('app:startup:error')('💥  houston we have a problem')
    debug('app:startup:error')(err)
    process.exit(2)
  })
