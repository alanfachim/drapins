


//@ts-check
const CosmosClient = require('@azure/cosmos').CosmosClient
const { BlobServiceClient, } = require('@azure/storage-blob');
const config = require('./config');
const url = require('url');
const endpoint = config.endpoint

const databaseId = config.database.id
const partitionKey = { kind: 'Hash', paths: ['/Country'] }
const creds = require("../decrypt.js");
// @ts-ignore

var client = null;

const crypto = require('crypto'),
  algorithm = 'aes-256-ctr',
  password = 'd6F3Efeq';
/**
 * Create the database if it does not exist
 */
module.exports = {
  async getClient() {
    if (client == null) {
      await creds("COSMODB_KEY").then((key) => {
        client = new CosmosClient({ endpoint, key });
      })

    }
    return client;
  },
  /**
   * Create the database if it does not exist
   */
  async createDatabase() {
    const { database } = await this.getClient().then((client) => {
      return client.databases.createIfNotExists({
        id: databaseId
      })
    });
    console.log(`Created database:\n${database.id}\n`)
  }
  ,
  /**
   * Read the database definition
   */
  async readDatabase() {
    const { resource: databaseDefinition } = await this.getClient().then((client) => {
      return client.database(databaseId)
        .read()
    });

    console.log(`Reading database:\n${databaseDefinition.id}\n`)
  }
  ,
  /**
   * Create the container if it does not exist
   */
  async createContainer(containerID) {
    const { container } = await this.getClient().then((client) => {
      return client.database(databaseId)
        .containers.createIfNotExists(
          { id: containerID, partitionKey },
          { offerThroughput: 400 }
        )
    });

    console.log(`Created container:\n${config.container.id}\n`)
  }
  ,
  /**
   * Read the container definition
   */
  async readContainer(containerId) {
    const { resource: containerDefinition } = await this.getClient().then((client) => {
      return client.database(databaseId)
        .container(containerId)
        .read()
    });
    console.log(`Reading container:\n${containerDefinition.id}\n`)
  }
  ,
  /**
   * Scale a container
   * You can scale the throughput (RU/s) of your container up and down to meet the needs of the workload. Learn more: https://aka.ms/cosmos-request-units
   */
  async scaleContainer(containerId) {


    const { resource: containerDefinition } = await this.getClient().then((client) => {
      return client
        .database(databaseId)
        .container(containerId)
        .read()
    });

    const { resources: offers } = await client.offers.readAll().fetchAll();

    const newRups = 500;
    for (var offer of offers) {
      if (containerDefinition._rid !== offer.offerResourceId) {
        continue;
      }
      offer.content.offerThroughput = newRups;
      return await this.getClient().then((client) => {

        const offerToReplace = client.offer(offer.id);
        offerToReplace.replace(offer);
        console.log(`Updated offer to ${newRups} RU/s\n`);
      });
      break;
    }
  }
  ,
  /**
   * Create family item if it does not exist
   */
  async createFamilyItem(itemBody, containerId) {
    const { item } = await this.getClient().then((client) => {
      return client
        .database(databaseId)
        .container(containerId)
        .items.upsert(itemBody)
    });


    console.log(`Created family item with id:\n${itemBody.id}\n`)
  },
  /**
   * Query the container using SQL
   */
  async queryContainer(containerId, idCliente) {
    console.log(idCliente);
    const querySpec = {
      query: 'SELECT * FROM root r WHERE r.id = @email',
      parameters: [
        {
          name: '@email',
          value: idCliente
        }
      ]
    }
    return await this.getClient().then((client) => {
      return client.database(databaseId)
        .container(containerId)
        .items.query(querySpec)
        .fetchAll()
    });


  }
  ,
  async queryAllOrder(containerId, idCliente) {
    const querySpec = {
      query: 'SELECT * FROM root r Where r.pedidos!=[]',

    }

    return await this.getClient().then((client) => {
      return client
        .database(databaseId)
        .container(containerId)
        .items.query(querySpec)
        .fetchAll()
    });

  }
  ,
  /**
   * Replace the item by ID.
   */
  async replaceFamilyItem(itemBody, containerId) {
    const { item } = await this.getClient().then((client) => {
      return client
        .database(databaseId)
        .container(containerId)
        .item(itemBody.id)
        .replace(itemBody)
    });
  },
  /**
   * Delete the item by ID.
   */
  async deleteFamilyItem(itemBody, containerId) {
    await this.getClient().then((client) => {
      return client
        .database(databaseId)
        .container(containerId)
        .item(itemBody.id, itemBody.Country)
        .delete(itemBody)
    });


    console.log(`Deleted item:\n${itemBody.id}\n`)
  },

  /**
   * Cleanup the database and collection on completion
   */
  async cleanup() {
    await client.database(databaseId).delete()
  },

  encrypt(text) {

    var cipher = crypto.createCipher(algorithm, password)
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
  },

  decrypt(text) {
    var decipher = crypto.createDecipher(algorithm, password)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
  },

  async updatEstoque(lista, catalogo, remove) {
    //atualiza nome no share
    //atualiza nome no blob
    var url = `https://alanfachim.blob.core.windows.net/${catalogo}/data.js`;
    var config = {};
    const fetch = require('node-fetch');
    let settings = { method: "Get" };
    // @ts-ignore
    await fetch(url, settings)
      .then(res => res.json())
      .then((json) => {
        config = json;
      });

    config["produtos"].forEach(element => {
      var a = [];
      a = lista.filter(function (objLista) {
        return objLista.SKU == element.SKU;
      });
      if (a.length > 0) {
        if (remove)
          element.qt = parseInt(element.qt) - a.length;
        else
          element.qt = parseInt(element.qt) + a.length;
      }

    });
    await creds("BLOB_CONNECTIONSTRING").then((key) => {
      const blobServiceClient = BlobServiceClient.fromConnectionString(key);
      const containerClient = blobServiceClient.getContainerClient(catalogo);
      const content = this.cleanString(JSON.stringify(config, null, 2));
      const blockBlobClient = containerClient.getBlockBlobClient('data.js');
      return blockBlobClient.upload(content, content.length);
    })

  },
  cleanString(input) {
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
  },
  geratoken(user, pass, ip) {
    return this.encrypt(`{"user":"${user}","timeout":${Date.now() + 30 * 60 * 1000},"ip":"${ip}"}`);
  },
  validatoken(token, user, ip) {
    try {
      const obj = JSON.parse(this.decrypt(token));
      return obj.user == user && (ip.includes(obj.ip) || obj.ip == "undefined") && Date.now() < obj.timeout;
    } catch (e) {
      return false;
    }
  }
}


