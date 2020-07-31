// import { DataSource } from "@loopback/repository";
import {ordersDefinition} from './orders.repository.api';
import {DataSource} from 'loopback-datasource-juggler';

const ordersDataSource: DataSource = new DataSource('Order', {
  connector: 'loopback-connector-openapi',
  spec: ordersDefinition,
  debug: true,
});

export {ordersDataSource};
