const tokens = require('./lib/tokens');
const client = require('./lib/clients');
const schema = require('./lib/schema');
const stamp = require('stampit');

module.exports = function () {
  const sdk = {
    tokens
  };

  for (const namespace of Object.keys(schema)) {
    sdk[namespace] = client(schema[namespace], namespace);
  }
  return sdk;
};