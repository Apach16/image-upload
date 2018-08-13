module.exports = async function (ctx, next) {
  await next();

  if (ctx.body || !ctx.idempotent) return;
  ctx.status = 404;
  ctx.body = {
    message: 'Not found'
  };
}