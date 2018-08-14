var mongoose = require('mongoose')
var Schema = mongoose.Schema
const Crypto = require('crypto')

var Message = new Schema({
  text: String,
  to: String,
  prevHash: String,
  prevSignature: Buffer,
})

Message.methods.getHash = function() {
  const raw = `${this.text}${this.to}`
  return Crypto.createHash('sha256').update(raw).digest('base64')
}

Message.methods.valid = function() {
  return this.text && this.to
}

module.exports = mongoose.model('Message', Message)