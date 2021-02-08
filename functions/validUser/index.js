const db = require('../share/app')

module.exports = async function teste(context, req) {

  await db.queryContainer('CLIENTE', req.query.user) 
    .then((data) => {
      if (data.resources.length > 0) {
        if (req.query.token !== undefined) {
          if (db.validatoken(req.query.token, req.query.user.trim(), (req.headers['x-forwarded-for'] || '').split(',').pop().trim())) {
            context.res = {
              body: { valid: true }
            };
          }else{
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


}