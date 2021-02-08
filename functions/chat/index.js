//@ts-check 
const db = require('../share/app')


function randomString(length, chars) {
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}
const creds = require("../decrypt.js");
const aws = require("../awsConvert.js");

module.exports.handler = async function (context, req) {
  req = aws(context, req);
  console.log(req);//teste

  if (req.query.user !== undefined) {
    await db.queryContainer('CLIENTE', req.query.user)
      .then((data) => {
        console.log(data);
        if (data.resources.length > 0) {
          if (req.query.token !== undefined) {
            if (db.validatoken(req.query.token, req.query.admin !== undefined ? req.query.admin.trim() : req.query.user.trim(), (req.headers['x-forwarded-for'] || req.headers['X-Forwarded-For'] || ''))) {
              var cliente = data.resources[0]
              var msg = { text: req.query.msg, time: Date.now(), sender: cliente.type == 'client' && req.query.admin == undefined ? 'ME' : 'store' };
              var pedido = cliente.pedidos.find(element => element.codigo == req.query.pedido.trim());
              pedido.messages.push(msg);
              cliente.pedidos.map(obj => [pedido].find(o => o.codigo === obj.codigo) || obj);
              context.res = {
                body: { msg: msg }
              };
              db.replaceFamilyItem(cliente, 'CLIENTE');
            } else {
              throw ('Favor refazer o login')
            }
          } else {
            throw ('Favor fazer o login')
          }
        } else {
          throw ('Usuário não informado')
        }

      })
      .catch(error => {
        console.log(error);
        context.res = {
          body: { erro: error }
        };
      })
  } else {
    context.res = {
      body: { erro: 'dados invalidos' }
    };
  }
  //lambda response
  console.log(context.res);
  let response = {
    statusCode: 200, 
    body: JSON.stringify(context.res)
  };
  return response;
} 
