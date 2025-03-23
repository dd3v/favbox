import { Connection } from 'jsstore';
import workerInjector from 'jsstore/dist/worker_injector';
import jsstoreWorker from 'jsstore/dist/jsstore.worker.min.js?worker';

let connection = null;

const createConnection = () => {
  if (typeof Worker === 'undefined') {
    connection = new Connection();
    connection.addPlugin(workerInjector);
    connection.logStatus = true;
  } else {
    console.log('Web Worker is supported.');
    connection = new Connection(new jsstoreWorker());
  }
};
createConnection();

export default connection;
