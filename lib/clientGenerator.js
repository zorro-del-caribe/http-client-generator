const defaultEndpoint = require('./endpoint');
const stamp = require('stampit');
const assert = require('assert');
const request = require('superagent');

module.exports = function ({
  schema,
  namespace = '',
  endpoint = {
    protocol: 'http',
    hostname: 'localhost',
    port: 3000
  }
}) {
  assert(schema, 'missing schema');

  const paramsRegex = /\/:([a-z]*)(?:\/*)/ig;
  const methods = {};

  for (const link of Object.keys(schema)) {
    const linkDef = schema[link];
    const urlParams = [];
    let matches;
    while ((matches = paramsRegex.exec(linkDef.path)) !== null) {
      const [m,p]=matches;
      urlParams.push(p);
    }

    methods[link] = function (params = {}) {
      return new Promise((resolve, reject)=> {
        const paramsValue = [];
        for (const p of urlParams) {
          if (!params[p]) {
            return reject(`You forgot to pass the url param "${p}"`);
          }
          paramsValue.push(params[p]);
        }
        let path = linkDef.path;
        if (paramsValue.length) {
          paramsValue.forEach((p, i)=> {
            path = path.replace(`:${urlParams[i]}`, p);
          });
        }
        const pathname = `/${namespace}${path}`;
        const req = request[linkDef.method](Object.assign({}, this.endpoint, {pathname}));
        req.set('Authorization', 'Bearer ' + this.token);

        if (linkDef.body) {
          const {body:defBody} = linkDef;
          const body = {};

          if (defBody) {
            for (const prop of defBody) {
              if (params[prop] !== undefined) {
                body[prop] = params[prop];
              }
            }
          }
          req.send(body)
        }

        if (linkDef.query) {
          const {query} = linkDef;
          const queryObject = {};

          for (const prop of query) {
            if (params[prop] !== undefined) {
              queryObject[prop] = params[prop];
            }
          }
          req.query(queryObject);
        }

        req.end((err, res)=> {
          if (err) {
            return reject(err);
          } else {
            return resolve(res.body);
          }
        });

      });
    }
  }

  return stamp()
    .init(function () {
      const {token} = this;
      assert(token, 'you forgot to pass the access token');
      Object.defineProperty(this, 'token', {value: token});
    })
    .methods(methods)
    .compose(defaultEndpoint(endpoint));
};
