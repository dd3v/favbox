import { DATA_TYPE } from 'jsstore';
import connection from './connection';

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
      folder: {
        dataType: DATA_TYPE.Object,
        enableSearch: true,
        notNull: false,
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
      type: {
        dataType: DATA_TYPE.String,
        enableSearch: true,
      },
      locale: {
        dataType: DATA_TYPE.String,
        enableSearch: true,
      },
      keywords: {
        dataType: DATA_TYPE.Array,
        multiEntry: true,
        default: null,
        enableSearch: true,
      },
      image: {
        dataType: DATA_TYPE.String,
        enableSearch: false,
      },
      tags: {
        dataType: DATA_TYPE.Array,
        multiEntry: true,
        default: null,
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
      list: {
        dataType: DATA_TYPE.Array,
        multiEntry: true,
        default: [],
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

const initStorage = async () => {
  const newDb = await connection.initDb(getDb());

  return newDb;
};

export default initStorage;
