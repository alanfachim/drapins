const func = require("../share/func");
const { BlobServiceClient, } = require('@azure/storage-blob');
const { v1: uuid } = require('uuid');
const decrypt = require("../decrypt.js");

module.exports = async function (context, req) {
  responseMessage = [];
  const subdir = req.query.catalogo ? req.query.catalogo:'SP';
  const blobServiceClient = BlobServiceClient.fromConnectionString(await decrypt("BLOB_CONNECTIONSTRING"));
  const containerClient = blobServiceClient.getContainerClient(req.query.catalogo ? req.query.catalogo == 'SP' ? 'dsp' : 'dmg' : 'dsp');
  var a = await containerClient.deleteIfExists();
  await new Promise(resolve => setTimeout(resolve, 12000));
  await containerClient.create();
  await new Promise(resolve => setTimeout(resolve, 10000));
  await containerClient.setAccessPolicy('container');

  

  const { ShareServiceClient, StorageSharedKeyCredential } = require("@azure/storage-file-share");
  var config = await func();

  const credential = new StorageSharedKeyCredential(config.account, config.accountKey);
  const serviceClient = new ShareServiceClient(
    // When using AnonymousCredential, following url should include a valid SAS
    config.azureurl,
    credential
  );
  const directoryClient = serviceClient.getShareClient(config.shareName).getDirectoryClient(config.directoryName + subdir);

  let dirIter = directoryClient.listFilesAndDirectories();
  let i = 1;
  for await (const item of dirIter) {
    if (item.kind === "directory") {
    } else {
      if (item.name.match("(\.png|\.jpeg|\.jpg)") && item.name.match(req.query.search)) {
        item.name=item.name.replace(".jpeg.jpg",".jpeg");
        var nome = (item.name.substr(0, item.name.lastIndexOf('.')) || item.name).toUpperCase().trim().split('-');
        try {
          responseMessage.push({
            'url': `https://alanfachim.blob.core.windows.net/${containerClient.containerName}/${item.name.replace(".jpeg.jpg",".jpeg")}`,
            'valor': `${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(nome[0].trim()))}`,
            'SKU': `${nome.length > 1 ? nome[1].trim() : ''}`,
            'qt': `${nome.length > 2 ? nome[2].trim() : ''}`,
            'cat': req.query.catalogo,
            'pop': `${nome.length > 3 ? nome[3].trim() : ''}`,
            'de': `${nome.length > 5 ? nome[4].trim() : ''}`
          });
          const downloadFileResponse = await directoryClient.getFileClient(item.name.replace(".jpeg.jpg",".jpeg")).download();
          var data = await streamToBuffer(downloadFileResponse.readableStreamBody)
          const blockBlobClient = containerClient.getBlockBlobClient(item.name.replace(".jpeg.jpg",".jpeg"));
          await blockBlobClient.upload(data, data.length);
        } catch (e) { 

          console.log(e);
        }
      }
    }
    i++;
  }

  var ret = { produtos: responseMessage, parametros: config.parametros };
  const content = cleanString(JSON.stringify(ret, null, 2));

  const fileClient = directoryClient.getFileClient(config.fileName);
  await fileClient.create(content.length);
  await fileClient.uploadRange(content, 0, content.length);
   
  const blockBlobClient = containerClient.getBlockBlobClient(config.fileName);
  await blockBlobClient.upload(content, content.length);


  context.res = {
    // status: 200, /* Defaults to 200 */
    body: responseMessage
  };
}
async function streamToBuffer(readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on("data", (data) => {
      chunks.push(data instanceof Buffer ? data : Buffer.from(data));
    });
    readableStream.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
    readableStream.on("error", reject);
  });
} 
function cleanString(input) {
  var output = "";
  for (var i = 0; i < input.length; i++) {
    if (input.charCodeAt(i) <= 150) {
      output += input.charAt(i);
    } else
      if (input.charCodeAt(i) >= 200 && input.charCodeAt(i) <= 243) {
        output += encodeURI(input.charAt(i));
      }
  }



  return output;
}