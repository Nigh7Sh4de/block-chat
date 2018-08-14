/**
 * 
 * These are the current settings on the `dev` (8081) environment.
 * 
 * Copy the content of this file or a new configuration into a new file `config.js`
 * in the same folder as `server.js` in order to run the app.
 * 
 */

var config = function () {}

config.prototype = {
  DB_CONNECTION_STRING: "mongodb://localhost/blockchat",
}

module.exports = config;
