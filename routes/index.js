const Router = require('koa-router');
const path = require('path');
const config = require('../config');
const jwt = require('../middlewares/jwt');

const router = new Router();

// handle uploads

router
    .post('/', jwt, async (ctx, next) => {
        if (!ctx.request.files.image) {
            err = new Error('No file selected for upload');
            err.status = 400;
            throw err;
        }
        const image = ctx.request.files.image;
        const mimetypes = ['image/png', 'image/jpeg', 'image/gif'];
        if (!mimetypes.includes(image.type.toLocaleLowerCase())) {
            err = new Error(`Invalid type of file ${image.type}`);
            err.status = 400;
            throw err;
        }
        console.log('uploading %s %s -> %s', image.type, image.name, path.basename(image.path));
        host = config.APP_URL ? config.APP_URL : ctx.request.origin;
        ctx.body = {
            data: {
                image_url: `${host}/${path.basename(ctx.request.files.image.path)}`
            }
        };
    });
module.exports = router
