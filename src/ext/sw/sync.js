/* eslint-disable no-await-in-loop */
import fetchHelper from '@/helpers/fetch';
import BookmarkStorage from '@/storage/bookmark';
import initStorage from '@/storage/idb/idb';
import MetadataParser from '@/parser/metadata';
import bookmarkHelper from '@/helpers/bookmark';

const sync = async () => {
  // if (await fetchHelper.ping() === false) {
  //   return;
  // }
  console.time('Execution time');
  await initStorage();
  const bookmarkStorage = new BookmarkStorage();
  const total = await bookmarkHelper.total();
  console.log('⭐️ Total bookmarks', total);
  const { import: isImported } = await browser.storage.session.get('import');
  if (isImported) {
    console.warn('🕒 Sync in current session already finished..');
    return;
  }
  // TODO: generators?
  const bookmarksIterator = await bookmarkHelper.iterateBookmarks();
  let batch = [];
  let processed = 0;
  for await (const b of bookmarksIterator) {
    batch.push(b);
    processed += 1;
    if (batch.length % 300 === 0 || processed === total) {
      try {
        browser.runtime.sendMessage({ action: 'refresh', data: { progress: Math.round((processed / total) * 100) } });
      } catch (e) {
        console.warn('ui refresh from sync', e);
      }
      try {
        const browserBookmarkKeyList = batch.map((i) => i.id);
        const extBookmarksKeyList = await bookmarkStorage.getIds(browserBookmarkKeyList);
        if (browserBookmarkKeyList.length === extBookmarksKeyList.length) {
          batch = [];
          continue;
        }
        const extBookmarksKeySet = new Set(extBookmarksKeyList);
        const toFetch = batch.filter((i) => !extBookmarksKeySet.has(i.id));
        const httpResults = await Promise.all(toFetch.map(async (bookmark) => {
          const response = await fetchHelper.fetch(bookmark.url);
          return { bookmark, response };
        }));
        const parseResult = await Promise.all(
          httpResults.map(({ bookmark, response }) => (new MetadataParser(bookmark, response)).getFavboxBookmark()),
        );
        console.time('DB execution time');
        console.warn(parseResult);
        await bookmarkStorage.createMultipleTx(parseResult);
        console.timeEnd('DB execution time');
      } catch (e) {
        console.error(e);
      } finally {
        batch = [];
      }
    }
  }
  await browser.storage.session.set({ import: true });
  await browser.storage.local.set({
    healthcheck: {
      date: new Date().toString(),
      total,
    },
  });
  console.timeEnd('Execution time');
};

export default sync;
