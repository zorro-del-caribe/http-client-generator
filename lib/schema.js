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
      body: ['title', 'content', 'price']
    }
  },
  tags: {
    self: {
      method: 'get',
      path: '/:tagId'
    },
    list: {
      method: 'get',
      path: '/',
      query: ['search']
    }
  },
  mails: {
    magicLink: {
      method: 'post',
      path: '/magic_link',
      body: ['link', 'email']
    }
  }
};