const result = (ctx) => {
  return (result = {}, statusCode = 200) => {
    if (ctx.body) return result;

    ctx.status = statusCode;
    ctx.body = result;
  }
};

const error = (ctx) => {
  return (error = {}, statusCode = 400) => {
    if (ctx.body) return error;

    ctx.status = statusCode;
    ctx.body = {
      error
    };
  }
};

module.exports = {
  result,
  error
};