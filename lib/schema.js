module.exports = {
  users: {
    me: {
      method: 'put',
      path: '/me',
      body: ['email', 'name']
    }
  },
  classifieds: {
    self: {
      method: 'get',
      path: '/:classifiedId',
    },
    list: {
      method: 'get',
      path: '/'
    },
    create: {
      method: 'post',
      path: '/',
      body: ['title', 'content']
    }
  }
};