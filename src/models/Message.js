var mongoose = require('mongoose')
var Schema = mongoose.Schema
const Crypto = require('crypto')

var Message = new Schema({
  text: String,
  to: String,
  prevHash: String,
  prevSignature: {
    type: Buffer,
    set(value) {
      return Buffer.from(value.toString(), 'base64')
    }
  },
  hash: {
    type: String,
    get() {
      const raw = `${this.text}${this.to}`//${this._id}
      return Crypto.createHash('sha256').update(raw).digest('base64')
    },
  },
  valid: {
    type: Boolean,
    get() {
      return !!(this.text && this.to)
    },
  },
})

module.exports = mongoose.model('Message', Message)