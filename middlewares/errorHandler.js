module.exports = async function (ctx, next) {
    try {
        await next();
    } catch (err) {
        switch (err.status) {
            case 400:
            case 401:
                ctx.status = err.status;
                ctx.body = {
                    error: err.originalError ? err.originalError.message : err.message
                };
                break;
            default:
                throw err;
        };
    }

    if (ctx.body || !ctx.idempotent) return;
    ctx.status = 404;
    ctx.body = {
        message: 'Not found'
    };
}