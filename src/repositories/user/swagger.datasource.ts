// import { DataSource } from "@loopback/repository";
import {userDefinition} from './user.repository.api';
import {DataSource} from 'loopback-datasource-juggler';

const dataSource: DataSource = new DataSource('AccountService', {
  connector: 'loopback-connector-openapi',
  spec: userDefinition,
  debug: true,
});

export {dataSource};
