const stampit = require('stampit');
const lib = require('./lib/clientGenerator');
const assert = require('assert');


exports.bearer = function (opts) {
  return lib(opts)
    .compose(stampit()
      .init(function () {
        const {token} = this;
        assert(token, 'you forgot to pass the access token');
        Object.defineProperty(this, 'token', {value: token});
      })
      .methods({
        auth(req){
          return req.set('Authorization', 'Bearer ' + this.token);
        }
      }));
};
exports.basic = function (opts) {
  return lib(opts)
    .compose(
      stampit()
        .init(function () {
          const {username, password} = this;
          assert(username, 'you forgot to pass the username');
          assert(password, 'you forgot to pass the password');
        })
        .methods({
          auth(req){
            return req.auth(this.username, this.password);
          }
        }));
};

exports.noauth = function (opts) {
  return lib(opts)
    .compose(
      stampit()
        .methods({
          auth(){
            return this;
          }
        })
    );
};