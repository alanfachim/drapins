
const opts = {
  errorCorrectionLevel: 'H',
  type: 'image/jpeg',
  quality: 0.3,
  margin: 1,
  color: {
    dark: "#010599FF",
    light: "#FFFFFF"
  }
}
const QRCode = require('qrcode');
const util = require('util');
const app = require('../share/app');
const db = require('../share/app')
const func = require('../share/func');
const decrypt = require("./decrypt.js");
const readFileAsync = util.promisify(QRCode.toDataURL);

function calcule(l, frete, desconto_taxa) {
  var freteMG = 0;
  var freteSP = 0;
  var totalSP = 0;
  var totalMG = 0;
  var total = 0;
  var desconto = 0;

  l.forEach(function (item, i) {
    if (item.cat == 'SP') {
      totalSP += Number(item.valor.replace(/[^0-9,.-]+/g, ""));
    } else {
      totalMG += Number(item.valor.replace(/[^0-9,.-]+/g, ""));
    }
  });
  freteMG = totalMG > 0 ? frete : 0;
  freteSP = totalSP > 0 ? frete : 0;

  var fmg = totalMG > 120;
  var fsp = totalSP > 120;

  desconto_taxa.forEach(element => {
    if (element["cond"] == '-') {
      if ((totalSP + totalMG) < element["objetivo"])
        desconto = (totalSP + totalMG) * (element["valor"] / 100.0);
    } else {
      if ((totalSP + totalMG) >= element["objetivo"])
        desconto = (totalSP + totalMG) * (element["valor"] / 100.0);
    }

  });

  total = ((fmg ? 0 : freteMG) + (fsp ? 0 : freteSP) + totalSP + totalMG);

  return { total: total - desconto, totalMG: totalMG, freteMG: (fmg ? 0 : freteMG), totalSP: totalSP, freteSP: (fsp ? 0 : freteSP), desconto: desconto };
}

