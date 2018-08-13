/**
 * Module dependencies.
 */

const Koa = require('koa');
const logger = require('koa-logger');
const serve = require('koa-static');
const path = require('path');
const fs = require('fs');
const config = require('./config');
const router = require('./routes');
const errorsHandler = require('./handlers/errors');

const app = new Koa();

// log requests

app.use(logger());

// Custom 404 errors handling

app.use(errorsHandler);

if (!fs.existsSync(path.join(__dirname, config.FILES_PATH))) {
  fs.mkdirSync(path.join(__dirname, config.FILES_PATH));
}

// serve files from ./public

app.use(serve(path.join(__dirname, config.FILES_PATH), {
  maxage: config.CACHE_MAX_AGE
}));

// listen

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(config.PORT);
console.log(`listening on port ${config.PORT}`);
