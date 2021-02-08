//@ts-check 
const app = require('../share/app');
const db = require('../share/app')
function randomString(length, chars) {
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}
module.exports = async function (context, req) {

  if (req.query.user !== undefined) {
    await db.queryContainer('CLIENTE', req.query.user)
      .then(async (data) => {
        if (data.resources.length > 0) {
          if (req.query.token !== undefined) {
            if (db.validatoken(req.query.token, req.query.admin!==undefined?req.query.admin.trim() : req.query.user.trim(), (req.headers['x-forwarded-for'] || '').split(',').pop().trim())) {
              var cliente = data.resources[0] 
              var pedido = cliente.pedidos.find(element => element.codigo == req.query.pedido.trim()); 
              if (req.query.delet !== undefined) {

                pedido.idativo = false;

              } if (req.query.cancel !== undefined) {
                var lsp = pedido.lista.filter(function (objLista) {
                  return objLista.cat == "SP";
                });
                var lmg = pedido.lista.filter(function (objLista) {
                  return objLista.cat == "MG";
                });

                if (lsp.length > 0) {
                  await app.updatEstoque(lsp, "dsp", false);
                }
                if (lmg.length > 0) {
                  await app.updatEstoque(lmg, "dmg", false);
                }
                const index = cliente.pedidos.indexOf(pedido);
                cliente.pedidos.splice(index, 1);
              } else {
                Object.keys(pedido).forEach(function (key) {
                  if (req.query[key] !== undefined) {
                    if (pedido[key] !== undefined) {
                      pedido[key]=req.query[key];
                    }
                  }
                });
              }
              context.res = {
                body: { msg: 'OK' }
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
        context.res = {
          body: { erro: error }
        };
      })
  } else {
    context.res = {
      body: { erro: 'dados invalidos' }
    };
  }

} 
