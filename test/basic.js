const test = require('tape');
const nock = require('nock');
const client = require('../index').basic;

test('use basic auth', t=> {
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
    .basicAuth({
      user: 'john',
      pass: 'doe'
    })
    .reply(200,expected);

  factory({username: 'john', password: 'doe'})
    .list()
    .then(users => {
      t.ok(api.isDone());
      t.deepEqual(users, expected);
      t.end();
    })
    .catch(t.end);
});