function randomString(length, chars) {
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}
module.exports = async function (context, req) {


  responseMessage = [];
  var request = require('request').defaults({ encoding: null });
  var config = await func();
  var desconto_taxa = [];


  var a = config["cupons"].filter(function (objLista) {
    return req.query.cupom.trim() == objLista.cupom;
  });
  if (a.length > 0) {
    if (new Date(a[0].valido.trim()) >= new Date()) {
      desconto_taxa = a[0].value;
    } else {
      context.res = {
        body: { erro: 'Cupom expirado!' }
      };
      return;
    }
  } else {
    if (req.query.cupom.trim()!= ''&& req.query.cupom.trim()!= 'undefined'&& req.query.cupom.trim()!= undefined) {
      context.res = {
        body: { erro: 'Cupom invalido!' }
      };
      return;
    }
  }


  var pass = randomString(4, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
  var frete = config["parametros"].frete;
  var lista = req.body;

  var envio = 'Correios';
  switch (req.query.envio ? req.query.envio.trim() : '0') {
    case '3':
      envio = 'Combinar entrega no metrô de São Paulo';
      frete = 5;
      break;
    case '4':
      envio = 'Combinar entrega pelo whatsapp, no local indicado pelo vendedor';
      frete = 0;
      break;
    case '12':
      envio = 'Retirar em rua Pedro Botti,555/509, Alto dos Passos - Juiz de Fora - Grátis';
      frete = 0;
      break;
    case '13':
      envio = 'Entrega em Juiz de Fora';
      frete = 5;
      break;
  }

  var extrato = calcule(lista, frete, desconto_taxa)
  var pedido = randomString(4, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
  let data;
  try {
    data = await readFileAsync('https://picpay.me/tainara.pezzini/' + extrato.total, opts);
    qrpixsp = await readFileAsync(config.qrpixsp, opts);
    qrpixmg = await readFileAsync(config.qrpixmg, opts);
    datamg = await readFileAsync('https://picpay.me/' + config.picpaymg + '/' + extrato.total, opts);
  } catch (err) {
    context.log.error('ERROR', err);
    // This rethrown exception will be handled by the Functions Runtime and will only fail the individual invocation
    throw err;
  }

  var nomecliente = '';
  await db.queryContainer('CLIENTE', req.query.email.trim())
    .then((data) => {
      nomecliente = data && data.resources.length > 0 ? data.resources[0].nome : (req.query.nome !== undefined ? req.query.nome : req.query.email.trim());
    });

  var novousuarip = req.query.secret === undefined ? '' : `<p>Informações para acessar sua conta</p><p>Usuário: ${req.query.email}</p><p>Senha:${req.query.secret.trim()}</p>`;
  var subj = [`DRA Pins - Solicitação de Compra ${pedido}`];
  var body = [`<h4>Olá ${nomecliente}</h4>${novousuarip}<p>Pagamento solicitado para compra,  <br> clique <a href="https://drapins.azurewebsites.net/cliente?&user=${req.query.email}&action=order">aqui</a> para ver seus pedidos</p>`];
  const sgMail = require('@sendgrid/mail');
  

  sgMail.setApiKey(await decrypt("SENDGRID_KEY"));
  const msg = {
    to: req.query.email.trim(),//req.query.email,
    from: 'vendas@drapins.com',//config.to,
    subject: subj[req.query.subj],
    html: body[req.query.subj],
  };

  var pay_list = []

  if (extrato.totalSP == 0) {
    pay_list = [{ qrcode: qrpixmg, chave: config.pixmg, email: config.to, telefone: config.tel, carteira: 'Pix', total: extrato.total, pedido: pedido, instagram: config.instagram, logocarteira: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Logo_-_pix_powered_by_Banco_Central_%28Brazil%2C_2020%29.png' },
    { qrcode: datamg, chave: config.picpaymg, email: config.to, telefone: config.tel, carteira: 'PicPay', total: extrato.total, pedido: pedido, instagram: config.instagram, logocarteira: 'https://logodownload.org/wp-content/uploads/2018/05/picpay-logo.png', link: 'https://picpay.me/tainara.pezzini/' + extrato.total }
    ]
  } else {
    pay_list = [{ qrcode: qrpixsp, chave: config.pixsp, email: config.to, telefone: config.tel, carteira: 'Pix', total: extrato.total, pedido: pedido, instagram: config.instagram, logocarteira: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Logo_-_pix_powered_by_Banco_Central_%28Brazil%2C_2020%29.png' },
    { qrcode: data, chave: config.picpaysp, email: config.to, telefone: config.tel, carteira: 'PicPay', total: extrato.total, pedido: pedido, instagram: config.instagram, logocarteira: 'https://logodownload.org/wp-content/uploads/2018/05/picpay-logo.png', link: 'https://picpay.me/tainara.pezzini/' + extrato.total },
    { qrcode: 'https://alanfachim.blob.core.windows.net/$web/bb.PNG', email: config.to, telefone: config.tel, carteira: 'transferencia via Banco do Brasil', total: extrato.total, pedido: pedido, ct: config.ct, ag: config.ag, cpf: config.cpf, nome: config.nome, instagram: config.instagram }]
  }

  pedidosCad = {
    codigo: pedido,
    status: 'Aguardando Confirmação de Pagamento',
    log: {
      st1: '',
      st2: '',
      st3: '',
      st4: '',
      st5: ''
    },
    lista: lista,
    rastreio: '-',
    estimativa: '-',
    datacompra: Date.now(),
    idativo: true,
    envio: envio,
    st: '1',
    cupom: req.query.cupom.trim(),
    formaPag: req.query.formaPag.trim(), 
    messages: [],
    total: extrato.total,
    desconto: extrato.desconto,
    total_detalhe: [
      {
        cat: 'MG',
        frete: extrato.freteMG,
        total: extrato.totalMG
      }, {
        cat: 'SP',
        frete: extrato.freteSP,
        total: extrato.totalSP
      }
    ],
    pagamentos: pay_list
  };


  lsp = lista.filter(function (objLista) {
    return objLista.cat == "SP";
  });
  lmg = lista.filter(function (objLista) {
    return objLista.cat == "MG";
  });

  if (lsp.length > 0) {
    await app.updatEstoque(lsp, "dsp", true);
  }
  if (lmg.length > 0) {
    await app.updatEstoque(lmg, "dmg", true);
  }

  idCliente = req.query.email.trim();
  token = req.query.token;
  if (token === undefined) {
    //cadastra novo cliente
    cliente = {
      id: req.query.email.trim(),
      telefone: req.query.telefone.trim(),
      nome: req.query.nome.trim(),
      endereco: req.query.endereco.trim(),
      numero: req.query.numero.trim(),
      cidade: req.query.cidade.trim(),
      complemento: req.query.complemento.trim(),
      estado: req.query.estado.trim(),
      cep: req.query.cep.trim(),
      type: 'client',
      password: req.query.secret.trim(),
      pedidos: [pedidosCad],
      message: [],
      notificar: []
    }
    await db.createDatabase()
      .then(() => db.createContainer('CLIENTE'))
      .then(() => db.queryContainer('CLIENTE', idCliente))
      .then((data) => {
        if (data.resources.length == 0) {
          return db.createFamilyItem(cliente, 'CLIENTE')
        } else {
          throw 'Usuário já existe, faça o login.';
        }
      }).then(() => {
        console.log('usuário cad')
      }).then(() => {
        sgMail.send(msg);
      }).then(() => {
        cliente.email = req.query.email.trim();
        context.res = {
          body: { pay: pay_list, cliente: cliente, token: db.geratoken(req.query.email.trim(), req.headers['x-forwarded-for'] || '').split(',').pop().trim() }
        };
        return;
      })
      .catch(error => {
        context.res = {
          body: { erro: error }
        };
        return;
      });
  } else {
    //clente existente add pedido
    await db.queryContainer('CLIENTE', idCliente)
      .then((data) => {
        var cliente = data.resources[0];
        cliente.pedidos.push(pedidosCad);
        if (db.validatoken(req.query.token, idCliente, (req.headers['x-forwarded-for'] || '').split(',').pop().trim())) {
          return db.replaceFamilyItem(cliente, 'CLIENTE');
        } else {
          throw 'Usuário não autenticado' + (req.query.token || '');
        }
      }).then(() => {
        sgMail.send(msg);
      }).then(() => {
        context.res = {
          body: pay_list
        };
        return;
      })
      .catch(error => {
        context.res = {
          body: { erro: error }
        };
        return;
      });

  }




}