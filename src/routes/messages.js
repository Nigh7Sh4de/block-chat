const Router = require('koa-router')
const axios = require('axios')


module.exports = class Messages extends Router {
  constructor(app) {
    super()
    this.app = app

    this.post('/messages', this.newMessage.bind(this))
  }

  async newMessage(ctx) {
    return ctx.body = {
      data: 'adding new message'
    }
  }
}