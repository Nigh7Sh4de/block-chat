const Key = require('node-rsa')

module.exports = class BlockChat {
  constructor(list = []) {
    this.list = [ ...list ]
  }

  get(receiver, signature) {
    try {
      const to = new Key()
      to.importKey(receiver, 'public')
      if (!to.verify(receiver, signature))
        return false
      return this.list.filter(m => m.to === to.exportKey('public'))
    }
    catch(err) {
      console.error(err)
      return false
    }
  }

  add(message) {
    try {
      if (!message.valid())
        return false

      const prevMessages = this.list.filter(m => m.getHash() === message.prevHash)
      if (prevMessages.length !== 1)
        return false
      
      const key = new Key()
      key.importKey(prevMessages[0].to, 'public')
      if (!key.verify(prevMessages[0].getHash(), message.prevSignature))
        return false
      
      this.list.push(message)
      return true
    }
    catch(e) {
      console.error(e)
      return false
    }
  }
}