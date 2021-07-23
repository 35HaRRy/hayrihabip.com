const awsServerlessExpress = require("aws-serverless-express");
const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");

const binaryMimeTypes = [
  'application/javascript',
  'application/json',
  'application/octet-stream',
  'application/x-font-ttf',
  'application/xml',
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'image/x-icon',
  'text/comma-separated-values',
  'text/css',
  'text/html',
  'text/javascript',
  'text/plain',
  'text/text',
  'text/xml'
];

const app = require("./dist/hayrihabip.com/serverless/main");

app.server.use(awsServerlessExpressMiddleware.eventContext());
const serverProxy = awsServerlessExpress.createServer(app.server, null, binaryMimeTypes);

module.exports.handler = (event, context) => awsServerlessExpress.proxy(serverProxy, event, context);
