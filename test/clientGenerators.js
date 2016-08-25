const test = require('tape');
const nock = require('nock');
const client = require('../lib/clients');

test('simple get', t=> {
  const factory = client({
    self: {
      path: '/',
      method: 'get'
    }
  }, 'users');

  const expected = [{id: 666, email: 'foo@bar.com', username: 'foobar'}];

  const api = nock('http://localhost:5000')
    .matchHeader('Authorization', 'Bearer hello')
    .get('/users/')
    .reply(200, expected);

  factory({token: 'hello'})
    .self()
    .then(users => {
      t.ok(api.isDone());
      t.deepEqual(users, expected);
      t.end();
    })
    .catch(t.end)
});

test('get with url params', t=> {
  const factory = client({
    self: {
      path: '/:clientId',
      method: 'get'
    }
  }, 'users');

  const expected = {id: 666, email: 'foo@bar.com', username: 'foobar'};

  const api = nock('http://localhost:5000')
    .matchHeader('Authorization', 'Bearer hello')
    .get('/users/666')
    .reply(200, expected);

  factory({token: 'hello'})
    .self({clientId: 666})
    .then(users => {
      t.ok(api.isDone());
      t.deepEqual(users, expected);
      t.end();
    })
    .catch(t.end)
});

test('get with query params', t=> {
  const factory = client({
    list: {
      path: '/',
      method: 'get',
      query: ['username']
    }
  }, 'users');

  const expected = {id: 666, email: 'foo@bar.com', username: 'foobar'};

  const api = nock('http://localhost:5000')
    .matchHeader('Authorization', 'Bearer hello')
    .get('/users/?username=laurent')
    .reply(200, expected);

  factory({token: 'hello'})
    .list({username: 'laurent'})
    .then(users => {
      t.ok(api.isDone());
      t.deepEqual(users, expected);
      t.end();
    })
    .catch(t.end)
});

test('get with multiple url params', t=> {
  const factory = client({
    self: {
      path: '/:clientId/foo/:bar',
      method: 'get'
    }
  }, 'users');

  const expected = {id: 666, email: 'foo@bar.com', username: 'foobar'};

  const api = nock('http://localhost:5000')
    .matchHeader('Authorization', 'Bearer hello')
    .get('/users/666/foo/7')
    .reply(200, expected);

  factory({token: 'hello'})
    .self({clientId: 666, bar: 7})
    .then(users => {
      t.ok(api.isDone());
      t.deepEqual(users, expected);
      t.end();
    })
    .catch(t.end)
});

test('get reject if missing url params', t=> {
  const factory = client({
    self: {
      path: '/:clientId',
      method: 'get'
    }
  }, 'users');

  const expected = {id: 666, email: 'foo@bar.com', username: 'foobar'};

  const api = nock('http://localhost:5000')
    .matchHeader('Authorization', 'Bearer hello')
    .get('/users/666')
    .reply(200, expected);

  factory({token: 'hello'})
    .self({})
    .then(users => {
      t.fail();
    })
    .catch(function (err) {
      t.equal(err, 'You forgot to pass the url param "clientId"');
      t.end();
    })

});

test('post method with body params only', t=> {

  const factory = client({
    create: {
      path: '/',
      method: 'post',
      body: ['email', 'username']
    }
  }, 'users');

  const expected = {id: 666, email: 'foo@bar.com', username: 'foobar'};

  const api = nock('http://localhost:5000')
    .matchHeader('Authorization', 'Bearer hello')
    .post('/users/', {email: 'foo@bar.com', username: 'foobar'})
    .reply(201, expected);

  factory({token: 'hello'})
    .create({email: 'foo@bar.com', username: 'foobar', tooMuch: true})
    .then(function (user) {
      t.ok(api.isDone());
      t.deepEqual(user, expected);
      t.end();
    })
    .catch(t.end);
});

test('post method with body params only (adding existing params only)', t=> {
  const factory = client({
    create: {
      path: '/',
      method: 'post',
      body: ['email', 'username']
    }
  }, 'users');

  const expected = {id: 666, email: 'foo@bar.com', username: 'foobar'};

  const api = nock('http://localhost:5000')
    .matchHeader('Authorization', 'Bearer hello')
    .post('/users/', {email: 'foo@bar.com'})
    .reply(201, expected);

  factory({token: 'hello'})
    .create({email: 'foo@bar.com'})
    .then(function (user) {
      t.ok(api.isDone());
      t.deepEqual(user, expected);
      t.end();
    })
    .catch(err=>t.end);
});

test('post method with body params forwarding errors', t=> {
  const factory = client({
    create: {
      path: '/',
      method: 'post',
      body: ['email', 'username']
    }
  }, 'users');

  const api = nock('http://localhost:5000')
    .matchHeader('Authorization', 'Bearer hello')
    .post('/users/', {email: 'foo.bar.com'})
    .reply(422);

  factory({token: 'hello'})
    .create({email: 'foo.bar.com'})
    .then(function (user) {
      t.fail();
    })
    .catch(err=> {
      t.ok(api.isDone());
      t.equal(err.status, 422);
      t.end();
    });
});

test('put method with body params only', t=> {

  const factory = client({
    me: {
      path: '/me',
      method: 'put',
      body: ['email', 'username']
    }
  }, 'users');

  const expected = {id: 666, email: 'foo@bar.com', username: 'foobar'};

  const api = nock('http://localhost:5000')
    .matchHeader('Authorization', 'Bearer hello')
    .put('/users/me', {email: 'foo@bar.com', username: 'foobar'})
    .reply(201, expected);

  factory({token: 'hello'})
    .me({email: 'foo@bar.com', username: 'foobar', tooMuch: true})
    .then(function (user) {
      t.ok(api.isDone());
      t.deepEqual(user, expected);
      t.end();
    })
    .catch(t.end);
});

test('put method with body params only (adding existing params only)', t=> {
  const factory = client({
    me: {
      path: '/me',
      method: 'put',
      body: ['email', 'username']
    }
  }, 'users');

  const expected = {id: 666, email: 'foo@bar.com', username: 'foobar'};

  const api = nock('http://localhost:5000')
    .matchHeader('Authorization', 'Bearer hello')
    .put('/users/me', {email: 'foo@bar.com'})
    .reply(201, expected);

  factory({token: 'hello'})
    .me({email: 'foo@bar.com'})
    .then(function (user) {
      t.ok(api.isDone());
      t.deepEqual(user, expected);
      t.end();
    })
    .catch(t.end);
});

test('put method with body params forwarding errors', t=> {
  const factory = client({
    me: {
      path: '/me',
      method: 'put',
      body: ['email', 'username']
    }
  }, 'users');

  const api = nock('http://localhost:5000')
    .matchHeader('Authorization', 'Bearer hello')
    .put('/users/me', {email: 'foo.bar.com'})
    .reply(422);

  factory({token: 'hello'})
    .me({email: 'foo.bar.com'})
    .then(function (user) {
      t.fail();
    })
    .catch(err=> {
      t.ok(api.isDone());
      t.equal(err.status, 422);
      t.end();
    });
});
