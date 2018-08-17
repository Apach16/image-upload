const {
    error
} = require('../handlers/response');

function checkFileExists(ctx) {
    if (!ctx.request.files || !ctx.request.files.image) {
        throw new Error('No file selected for upload');
    }
}

function checkFileMimeType(image) {
    const mimetypes = ['image/png', 'image/jpeg', 'image/gif'];

    if (!mimetypes.includes(image.type.toLocaleLowerCase())) {
        throw new Error(`Invalid type of file ${image.type}`);
    }
}

async function image(ctx, next) {
    try {
        checkFileExists(ctx);
        checkFileMimeType(ctx.request.files.image);

        if (next) {
            await next();
        }
    } catch (e) {
        return error(ctx)(e.message, 422);
    }
}
module.exports = image