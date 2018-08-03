const Router = require('koa-router');
const path = require('path');
const config = require('../config');

const router = new Router();

// handle uploads

router
    .post('/', async (ctx, next) => {
        // TODO: mime type filter
        try {
            const file = ctx.request.files.file;
            console.log('file', file);
            console.log('uploading %s %s -> %s', file.type, file.name, path.basename(file.path));
            ctx.body = {
                data: {
                    image_url: `${config.APP_URL}/${path.basename(ctx.request.files.file.path)}`
                }
            };
        } catch (e) {
            throw e;
        }
    });
module.exports = router