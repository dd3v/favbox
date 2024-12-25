import sqlite3InitModule from '@sqlite.org/sqlite-wasm';

const logHtml = function (cssClass, ...args) {
  postMessage({
    type: 'log',
    payload: { cssClass, args },
  });
};

const log = (...args) => logHtml('', ...args);
const error = (...args) => logHtml('error', ...args);

const start = function (sqlite3) {
  const { capi } = sqlite3; // C-style API
  const oo = sqlite3.oo1; // High-level OO API
  log('SQLite3 version', capi.sqlite3_libversion(), capi.sqlite3_sourceid());
  let db;
  if ('OpfsDb' in oo) {
    db = new oo.OpfsDb('/mydb.sqlite3');
    log('The OPFS is available.');
    log('Persisted db =', db.filename);
  } else {
    db = new oo.DB('/mydb.sqlite3', 'ct');
    log('The OPFS is not available.');
    log('transient db =', db.filename);
  }

  try {
    const result = db.exec(`
        SELECT name 
        FROM sqlite_master 
        WHERE type='table' AND name='t';
    `);

    log('table...', JSON.stringify(result));

    log('Create a table...');
    const q = db.exec('CREATE TABLE IF NOT EXISTS t(a,b)');
    log('Insert some data using exec()...', q);

    db.exec(`
        
        -- -------------------------------------------------------------
-- TablePlus 6.2.1(578)
--
-- https://tableplus.com/
--
-- Database: mydb.sqlite3
-- Generation Time: 2024-12-25 23:09:09.9950
-- -------------------------------------------------------------

-- Включаем поддержку внешних ключей
PRAGMA foreign_keys = OFF;

DROP TABLE IF EXISTS "keywords";
DROP TABLE IF EXISTS "tags";
DROP TABLE IF EXISTS "bookmarks";

PRAGMA foreign_keys = ON;
CREATE TABLE bookmarks (
    id TEXT PRIMARY KEY,
    title TEXT,
    url TEXT,
    folderId TEXT,
    folderName TEXT,
    pinned INTEGER,
    locale TEXT,
    httpStatus INTEGER,
    dateAdded INTEGER,
    createdAt TEXT,
    updatedAt TEXT
);

DROP TABLE IF EXISTS "keywords";
CREATE TABLE keywords (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bookmarkId TEXT,
    keyword TEXT,
    FOREIGN KEY (bookmarkId) REFERENCES bookmarks (id) ON DELETE CASCADE
);


DROP TABLE IF EXISTS "tags";
CREATE TABLE tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bookmarkId TEXT,
    tag TEXT,
    FOREIGN KEY (bookmarkId) REFERENCES bookmarks (id) ON DELETE CASCADE
);

INSERT INTO "bookmarks" ("id", "title", "url", "folderId", "folderName", "pinned", "locale", "httpStatus", "dateAdded", "createdAt", "updatedAt") VALUES
('54465', 'Top 6 Most Popular API Architecture Styles', 'https://www.youtube.com/watch?v=4vLxWqE94l4&ab_channel=ByteByteGo', '1', 'Bookmarks Bar', '0', 'EN', '200', '1685528309000', '2024-12-08T11:08:10.475Z', '2024-12-08T11:08:10.475Z');

INSERT INTO "keywords" ("id", "bookmarkId", "keyword") VALUES
('1', '54465', 'video'),
('2', '54465', 'sharing'),
('3', '54465', 'camera phone'),
('4', '54465', 'video phone'),
('5', '54465', 'free'),
('6', '54465', 'upload');

INSERT INTO "sqlite_sequence" ("name", "seq") VALUES
('keywords', '6'),
('tags', '4'),
('keywords', '6');

INSERT INTO "tags" ("id", "bookmarkId", "tag") VALUES
('1', '54465', 'API'),
('2', '54465', 'REST'),
('3', '54465', 'architecture'),
('4', '54465', 'design patterns');

        `);

       let i;
    for (i = 20; i <= 25; ++i) {
      db.exec({
        sql: 'INSERT INTO t(a,b) VALUES (?,?)',
        bind: [i, i * 2],
      });
    }
    log("Query data with exec() using rowMode 'array'...");
    db.exec({
      sql: 'SELECT * FROM bookmarks LIMIT 3',
      rowMode: 'array', // 'array' (default), 'object', or 'stmt'
      callback: function (row) {
        log('row ', ++this.counter, '=', row);
      }.bind({ counter: 0 }),
    });
  } catch (e) {
    console.warn(e);
  } finally {
    db.close();
  }
};

log('Loading and initializing sqlite3 module...');
sqlite3InitModule({
  print: log,
  printErr: error,
}).then((sqlite3) => {
  log('Done initializing. Running demo...');
  try {
    start(sqlite3);
  } catch (e) {
    error('Exception:', e.message);
  }
});
