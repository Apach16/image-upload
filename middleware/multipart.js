const koaBody = require('koa-body');

// parse multipart requests
const multipart = koaBody({
  multipart: true,
  formidable: {
    keepExtensions: true,
    multiples: false,
    hash: 'md5'
  }
});
module.exports = multipart;