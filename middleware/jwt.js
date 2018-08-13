const jwt = require('koa-jwt');
const config = require('../config');

module.exports = jwt({
    secret: config.JWT_SECRET
});