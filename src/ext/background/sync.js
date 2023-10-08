import fetchHelper from '@/helpers/fetch';
import BookmarkStorage from '@/storage/bookmark';
import initStorage from '@/storage/idb/idb';
import Parser from '@/helpers/parser';
import bookmarkHelper from '@/helpers/bookmarks';

let bookmarkStorage = null;

const syncBookmarks = async () => {
  await prepareStorage();
  const storage = await chrome.storage.session.get('import');
  if (storage?.import) {
    console.warn('🕒 Sync in current session already finished..');
    return;
  }
  console.time('Execution time');
  const total = await bookmarkHelper.total();
  console.log('⭐️ Total bookmarks', total);
  let batch = [];
  let processed = 0;
  const bookmarksTree = await chrome.bookmarks.getTree();
  const bookmarks = getFlatBookmarksList(bookmarksTree);
  console.warn('Bookmarks', bookmarks);
  for (const bookmark of bookmarks) {
    processed += 1;
    batch.push(bookmark);
    if (batch.length % 100 === 0 || processed === total) {
      const batchIdenitifers = batch.map((i) => parseInt(i.id, 10));
      // eslint-disable-next-line no-await-in-loop
      const storedBookmarks = await bookmarkStorage.getByIds(batchIdenitifers);
      const idbBookmarkSet = new Set(storedBookmarks.map((i) => parseInt(i.id, 10)));
      if (batchIdenitifers.length === idbBookmarkSet.size) {
        batch = [];
        continue;
      }
      try {
        const requestPromises = batch.filter((i) => !idbBookmarkSet.has(parseInt(i.id, 10))).map((i) => fetchHelper.requestBookmark(i, 3000));
        // eslint-disable-next-line no-await-in-loop
        const responses = await Promise.all(requestPromises);
        const parsePromises = responses.map((response) => parse(response));
        // eslint-disable-next-line no-await-in-loop
        const parseResult = await Promise.all(parsePromises);
        // eslint-disable-next-line no-await-in-loop
        await bookmarkStorage.createMultiple(parseResult);
        const progress = Math.round((processed / total) * 100);
        chrome.runtime.sendMessage({ action: 'refresh', data: { progress } });
      } catch (e) {
        console.error(e);
      } finally {
        batch = [];
      }
    }
  }
  await chrome.storage.session.set({ import: true });
  console.timeEnd('Execution time');
};

async function parse(response) {
  const parser = new Parser(response);
  const bookmark = await parser.getFavboxBookmark();
  return bookmark;
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

export default syncBookmarks;
