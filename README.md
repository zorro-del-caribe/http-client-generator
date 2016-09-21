# zdc-sdk

[![CircleCI](https://circleci.com/gh/zorro-del-caribe/zdc-sdk.svg?style=svg)](https://circleci.com/gh/zorro-del-caribe/zdc-sdk)

Generate namespaced http client based on schema definition using Bearer token authentication protocol.

## install

``npm install --save zdc-client``

## usage

```Javascript
const factory = require('zdc-client').generate;
const schema={
    list:{
        method:'get', // the HTTP verb
        path:'/', //the path
        query:['page','size'] // a list of authorized query parameters
    },
    self:{
        method:'get',
        path:'/:userId'//a mandatory query parameters,

    },
    create:{
        method:'post',
        path:'/',
        body:['email','username'] // list of allowed parameters
    }
};

const users = factory({
    schema,
    namespace:'users',
    endpoint:{
        protocol:'https',
        host:'api.zdc.com'
    });

users({token:'foobar'})
    .list({page:4}) // GET https://api.zdc.com/users/?page=4 Authorization: Bearer foobar
    .then(result => {})
    .catch(e=>{});

users({token:'whatever')
    .self({userId:666) // GET https://api.zdc.com/users/666 Authorization: Bearer whatever
    .then(user=>{})

users({token:'foobar')
    .create({email:'foo@bar.com',username:'oufGuedin'}) // POST https://api.zdc.com/users/ Authorization: Bearer foobar, body : {email:'foo@bar.com', username:'oufGuedin'}
    .then(user=>{})

```
