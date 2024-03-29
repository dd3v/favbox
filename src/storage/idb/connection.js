import { Connection } from 'jsstore';
import workerInjector from 'jsstore/dist/worker_injector';

const connection = new Connection();
connection.addPlugin(workerInjector);
if (import.meta.env.MODE !== 'production') {
  connection.logStatus = true;
}

export default connection;
