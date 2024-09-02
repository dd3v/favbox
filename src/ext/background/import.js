import fetchHelper from '@/helpers/fetch';
import BookmarkStorage from '@/storage/bookmark';
import initStorage from '@/storage/idb/idb';
import Parser from '@/helpers/parser';
import bookmarkHelper from '@/helpers/bookmarks';

let bookmarkStorage = null;

const importBookmarks = async () => {
  console.time('Execution time');
  await prepareStorage();
  const total = await bookmarkHelper.total();
  console.log('⭐️ Total bookmarks', total);
  const storage = await chrome.storage.session.get('import');
  if (storage?.import) {
    console.warn('🕒 Sync in current session already finished..');
    return;
  }
  const bookmarks = getFlatBookmarksList(await chrome.bookmarks.getTree());
  console.warn('Bookmarks', bookmarks);
  let batch = [];
  let processed = 0;
  for (const b of bookmarks) {
    batch.push(b);
    processed += 1;
    if (batch.length % 100 === 0 || processed === total) {
      try {
        const browserBookmarkKeyList = batch.map((i) => parseInt(i.id, 10));
        // eslint-disable-next-line no-await-in-loop
        const extBookmarksKeyList = await bookmarkStorage.getIds(browserBookmarkKeyList);
        if (browserBookmarkKeyList.length === extBookmarksKeyList.length) {
          batch = [];
          continue;
        }
        const extBookmarksKeySet = new Set(extBookmarksKeyList);
        const toFetch = batch.filter((i) => !extBookmarksKeySet.has(parseInt(i.id, 10)));
        // eslint-disable-next-line no-await-in-loop
        const httpResults = await Promise.all(toFetch.map(async (bookmark) => {
          const response = await fetchHelper.fetch(bookmark.url);
          return { bookmark, response };
        }));
        // eslint-disable-next-line no-await-in-loop
        const parseResult = await Promise.all(httpResults.map(({ bookmark, response }) => parse(bookmark, response)));
        // eslint-disable-next-line no-await-in-loop
        await bookmarkStorage.createMultiple(parseResult);
      } catch (e) {
        console.error(e);
      } finally {
        batch = [];
      }
      try {
        chrome.runtime.sendMessage({ action: 'refresh', data: { progress: Math.round((processed / total) * 100) } });
      } catch (e) {
        console.warn('ui refresh from sync', e);
      }
    }
  }
  await chrome.storage.session.set({ import: true });
  console.timeEnd('Execution time');
};

async function parse(bookmark, response) {
  const parser = new Parser(bookmark, response);
  const result = await parser.getFavboxBookmark();
  return result;
}

async function prepareStorage() {
  const dbCreated = await initStorage();
  if (dbCreated === true) {
    console.warn('Database created..');
  }
  bookmarkStorage = new BookmarkStorage();
}

function getFlatBookmarksList(bookmarksTree) {
  const flatBookmarks = [];
  function processNode(node) {
    if (node.url) {
      flatBookmarks.push(node);
    }
    if (node.children && node.children.length > 0) {
      node.children.forEach(processNode);
    }
  }
  bookmarksTree.forEach(processNode);
  return flatBookmarks;
}

export default importBookmarks;
