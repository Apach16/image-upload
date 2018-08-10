/**
 * Module dependencies.
 */

const Koa = require('koa');
const logger = require('koa-logger');
const serve = require('koa-static');
const koaBody = require('koa-body');
const cors = require('@koa/cors');
const path = require('path');
const fs = require('fs');
const config = require('./config');
const router = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

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

app.use(cors({
  allowedMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS'
}));

// Custom 400, 401 and 404 errors handling

app.use(errorHandler);

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
