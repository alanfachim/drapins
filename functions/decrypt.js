const AWS = require('aws-sdk');
AWS.config.update({ region: 'sa-east-1' });
var data = null;

module.exports = async (env) => { 
    if (data == null) {
        try {
            var s3 = new AWS.S3();
            var params = {
                Bucket: 'teste-commit',
                Key: 'credentials.json'
            }
            var datares = await s3.getObject(params).promise();
            data = JSON.parse(datares.Body.toString('utf-8'));
            if (false) {
                const kms = new AWS.KMS();

                const data = await kms.decrypt({
                    CiphertextBlob: Buffer.from(process.env[env], 'base64'),
                }).promise();
                console.info(`Environment variable ${env} decrypted`)
                return data.Plaintext.toString('ascii');

            }
        } catch (err) {
            console.log('Decryption error:', err);
            throw err;
        }
    }
    return data[env];

}