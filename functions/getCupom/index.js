//@ts-check 
const db = require('../share/app');
const func = require('../share/func');
function randomString(length, chars) {
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}
module.exports = async function (context, req) {

  var config = await func();

  var a = config["cupons"].filter(function (objLista) {
    return req.query.cupom.trim() == objLista.cupom;
  });
  if (a.length > 0) {
    if (new Date(a[0].valido.trim()) >= new Date()) {
      context.res = {
        body: { msg: a[0].value }
      };
    }else{
      context.res = {
        body: { erro: 'Cupom expirado!' }
      };
    }
  } else {
    context.res = {
      body: { erro: 'Cupom invalido!' }
    };
  }

} 
