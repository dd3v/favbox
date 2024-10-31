/* eslint-disable no-await-in-loop */
import fetchHelper from '@/helpers/fetch';
import BookmarkStorage from '@/storage/bookmark';
import initStorage from '@/storage/idb/idb';
import MetadataParser from '@/parser/metadata';
import bookmarkHelper from '@/helpers/bookmark';

const importBookmarks = async () => {
  if (await fetchHelper.ping() === false) {
    return;
  }
  console.time('Execution time');
  await initStorage();
  const bookmarkStorage = new BookmarkStorage();
  const total = await bookmarkHelper.total();
  console.log('⭐️ Total bookmarks', total);
  const storage = await chrome.storage.session.get('import');
  if (storage?.import) {
    console.warn('🕒 Sync in current session already finished..');
    return;
  }
  const bookmarks = await bookmarkHelper.getBookmarksFlatten();
  console.warn('Bookmarks', bookmarks);
  let batch = [];
  let processed = 0;
  for (const b of bookmarks) {
    batch.push(b);
    processed += 1;
    if (batch.length % 100 === 0 || processed === total) {
      try {
        const browserBookmarkKeyList = batch.map((i) => parseInt(i.id, 10));
        const extBookmarksKeyList = await bookmarkStorage.getIds(browserBookmarkKeyList);
        if (browserBookmarkKeyList.length === extBookmarksKeyList.length) {
          batch = [];
          continue;
        }
        const extBookmarksKeySet = new Set(extBookmarksKeyList);
        const toFetch = batch.filter((i) => !extBookmarksKeySet.has(parseInt(i.id, 10)));
        const httpResults = await Promise.all(toFetch.map(async (bookmark) => {
          const response = await fetchHelper.fetch(bookmark.url);
          return { bookmark, response };
        }));
        const parseResult = await Promise.all(
          httpResults.map(({ bookmark, response }) => (new MetadataParser(bookmark, response)).getFavboxBookmark()),
        );
        console.time('DB execution time');
        await bookmarkStorage.createMultipleTx(parseResult);
        console.timeEnd('DB execution time');
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

export default importBookmarks;
