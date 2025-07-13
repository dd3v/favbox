import fetchHelper from '@/helpers/fetch';
import BookmarkStorage from '@/storage/bookmark';
import AttributeStorage from '@/storage/attribute';
import MetadataParser from '@/parser/metadata';
import tagHelper from '@/helpers/tags';
import bookmarkHelper from '@/helpers/bookmark';
import SaveQueue from '@/storage/queue';

const sync = async () => {
  console.time('🕒 Sync time');
  const bookmarkStorage = new BookmarkStorage();
  const attributeStorage = new AttributeStorage();
  const browserTotal = await bookmarkHelper.total();
  const idbTotal = await bookmarkStorage.total();
  await browser.storage.session.set({ browserTotal });
  await browser.storage.session.set({ idbTotal });
  const { status } = await browser.storage.session.get('status');
  console.warn('⭐️ Total bookmarks in the IDB:', idbTotal);
  console.log('⭐️ Total bookmarks in the browser:', browserTotal);
  console.warn('⭐️ Status:', status);
  if (browserTotal === idbTotal || status) {
    await browser.storage.session.set({ status: true });
    console.warn('🕒 Everything is up to date!');
    return;
  }
  await browser.storage.session.set({ status: false });
  const foldersMap = await bookmarkHelper.buildFoldersMap();
  console.log('Folders map:', foldersMap);
  const bookmarksIterator = await bookmarkHelper.iterateBookmarks();
  let processed = 0;
  const maxConcurrent = 50;
  const activePromises = new Set();
  const allExistingIds = new Set(await bookmarkStorage.getAllIds());

  const saveQueue = new SaveQueue(bookmarkStorage, 100);

  const processBookmark = async (bookmark) => {
    try {
      if (allExistingIds.has(bookmark.id)) {
        return { skipped: true };
      }
      const response = await fetchHelper.fetch(bookmark.url);
      const parseResult = await (new MetadataParser(bookmark, response, tagHelper, foldersMap)).getFavboxBookmark();
      await saveQueue.add(parseResult);

      console.group(`Processing bookmark ${bookmark.id}`);
      console.log(bookmark);
      console.groupCollapsed('Result');
      console.log(parseResult);
      console.groupEnd();
      console.groupEnd();

      return { success: true, data: parseResult };
    } catch (error) {
      console.error(`Error processing bookmark ${bookmark.url}:`, error);
      return { success: false, error, bookmark };
    }
  };
  const addToActivePromises = async (bookmark) => {
    const promise = processBookmark(bookmark).finally(() => {
      activePromises.delete(promise);
    });
    activePromises.add(promise);
    return promise;
  };

  for await (const bookmark of bookmarksIterator) {
    processed++;
    while (activePromises.size >= maxConcurrent) {
      try {
        await Promise.race(activePromises);
      } catch (error) {
        console.warn('Error in concurrent processing:', error);
      }
    }
    addToActivePromises(bookmark);

    if (processed % 100 === 0) {
      try {
        const progress = Math.round((processed / browserTotal) * 100);
        await browser.storage.session.set({ progress });
        browser.runtime.sendMessage({ action: 'sync', data: { progress, savedCount: saveQueue.count } });
      } catch (e) {
        console.warn('ui refresh from sync', e);
      }
    }
  }
  await Promise.all(activePromises);
  await saveQueue.flush();

  try {
    await attributeStorage.refresh();
    await browser.storage.session.set({ progress: 100 });
    browser.runtime.sendMessage({ action: 'sync', data: { progress: 100, savedCount: saveQueue.count } });
  } catch (e) {
    console.warn('final ui refresh from sync', e);
  }

  await browser.storage.session.set({ status: true });
  if (allExistingIds && allExistingIds.clear) allExistingIds.clear();
  if (saveQueue && saveQueue.queue) saveQueue.queue = [];
  console.timeEnd('🕒 Sync time');
  console.log(`✅ Processed: ${processed}, Saved: ${saveQueue.count}`);
};

export default sync;
