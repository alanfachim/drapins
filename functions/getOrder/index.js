

const db = require('../share/app')

module.exports = async function teste(context, req) {
  if (db.validatoken(req.query.token, req.query.user.trim(), (req.headers['x-forwarded-for'] || '').split(',').pop().trim())) {
    await db.queryContainer('CLIENTE', req.query.user.trim())
      .then((data) => {
        if (data.resources.length == 0) {
          throw 'usuario não encontrado'
        }
        var cliente = data.resources[0];
        if (req.query.admin !== undefined && cliente.type == "admin") {
          return db.queryAllOrder('CLIENTE');

        } else {


          context.res = {
            body: {
              pedido: cliente.pedidos,
              cliente: {
                email: (cliente.id || '').trim(),
                telefone: (cliente.telefone || '').trim(),
                endereco: (cliente.endereco || '').trim(),
                cidade: (cliente.cidade || '').trim(),
                estado: (cliente.estado || '').trim(),
                cep: (cliente.cep || '').trim(),
                numero: (cliente.numero || '').trim(),
                nome: (cliente.nome || '').trim()
              }
            }
          };
        }
      }).then((data2) => {

        if (data2) {
          context.res = {
            body: data2.resources
          }
        }
      });
  } else {
    context.res = { erro: 'Usuário não autenticado' + (req.query.token || '') };
  }

}