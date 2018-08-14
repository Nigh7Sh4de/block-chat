const Router = require('koa-router')
const axios = require('axios')


module.exports = class Messages extends Router {
  constructor(app) {
    super()
    this.app = app

    this.get('/messages/:to', this.newMessage.bind(this))
    this.post('/messages', this.newMessage.bind(this))
  }

  async getMessages(ctx) {
    const data = this.app.chat.get(ctx.request.params.to)
    return ctx.body = {
      data,
    }
  }

  async newMessage(ctx) {
    const result = this.app.chat.add(ctx.request.body)
    return ctx.body = {
      result,
    }
  }
}