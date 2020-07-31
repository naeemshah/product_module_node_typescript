// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: loopback4-example-microservices
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {dataSource} from './swagger.datasource';
import {Request} from '@loopback/rest';
/* tslint:disable no-any */
export class VendorRepository {
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
    this.model = dataSource.createModel('VendorService', {});
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async find(id: string): Promise<any> {
    const response = await this.model.findVendor({id: `${id}`});
    return (response && response.obj) || [];
  }
}
/* tslint:enable no-any */
