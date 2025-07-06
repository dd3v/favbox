/* eslint-disable no-restricted-globals */
import { HTTP_STATUS } from '@/helpers/httpStatus';
import BookmarkStorage from '@/storage/bookmark';
import fetchHelper from '@/helpers/fetch';

let running = false;
let percentage = 0;

self.onmessage = (event) => {
  switch (event.data) {
    case 'start':
      running = true;
      self.postMessage({ type: 'status', value: running });
      doWork();
      break;
    case 'stop':
      running = false;
      percentage = 0;
      self.postMessage({ type: 'status', value: running });
      break;
    case 'status':
      self.postMessage({ type: 'status', value: running });
      break;
    case 'progress':
      self.postMessage({ type: 'progress', value: percentage });
      break;
    default:
      console.error('🌀 Undefined request from main thread:', event.data);
      break;
  }
};

async function doWork() {
  const bookmarkStorage = new BookmarkStorage();
  const limit = 50;
  const total = await bookmarkStorage.total();
  let processed = 0;
  let id = null;
  do {
    if (!running) break;
    // eslint-disable-next-line no-await-in-loop
    const bookmarks = await bookmarkStorage.selectAfterId(id, limit);
    if (bookmarks.length === 0) break;
    percentage = (processed / total) * 100;
    self.postMessage({ type: 'progress', value: Math.ceil(percentage) });
    // eslint-disable-next-line no-await-in-loop
    const httpResults = (await Promise.all(bookmarks.map(async (bookmark) => {
      let httpStatus = await fetchHelper.head(bookmark.url, 15000);
      if (httpStatus === HTTP_STATUS.NOT_FOUND) {
        httpStatus = (await fetchHelper.fetch(bookmark.url, 15000)).httpStatus;
      }
      return httpStatus >= HTTP_STATUS.BAD_REQUEST ? { httpStatus, id: bookmark.id } : null;
    }))).filter(Boolean);
    processed += bookmarks.length;
    if (httpResults.length) {
      self.postMessage(JSON.stringify(httpResults));
      // eslint-disable-next-line no-await-in-loop
      await Promise.all(httpResults.map((result) => bookmarkStorage.updateHttpStatusById(result.id, result.httpStatus)));
    }
    id = bookmarks[bookmarks.length - 1].id;
  } while (processed < total && running);
}
