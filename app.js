/**
 * Module dependencies.
 */

const Koa = require('koa');
const Router = require('koa-router');
const logger = require('koa-logger');
const serve = require('koa-static');
const koaBody = require('koa-body');
const cors = require('@koa/cors');
const fs = require('fs');
const os = require('os');
const path = require('path');
const config = require('./config');

const app = new Koa();
const router = new Router();

validate(app);

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

// custom 404

app.use(async function (ctx, next) {
    await next();
    if (ctx.body || !ctx.idempotent) return;
    ctx.status = 404;
    ctx.body = {
        message: ''
    };
});

// serve files from ./public

app.use(serve(path.join(__dirname, config.FILES_PATH)));

// handle uploads

router
    .post('/', async (ctx, next) => {
        // TODO: mime type filter
        const file = ctx.request.files.file;
        console.log('uploading %s %s -> %s', file.type, file.name, path.basename(file.path));
        ctx.body = {
            data: {
                image_url: `${config.APP_URL}/${path.basename(ctx.request.files.file.path)}`
            }
        };
    });

// listen

app
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(config.PORT);

console.log(`listening on port ${config.PORT}`);