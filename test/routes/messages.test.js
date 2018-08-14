const Chat = require('../../src/BlockChat')
var server = require('../../src/app')
const Message = require('../../src/models/Message')

const { expect } = require('chai')
const { spy } = require('sinon')



describe('messages route', function() {
  let app
    // req = {},
    // res = {}
    
  beforeEach(function() {
    const inject = server.GetDefaultInjection()
    app = server(inject)
  })
  

  it('POST can add a new message', function() {
    const expectedResult = true
    app.chat = {
      add: spy(() => expectedResult),
    }
    const ctx = {
      request: {}
    }

    app.route.messages.newMessage(ctx)

    expect(ctx.body).to.have.property('result', expectedResult)
  })
  

  it('GET can get messages for a public key', function() {
    const public = '-----BEGIN PUBLIC KEY-----\nMFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAMLxTeyJ6xbcMjnj54QV8ovSdtMM/rja\nHogBU1vdOOFlwnD31vu8vBKfJe7aYN+y4Y5pL18WZkFcGEVd7YoN0FMCAwEAAQ==\n-----END PUBLIC KEY-----'
    const expectedResult = [ new Message({
      to: public,
    }) ]
    app.chat = {
      get: spy(() => expectedResult),
    }
    const ctx = {
      request: {
        params: {
          to: public,
        },
      },
    }

    app.route.messages.getMessages(ctx)

    expect(ctx.body).to.have.property('data', expectedResult)
  })
})  
