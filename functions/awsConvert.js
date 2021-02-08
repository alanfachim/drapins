
var data = null;

module.exports = (context, req) => {

    try {
        if (req.query === undefined && context.queryStringParameters !== undefined) {
            req['query'] = context.queryStringParameters;
        }
        if (req.headers === undefined && context.queryStringParameters !== undefined) {
            req['headers'] = context.headers;
        }
    } catch (err) {
        console.log('Decryption error:', err);
        throw err;
    }

    return req;

}