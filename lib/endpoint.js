const stamp = require('stampit');

module.exports = function (defaultEndpoint = {}) {
  return stamp()
    .init(function () {
      const {endpoint} = this;
      Object.defineProperty(this, 'endpoint', {
        value: endpoint || defaultEndpoint
      });
    });
};