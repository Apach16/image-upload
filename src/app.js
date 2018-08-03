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

// Custom 401 handling
app.use(function (ctx, next) {
  return next().catch((err) => {
    if (err.status === 401) {
      ctx.status = 401;
      ctx.body = {
        error: err.originalError ? err.originalError.message : err.message
      };
    } else {
      throw err;
    }
  });
});

// Middleware below this line is only reached if JWT token is valid
app.use(jwt({ secret: config.JWT_SECRET }));

// custom 404

app.use(async function (ctx, next) {
    await next();
    if (ctx.body || !ctx.idempotent) return;
    ctx.status = 404;
    ctx.body = {
        message: 'not found'
    };
});

// serve files from ./public

app.use(serve(path.join(__dirname, config.FILES_PATH)));

// listen

app
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(config.PORT);

console.log(`listening on port ${config.PORT}`);