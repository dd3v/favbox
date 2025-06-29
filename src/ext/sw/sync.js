/* eslint-disable no-await-in-loop */
import fetchHelper from '@/helpers/fetch';
import BookmarkStorage from '@/storage/bookmark';
import AttributeStorage from '@/storage/attribute';
import initStorage from '@/storage/idb/idb';
import MetadataParser from '@/parser/metadata';
import bookmarkHelper from '@/helpers/bookmark';

const sync = async () => {
  console.time('Sync time');
  await initStorage();
  const bookmarkStorage = new BookmarkStorage();
  const attributeStorage = new AttributeStorage();
  const browserTotal = await bookmarkHelper.total();
  const idbTotal = await bookmarkStorage.total();
  await browser.storage.session.set({ browserTotal });
  await browser.storage.session.set({ idbTotal });
  console.log('⭐️ Total bookmarks in the browser:', browserTotal);
  const { status } = await browser.storage.session.get('status');
  if (browserTotal === idbTotal || status) {
    await browser.storage.session.set({ status: true });
    console.warn('🕒 Everything is up to date!');
    return;
  }
  await browser.storage.session.set({ status: false });
  const foldersMap = await bookmarkHelper.buildFoldersMap();
  console.log('Folders map:', foldersMap);
  const bookmarksIterator = await bookmarkHelper.iterateBookmarks();
  let batch = [];
  let processed = 0;
  for await (const b of bookmarksIterator) {
    batch.push(b);
    processed += 1;
    if (batch.length % 50 === 0 || processed === browserTotal) {
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
          httpResults.map(({ bookmark, response }) => (new MetadataParser(bookmark, response, foldersMap)).getFavboxBookmark()),
        );
        console.time('DB execution time');
        console.warn(parseResult);
        await bookmarkStorage.createMultipleTx(parseResult);
        await attributeStorage.refresh();
        console.timeEnd('DB execution time');
        try {
          const progress = Math.round((processed / browserTotal) * 100);
          await browser.storage.session.set({ progress });
          browser.runtime.sendMessage({ action: 'refresh', data: { progress } });
        } catch (e) {
          console.warn('ui refresh from sync', e);
        }
      } catch (e) {
        console.error(e);
      } finally {
        batch = [];
      }
    }
  }
  await browser.storage.session.set({ status: true });
  console.timeEnd('Sync time');
};

export default sync;
