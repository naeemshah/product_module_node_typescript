import {ProductServicesApplication} from './application';
import {ApplicationConfig} from '@loopback/core';
import * as fs from 'fs';
export {ProductServicesApplication};

export async function main(options: ApplicationConfig = {}) {
  options.rest.protocol = 'https';
  options.rest.port = 3007;

  options.rest.key = fs.readFileSync('./cert/privkey.pem');
  options.rest.cert = fs.readFileSync('./cert/cert.pem');
  const app = new ProductServicesApplication(options);
  await app.boot();
  await app.start();
  // eslint-disable-next-line require-atomic-updates
  options.rest.protocol = 'http';
  // eslint-disable-next-line require-atomic-updates
  options.rest.port = 3008;

  const app2 = new ProductServicesApplication(options);
  await app2.boot();
  await app2.start();

  const url1 = app.restServer.url;
  const url2 = app2.restServer.url;

  console.log(`Server is running at ${url1} and ${url2}`);
  // console.log(`Try ${url}/ping`);

  return app;
}
