const tokens = require('./lib/tokens');
const client = require('./lib/clients');
const publicSchema = require('./lib/schema');
const stamp = require('stampit');

module.exports = function (options = {}) {
  const schema = options.schema || publicSchema;
  const sdk = {
    tokens
  };

  for (const namespace of Object.keys(schema)) {
    sdk[namespace] = client(schema[namespace], namespace);
  }
  return sdk;
};