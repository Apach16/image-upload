require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || '3000',                     // server port
    APP_URL: process.env.APP_URL || 'http://localhost',   // application url
    JWT_SECRET: process.env.JWT_SECRET || '',             // server jwt secret token
    MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || 2048,     // max file size in kb
    FILES_PATH: process.env.FILES_PATH || './public'      // images path
};
