const db = require('../share/app');
const aws = require("../awsConvert.js");

module.exports = async function teste(context, req) {
  req = aws(context, req);
  await db.queryContainer('CLIENTE', req.query.user)
    .then((data) => {
      if (data.resources.length > 0) {
        if (req.query.token !== undefined) {
          if (db.validatoken(req.query.token, req.query.user.trim(), (req.headers['x-forwarded-for'] || '').split(',').pop().trim())) {
            context.res = {
              body: { valid: true }
            };
          } else {
            context.res = {
              body: { valid: false }
            };
          }
        } else {
          context.res = {
            body: { valid: true }
          };
        }
      } else {
        context.res = {
          body: { valid: false }
        };
      }

    })
    .catch(error => {
      context.res = {
        body: { erro: error }
      };
    })

  //lambda response
  console.log(context.res);
  let response = {
    statusCode: 200,
    body: JSON.stringify(context.res)
  };
  return response;
}