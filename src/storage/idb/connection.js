/* eslint-disable global-require */
/* eslint-disable import/no-webpack-loader-syntax */
import { Connection } from 'jsstore';
import workerInjector from 'jsstore/dist/worker_injector';

const connection = new Connection();
if (process.env.NODE_ENV !== 'production') {
  connection.logStatus = true;
}
connection.addPlugin(workerInjector);
export default connection;
