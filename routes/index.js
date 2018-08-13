const Router = require('koa-router');
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const config = require('../config');
const jwt = require('../middleware/jwt');
const multipart = require('../middleware/multipart');
const {
  result,
  error
} = require('../handlers/response');

const router = new Router();

function checkFileExists(ctx) {
  if (!ctx.request.files || !ctx.request.files.image) {
    return error(ctx)('No file selected for upload', 422);
  }
}

function checkFileMimeType(ctx, image) {
  const mimetypes = ['image/png', 'image/jpeg', 'image/gif'];

  if (!mimetypes.includes(image.type.toLocaleLowerCase())) {
    return error(ctx)(`Invalid type of file ${image.type}`, 422);
  }
}

function deleteFile(filePath) {
  fs.unlink(filePath, err => {
    if (err) {
      console.log(`error while deleting temp file ${filePath}`)
    }
    console.log(`successfully deleted temp file ${filePath}`)
  })
}

router
  .options('*', async (ctx, next) => {
    // pass options requests
    return result(ctx)({}, 204);
  })
  .post('/', jwt, multipart, async (ctx, next) => {
    checkFileExists(ctx);

    const image = ctx.request.files.image;

    checkFileMimeType(ctx, image);

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
