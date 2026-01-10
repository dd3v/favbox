import { fetchUrl } from '@/services/httpClient';
import BookmarkStorage from '@/storage/bookmark';
import AttributeStorage from '@/storage/attribute';
import MetadataParser from '@/parser/metadata';
import { getBookmarksCount, getFoldersMap, getBookmarksIterator } from '@/services/browserBookmarks';
import hashCode from '@/services/hash';

const MAX_CONCURRENT = 50;
const BATCH_SIZE = 100;
const PROGRESS_UPDATE_INTERVAL = 1000;

const bookmarkStorage = new BookmarkStorage();
const attributeStorage = new AttributeStorage();

const sendProgress = (progress, savedCount) => {
  browser.storage.session.set({ progress });
  browser.runtime.sendMessage({ action: 'sync', data: { progress, savedCount } }).catch(() => {});
};

const fetchPageMetadata = async (bookmark, foldersMap) => {
  const response = await fetchUrl(bookmark.url);
  return (new MetadataParser(bookmark, response, foldersMap)).getFavboxBookmark();
};

const toAttribute = (key, { value, count }) => ({
  key,
  value: String(value).trim(),
  id: hashCode(key, String(value).trim()),
  count,
});

export const refreshAttributes = async () => {
  console.time('refreshAttributes');

  await attributeStorage.clear();

  const [domains, tags, keywords] = await Promise.all([
    bookmarkStorage.aggregateDomains(),
    bookmarkStorage.aggregateTags(),
    bookmarkStorage.aggregateKeywords(),
  ]);

  const attributes = [
    ...domains.map((r) => toAttribute('domain', r)),
    ...tags.map((r) => toAttribute('tag', r)),
    ...keywords.map((r) => toAttribute('keyword', r)),
  ];

  await attributeStorage.saveMany(attributes);
  console.timeEnd('refreshAttributes');
};

const sync = async () => {
  console.time('Sync time');

  const browserTotal = await getBookmarksCount();
  const idbTotal = await bookmarkStorage.total();
  const { status } = await browser.storage.session.get('status');

  await browser.storage.session.set({ browserTotal, idbTotal });
  console.log(`Browser: ${browserTotal}, IDB: ${idbTotal}, Status: ${status}`);

  if (browserTotal === idbTotal || status) {
    await browser.storage.session.set({ status: true });
    console.log('Already in sync');
    return;
  }

  await browser.storage.session.set({ status: false });
  const [foldersMap, existingIds] = await Promise.all([
    getFoldersMap(),
    bookmarkStorage.getAllIds().then((ids) => new Set(ids)),
  ]);

  const browserIds = new Set();
  const batch = [];
  let processed = 0;
  let savedCount = 0;
  let lastProgressUpdate = Date.now();

  const bookmarksToProcess = [];
  for await (const bookmark of getBookmarksIterator()) {
    browserIds.add(bookmark.id);
    if (!existingIds.has(bookmark.id)) {
      bookmarksToProcess.push(bookmark);
    }
  }

  console.log(`To process: ${bookmarksToProcess.length}`);

  const active = new Set();

  const handleBookmark = async (bookmark) => {
    try {
      const result = await fetchPageMetadata(bookmark, foldersMap);
      batch.push(result);
      processed++;
      const now = Date.now();
      if (now - lastProgressUpdate > PROGRESS_UPDATE_INTERVAL) {
        const progress = Math.round((processed / bookmarksToProcess.length) * 100);
        sendProgress(progress, savedCount);
        lastProgressUpdate = now;
      }
    } catch (error) {
      console.error(`Error processing ${bookmark.url}:`, error.message);
    }
  };

  for (const bookmark of bookmarksToProcess) {
    const promise = handleBookmark(bookmark);

    active.add(promise);
    promise.finally(() => active.delete(promise));

    if (active.size >= MAX_CONCURRENT) {
      await Promise.race(active);
    }

    if (batch.length >= BATCH_SIZE) {
      const itemsToSave = batch.splice(0, batch.length);
      await bookmarkStorage.createMany(itemsToSave);
      savedCount += itemsToSave.length;
      console.log(`Saved batch: ${itemsToSave.length}, total: ${savedCount}`);
    }
  }

  await Promise.all(active);
  if (batch.length > 0) {
    await bookmarkStorage.createMany(batch);
    savedCount += batch.length;
    console.log(`Saved final batch: ${batch.length}, total: ${savedCount}`);
  }

  const idbIds = await bookmarkStorage.getAllIds();
  const toDelete = idbIds.filter((id) => !browserIds.has(id));
  if (toDelete.length > 0) {
    console.log(`Removing ${toDelete.length} outdated bookmarks`);
    await bookmarkStorage.removeByIds(toDelete);
  }

  await refreshAttributes();
  await browser.storage.session.set({ status: true });
  sendProgress(100, savedCount);

  console.timeEnd('Sync time');
  console.log(`Saved: ${savedCount}`);
};

export default sync;
