//@ts-check 
const { userInfo } = require('os');
const db = require('../share/app')
function randomString(length, chars) {
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}
module.exports = async function (context, req) {

  const url="https://alanfachim.file.core.windows.net/nuvemalan/lista.csv";
  var lista ="";
  const fetch = require('node-fetch');
  const SAStoken = '?sv=2019-12-12&ss=bfqt&srt=sco&sp=rwdlacupx&se=2021-09-26T11:20:58Z&st=2020-09-26T03:20:58Z&spr=https,http&sig=HkzuauYMEzfljjNeSvTtRa%2BfNeO75z5b7zRj1oFGXdw%3D';
  let settings = { method: "Get" };
  // @ts-ignore
  await fetch(url + SAStoken, settings)
  .then(res => res.text())
  .then((json) => {
        lista = json;
  });


  lista.split('\r\n').forEach(element => {
    var subj = [`DRA Pins - Sorteio`];
    var body = [`<h4>Olá ${element.split(';')[1].trim()}</h4><p>Voce está participando do sorteio da Dra. Pins!</p><p>Seu número da sorte é: ${element.split(';')[0].trim()}</p><p>O sorteio será realizado amanhã em uma live no instagram às 10:30 hs</p> <br> <h4>Obrigado!</h4> `];
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(await decrypt("SENDGRID_KEY"));
    const msg = {
      to: element.split(';')[2].trim(),//req.query.email,
      from: 'vendas@drapins.com',//config.to,
      subject: subj[0],
      html: body[0],
    };
    console.log(element);
    sgMail.send(msg);
  }); 

 





} 
