// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: loopback4-example-microservices
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {dataSource} from './swagger.datasource';
import {Request, HttpErrors} from '@loopback/rest';
/* tslint:disable no-any */
export class UserRespository {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: any;

  constructor(public request: Request) {
    if (dataSource.connector && dataSource.connector.observe) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      dataSource.connector.observe('before execute', (ctx: any, next: any) => {
        ctx.req.headers = {
          ...ctx.req.headers,
          authorization: this.request.headers.authorization,
        };
        next(null, ctx.req);
      });
    }
    this.model = dataSource.createModel('UserService', {});
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async find(): Promise<any> {
    let response = await this.model.checkAuth();
    if (response && response.obj) {
      response = response.obj;
      if (
        response.isAdmin === true ||
        response.isAdmin === undefined ||
        (response.parents && response.parents.length === 0)
      ) {
        return response;
      }
      if (response.privileges && response.privileges.includes('products')) {
        return response;
      }
    }
    throw new HttpErrors.Unauthorized('you are unauthorized');
  }
}
/* tslint:enable no-any */
