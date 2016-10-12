const test = require('tape');
const nock = require('nock');
const client = require('../index').noauth;

test('send request', t=> {
  const factory = client({
    schema: {
      list: {
        path: '/',
        method: 'get'
      }
    }, namespace: 'users'
  });

  const expected = [{id: 345, email: 'foo@bar.com', username: 'foobar'}];

  const api = nock('http://localhost:3000')
    .get('/users/')
    .reply(200, expected);

  factory()
    .list()
    .then(function (users) {
      t.ok(api.isDone());
      t.deepEqual(users, expected);
      t.end();
    })
    .catch(t.end);

});