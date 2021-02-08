const func = require("../share/func");
const { BlobServiceClient, } = require('@azure/storage-blob');
const { v1: uuid } = require('uuid');

module.exports = async function (context, req) {
  responseMessage = [];
  const subdir = req.query.catalogo;



  const { ShareServiceClient, StorageSharedKeyCredential } = require("@azure/storage-file-share");
  var config = await func();

  const credential = new StorageSharedKeyCredential(config.account, config.accountKey);
  const serviceClient = new ShareServiceClient(
    // When using AnonymousCredential, following url should include a valid SAS
    config.azureurl,
    credential
  );
  var url = `https://alanfachim.blob.core.windows.net/d${subdir}/data.js`;
  var data = {};
  const fetch = require('node-fetch');
  let settings = { method: "Get" };
  // @ts-ignore
  await fetch(url, settings)
    .then(res => res.json())
    .then((json) => {
      data = json;
    });

  await CopyFilesFromOneFolderToAnother(config.directoryName, subdir, subdir + "_out", config, serviceClient, data);

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: responseMessage
  };
}

async function CopyFilesFromOneFolderToAnother(rootDirectory, sourceFolderName, destinationFolderName, config, serviceClient, data) {
  const sourceFolderReference = serviceClient.getShareClient(config.shareName).getDirectoryClient(rootDirectory + sourceFolderName);
  var allSourceFiles = sourceFolderReference.listFilesAndDirectories();
  var destinationFolderReference = serviceClient.getShareClient(config.shareName).rootDirectoryClient.getDirectoryClient(destinationFolderName);
  var alldestFiles = destinationFolderReference.listFilesAndDirectories();
  for await (const sourceFile of alldestFiles) {
    var sourceFileName = destinationFolderReference.getFileClient(sourceFile.name);
    await sourceFileName.deleteIfExists();
  }

  destinationFolderReference.createIfNotExists();


  for await (const sourceFile of allSourceFiles) {
    var a = [];
    var n=sourceFile.name.split('-');
    a = data["produtos"].filter(function (objLista) {
      return objLista.SKU == (n.length>1? n[1].trim():'');
    });
    var novoNome = '';
    sourceFile.name.split('-').forEach((element, i) => {
      novoNome += i == 2 && a.length > 0 && a[0].qt != undefined ? a[0].qt + '-' : element + '-';
    });
    novoNome = novoNome.slice(0, -1);
    var sourceFileName = sourceFolderReference.getFileClient(sourceFile.name);
    var destinationFile = destinationFolderReference.getFileClient(novoNome);
    try {
      await destinationFile.startCopyFromURL(sourceFileName.url);
    } catch (error) {
      console.log(error);
    }
    
  }

}

