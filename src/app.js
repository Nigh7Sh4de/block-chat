const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const CORS = require('koa2-cors')

const app = function(inject) {

  const app = new Koa()

  app.use(CORS({
    origin: '*',
  }))

  app.use(bodyParser())

  app.config = inject.config
  app.chat = new inject.BlockChat()

  app.db = inject.db
  if (app.db.connect != null && typeof app.db.connect === 'function')
      app.db.connect(app.config.DB_CONNECTION_STRING)

  app.route = {}
  for (var router in inject.routes) {
    const r = new inject.routes[router](app)
    app.route[router] = r
    app.use(r.routes())
    app.use(r.allowedMethods())
  }

  return app
}

app.GetDefaultInjection = function(allowConnect) {
  const inject = {
    config: require('../config'),
    BlockChat: require('./BlockChat'),
    
    db: require('./lib/db'),
    routes: {
      messages: require('./routes/messages'),
    },
  }

  if (!allowConnect)
    inject.db.connect = null

  return inject
}

module.exports = app