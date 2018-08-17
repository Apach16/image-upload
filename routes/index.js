const Router = require('koa-router');
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const config = require('../config');
const jwt = require('../middleware/jwt');
const multipart = require('../middleware/multipart');
const image = require('../middleware/image');
const { result } = require('../handlers/response');

const router = new Router();

function deleteFile(filePath) {
  fs.unlink(filePath, err => {
    if (err) {
      console.log(`error while deleting temp file ${filePath}`)
    }
    console.log(`successfully deleted temp file ${filePath}`)
  })
}

router
  // pass options requests
  .options('*', async (ctx, next) => {
    return result(ctx)({}, 204);
  })
  .post('/', jwt, multipart, image, async (ctx, next) => {

    const image = ctx.request.files.image;

    const ext = path.extname(image.path);
    const hash = image.hash;
    const imagePath = path.join(process.cwd(), config.FILES_PATH, `${hash}${ext}`)
    if (fs.existsSync(imagePath)) {
      deleteFile(image.path);
    } else {
      fse.moveSync(image.path, imagePath);
    }

    console.log('uploading %s %s -> %s', image.type, image.name, path.basename(imagePath));
    host = config.APP_URL ? config.APP_URL : ctx.request.origin;

    return result(ctx)({
      data: {
        image_url: `${host}/${path.basename(imagePath)}`
      }
    });
  });

module.exports = router
