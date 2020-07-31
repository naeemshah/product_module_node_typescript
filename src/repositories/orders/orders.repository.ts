// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: loopback4-example-microservices
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

// import {ordersDataSource} from './orders.swagger.datasource';
import {Request, HttpErrors} from '@loopback/rest';
import {ordersDefinition} from './orders.repository.api';
import {DataSource} from 'loopback-datasource-juggler';
import axios from 'axios';

export type Order = {
  id: string;
};
/* tslint:disable no-any */
export class OrdersRepository {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  order: any;
  authorization: string;
  constructor(public request: Request) {
    const ordersDataSource: DataSource = new DataSource('Order', {
      connector: 'loopback-connector-openapi',
      spec: ordersDefinition,
      debug: true,
    });
    if (ordersDataSource.connector && ordersDataSource.connector.observe) {
      ordersDataSource.connector.observe(
        'before execute',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (ctx: any, next: any) => {
          ctx.req.headers = {
            ...ctx.req.headers,
            authorization: this.request.headers.authorization,
          };
          this.authorization = this.request.headers.authorization as string;
          next(null, ctx.req);
        },
      );
    }
    this.order = ordersDataSource.createModel('OrderService', {});
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async updateOrder(orderNo: string, body: any): Promise<any> {
    try {
      const host = process.env.ORDERS_HOST || 'testing.egenienext.com:3015',
        protocol = process.env.ORDERS_PROTOCOL || 'http';

      const res = await axios.post(
        `${protocol}://${host}/v1/order/updateByOrderNo/${orderNo}`,
        body,
        {
          headers: {
            authorization: this.request.headers.authorization,
          },
        },
      );
      return res.data;
    } catch (err) {
      console.log('this is the err', err);
      throw new HttpErrors.UnprocessableEntity('unable to update the order');
    }
    // let response = await this.order.updateOrder(
    //   {
    //     body: JSON.stringify(body),
    //     orderNo: `${orderNo}`,
    //     requestBody: body,
    //   },
    //   body,
    // );
    // if (response && response.obj) {
    //   response = response.obj;
    //   return response;
    // }
    // throw new HttpErrors.Unauthorized('you are unauthorizeds');
  }
}
/* tslint:enable no-any */
