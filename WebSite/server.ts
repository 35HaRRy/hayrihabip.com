import 'zone.js/dist/zone-node';

import { ngExpressEngine } from '@nguniversal/express-engine';
import { APP_BASE_HREF } from '@angular/common';

import { createProxyMiddleware } from 'http-proxy-middleware';
import * as express from 'express';

import { join } from 'path';

import { existsSync } from 'graceful-fs';

import { AppServerModule } from './src/main.server';
import { environment } from './src/environments/environment';

process.on('uncaughtException', function (err) {
  console.log("ERROR", err);
});

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/hayrihabip.com/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule,
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  const proxyOptions = {
    target: environment.apiUrl,
    changeOrigin: true,
    pathRewrite: {
      '^/api': ''
    }
  };
  const apiProxy = createProxyMiddleware('/api', proxyOptions);
  server.use('/api', apiProxy);

  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  server.get('*', (req, res) => {
    res.render(
      indexHtml,
      {
        req,
        providers: [{
          provide: APP_BASE_HREF,
          useValue: req.baseUrl
        }]
      }
    );
  });

  return server;
}

function run(): void {
  const port = process.env.PORT;

  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
