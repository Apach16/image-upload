/**
 * Module dependencies.
 */

const Koa = require('koa');
const logger = require('koa-logger');
const serve = require('koa-static');
const koaBody = require('koa-body');
const cors = require('@koa/cors');
const jwt = require('koa-jwt');
const path = require('path');
const config = require('./config');
const router = require('./routes');

const app = new Koa();

// log requests

app.use(logger());

// parse multipart requests

app.use(koaBody({
  multipart: true,
  formidable: {
    uploadDir: path.join(__dirname, config.FILES_PATH),
    keepExtensions: true,
    multiples: false,
    maxFileSize: config.MAX_FILE_SIZE * 1024,
  }
}));

// enable cors

app.use(cors());

// Custom 400 and 401 handling

app.use(function (ctx, next) {
  return next().catch((err) => {
    switch (err.status) {
      case 400:
      case 401:
        ctx.status = err.status;
        ctx.body = {
          error: err.originalError ? err.originalError.message : err.message
        };
        break;
      default:
        throw err;
    }
  });
});

// custom 404

app.use(async function (ctx, next) {
  await next();
  if (ctx.body || !ctx.idempotent) return;
  ctx.status = 404;
  ctx.body = {
    message: 'Not found'
  };
});

// serve files from ./public

app.use(serve(path.join(__dirname, config.FILES_PATH), {
  maxage: config.CACHE_MAX_AGE
}));

// Middleware below this line is only reached if JWT token is valid

app.use(jwt({
  secret: config.JWT_SECRET
}));

// listen

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(config.PORT);
console.log(`listening on port ${config.PORT}`);