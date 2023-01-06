import { DATA_TYPE } from 'jsstore';
import connection from './connection';

const getDb = () => {
  const tblBookmarks = {
    name: 'bookmarks',
    columns: {
      id: {
        primaryKey: true,
        autoIncrement: true,
        dataType: DATA_TYPE.Number,
      },

      title: {
        notNull: true,
        dataType: DATA_TYPE.String,
        default: 'Untitled',
        enableSearch: true,
      },
    },
  };

  const database = {
    name: 'linkflow',
    tables: [tblBookmarks],
  };
  return database;
};

const initStorage = async () => {
  const newDb = await connection.initDb(getDb());

  return newDb;
};

export default initStorage;
