require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || '3000',                    // server port
    APP_URL: process.env.APP_URL || 'http://localhost',  // application url
    JWT_SECRET: process.env.JWT_SECRET || '',            // server jwt secret token
    FILES_PATH: process.env.FILES_PATH || './public',    // images path
    CACHE_MAX_AGE: process.env.CACHE_MAX_AGE || 31536000 // cache max-age
};
