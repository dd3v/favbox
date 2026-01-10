/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable new-cap */
import { Connection, DATA_TYPE } from 'jsstore';
import workerInjector from 'jsstore/dist/worker_injector';
import jsstoreWorker from 'jsstore/dist/jsstore.worker.min.js?worker';

let connection = null;
let isDbInitialized = false;

const createConnection = () => {
  if (typeof Worker === 'undefined') {
    connection = new Connection();
    connection.addPlugin(workerInjector);
    console.warn('Web Worker is not supported.');
  } else {
    console.warn('Web Worker is supported.');

    connection = new Connection(new jsstoreWorker());
  }
  if (import.meta.env.DEV) {
    console.warn('DEV MODE');
    connection.logStatus = true;
  }
};

// using string for primary key to save compatible between Firefox and Chrome
const getDb = () => {
  const tblBookmarks = {
    name: 'bookmarks',
    columns: {
      id: {
        primaryKey: true,
        autoIncrement: false,
        dataType: DATA_TYPE.String,
      },
      folderId: {
        dataType: DATA_TYPE.String,
        enableSearch: true,
        notNull: false,
      },
      folderName: {
        dataType: DATA_TYPE.String,
        enableSearch: true,
      },
      title: {
        notNull: true,
        dataType: DATA_TYPE.String,
        enableSearch: true,
      },
      description: {
        dataType: DATA_TYPE.String,
        enableSearch: true,
      },
      domain: {
        dataType: DATA_TYPE.String,
        enableSearch: true,
      },
      url: {
        dataType: DATA_TYPE.String,
        enableSearch: true,
      },
      favicon: {
        dataType: DATA_TYPE.String,
        enableSearch: false,
      },
      keywords: {
        dataType: DATA_TYPE.Array,
        multiEntry: true,
        default: [],
        enableSearch: true,
      },
      image: {
        dataType: DATA_TYPE.String,
        enableSearch: false,
      },
      tags: {
        dataType: DATA_TYPE.Array,
        multiEntry: true,
        default: [],
        enableSearch: true,
      },
      pinned: {
        notNull: true,
        dataType: DATA_TYPE.Number,
        default: 0,
      },
      notes: {
        dataType: DATA_TYPE.String,
        notNull: false,
      },
      httpStatus: {
        notNull: true,
        dataType: DATA_TYPE.Number,
        default: 200,
      },
      createdAt: {
        dataType: DATA_TYPE.String,
        notNull: true,
        enableSearch: true,
      },
      updatedAt: {
        dataType: DATA_TYPE.String,
        notNull: true,
        enableSearch: true,
      },
      dateAdded: {
        notNull: true,
        dataType: DATA_TYPE.Number,
        enableSearch: true,
      },
    },
  };

  const tblAttributes = {
    name: 'attributes',
    columns: {
      id: {
        primaryKey: true,
        autoIncrement: false,
        dataType: DATA_TYPE.String,
      },
      key: {
        notNull: true,
        dataType: DATA_TYPE.String,
        enableSearch: true,
      },
      value: {
        notNull: true,
        dataType: DATA_TYPE.String,
        enableSearch: true,
      },
      count: {
        notNull: true,
        dataType: DATA_TYPE.Number,
        enableSearch: true,
      },
    },
  };

  const database = {
    name: 'favbox_database_v2',
    tables: [tblBookmarks, tblAttributes],
  };
  return database;
};

const useConnection = async () => {
  if (!connection) {
    createConnection();
  }

  if (!isDbInitialized) {
    await connection.initDb(getDb());
    isDbInitialized = true;
  }

  return connection;
};

export default useConnection;
