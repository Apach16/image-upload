require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || '3000',                   // server port
    APP_URL: process.env.APP_URL || 'http://localhost', // application url
    JWT_SECRET: process.env.JWTSECRET || '',            // server jwt secret token
    MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || 2048    // max file size in kb
};
