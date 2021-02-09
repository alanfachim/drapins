//@ts-check 
const { userInfo } = require('os');
const db = require('../share/app'); 
const aws = require("../awsConvert.js");
const decrypt = require("../decrypt.js");

function randomString(length, chars) {
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}
module.exports = async function (context, req) {
  req = aws(context, req);
  const url = "https://alanfachim.file.core.windows.net/nuvemalan/lista.csv";
  var lista = "";
  const fetch = require('node-fetch');
  const SASTOKEN_KEY = await decrypt("SASTOKEN_KEY");
  const SAStoken = SASTOKEN_KEY;
  let settings = { method: "Get" };
  // @ts-ignore
  await fetch(url + SAStoken, settings)
    .then(res => res.text())
    .then((json) => {
      lista = json;
    }); 

  for (const element of lista.split('\r\n')) {

    var subj = [`DRA Pins - Sorteio`];
    var body = [`<h4>Olá ${element.split(';')[1].trim()}</h4><p>Voce está participando do sorteio da Dra. Pins!</p><p>Seu número da sorte é: ${element.split(';')[0].trim()}</p><p>O sorteio será realizado amanhã em uma live no instagram às 10:30 hs</p> <br> <h4>Obrigado!</h4> `];
    const sgMail = require('@sendgrid/mail');
    await decrypt("SENDGRID_KEY").then((key) => {
      sgMail.setApiKey(key);
      const msg = {
        to: element.split(';')[2].trim(),//req.query.email,
        from: 'vendas@drapins.com',//config.to,
        subject: subj[0],
        html: body[0],
      };
      console.log(element);
      return sgMail.send(msg);
    });
  }
  //lambda response
  console.log(context.res);
  let response = {
    statusCode: 200,
    body: JSON.stringify(context.res.body)
  };
  return response;
 
} 
