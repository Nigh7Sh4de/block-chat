const Chat = require('../../src/BlockChat')
const { expect } = require('chai')

var server = require('./../../src/app');


describe('messages route', function() {
  let app
    // req = {},
    // res = {}
    
  beforeEach(function() {
    const inject = server.GetDefaultInjection()
    app = server(inject)
  })
  

  it('POST can add a new message', function() {
    const ctx = {}

    app.route.messages.newMessage(ctx)

    expect(ctx.body.data).to.equal('adding new message')
  })
})  
