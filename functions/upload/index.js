//@ts-check 
const db = require('../share/app');
const { BlobServiceClient, } = require('@azure/storage-blob');
function randomString(length, chars) {
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}
module.exports = async function (context, req) {

  var multiparty = require('parse-multipart');
  var bodyBuffer = Buffer.from(req.body);
  var boundary = multiparty.getBoundary(req.headers['content-type']);
  var parts = multiparty.Parse(bodyBuffer, boundary);

  const blobServiceClient = BlobServiceClient.fromConnectionString("DefaultEndpointsProtocol=https;AccountName=alanfachim;AccountKey=6iStvaCjzMi8xtBq4HFRPb8HCqdaxaMCQwtjmEiyvePZLzQ7o6fD1JZ+VJ98Pqj25HCeIRWuEBArdjiZcTTwig==;EndpointSuffix=core.windows.net");
  const containerClient = blobServiceClient.getContainerClient('$web');
  const filename=req.query.pedido+'-'+parts[0].filename;
  const blockBlobClient = containerClient.getBlockBlobClient(filename);

  if (req.query.user !== undefined) {
    await db.queryContainer('CLIENTE', req.query.user)
      .then((data) => {
        if (data.resources.length > 0) {
          if (req.query.token !== undefined) {
            if (db.validatoken(req.query.token, req.query.user.trim(), (req.headers['x-forwarded-for'] || '').split(',').pop().trim())) {
              var cliente = data.resources[0]
              var pedido = cliente.pedidos.find(element => element.codigo == req.query.pedido.trim());
              pedido["comprovante"] = `https://alanfachim.blob.core.windows.net/$web/${filename}`;
              cliente.pedidos.map(obj => [pedido].find(o => o.codigo === obj.codigo) || obj);
              context.res = {
                body: { result: pedido["comprovante"] }
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

      }).then(() => {
        //fs.readFile(req.files.file.path, function(err, data){
        // Do something with the data (which holds the file information)
        //});
        blockBlobClient.upload( parts[0].data, parts[0].data.length);
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
