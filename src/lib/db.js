var mongoose = require('mongoose')
/**
 * Stupid hack because mongoose doesn't know 
 * how to properly deprecate functionality that 
 * if gone should just default to native on it's own 
 */
mongoose.Promise = Promise

module.exports = () => {
  return {
    messages: require('../models/Message'),
    connect(connString) {
      if (!connString)
        throw new Error('DB_CONNECTION_STRING');
      this.connection = mongoose.connect(connString, {
        promiseLibrary: Promise
      }).connection;
    },
  }
}
