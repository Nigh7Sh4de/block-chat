const Router = require('koa-router')
const axios = require('axios')

const Message = require('../models/Message')

module.exports = class Messages extends Router {
  constructor(app) {
    super()
    this.app = app

    this.put('/messages/to', this.getMessages.bind(this))
    this.post('/messages', this.newMessage.bind(this))
  }

  async getMessages(ctx) {
    try {
      const data = this.app.chat.list
        .filter(i => i.to == ctx.request.body.to)
        .map(i => i.toJSON({ getters: true }))

      return ctx.body = {
        data,
      }
    }
    catch (err) {
      console.error(err)
      throw err
    }
  }

  async newMessage(ctx) {
    const result = this.app.chat.add(new Message(ctx.request.body))
    return ctx.body = {
      result,
    }
  }
}