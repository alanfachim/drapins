
const decrypt = require("./decrypt.js");

module.exports = async function () {
    var config = {}
    const url="https://alanfachim.file.core.windows.net/nuvemalan/config.json";
    // Enter your storage account name and shared key
    const fetch = require('node-fetch'); 
    const SAStoken = await decrypt("SASTOKEN_KEY");
    let settings = { method: "Get" };
    await fetch(url + SAStoken, settings)
        .then(res => res.json())
        .then((json) => {
              config = json;
        });
    config.url = url;
    config.SAStoken = SAStoken;
    config.account = "alanfachim"; 
    config.accountKey = await decrypt("FILESHARE_KEY");
    config.azureurl = `https://${config.account}.file.core.windows.net`
    config.shareName = "nuvemalan";
    config.directoryName = "";
    config.fileName = "data.js";
    return config;
} 