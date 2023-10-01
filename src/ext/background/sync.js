import fetchHelper from '@/helpers/fetch';
import { parseHTML } from 'linkedom';
import bookmarkHelper from '@/helpers/bookmarks';
import tagHelper from '@/helpers/tags';
import BookmarkStorage from '@/storage/bookmark';
import initStorage from '@/storage/idb/idb';
import Parser from '@/helpers/parser';

let bookmarkStorage = null;
let folders = [];

const syncBookmarks = async () => {
  await prepareStorage();
  const storage = await chrome.storage.session.get('import');
  if (storage?.import === true) {
    console.warn('🕒 Sync in current session already finished..');
    return;
  }
  console.time('Execution time');
  const total = await bookmarkHelper.total();
  console.log('⭐️ Total bookmarks', total);
  let batch = [];
  let processed = 0;
  const root = await chrome.bookmarks.getChildren('0');
  for await (const bookmark of traverseTreeRecursively(root)) {
    processed += 1;
    batch.push(bookmark);
    if (batch.length % 50 === 0 || processed === total) {
      try {
        await sync(batch);
        batch = [];
        const progress = Math.round((processed / total) * 100);
        chrome.runtime.sendMessage({
          type: 'swDbUpdated',
          data: { progress },
        });
      } catch (e) {
        console.error(e);
      }
    }
  }
  await chrome.storage.session.set({ import: true });
  console.timeEnd('Execution time');
};

async function prepareStorage() {
  const dbCreated = await initStorage();
  if (dbCreated === true) {
    console.warn('Database created..');
  }
  bookmarkStorage = new BookmarkStorage();
  folders = await bookmarkHelper.getFolders();
}

async function* traverseTreeRecursively(bookmarks) {
  for (const bookmark of bookmarks) {
    if (Object.hasOwn(bookmark, 'url')) {
      yield bookmark;
    } else {
      // eslint-disable-next-line no-await-in-loop
      yield* traverseTreeRecursively(
        // eslint-disable-next-line no-await-in-loop
        await chrome.bookmarks.getChildren(String(bookmark.id)),
      );
    }
  }
}

async function sync(bookmarks) {
  console.warn('syncing bookmarks..', bookmarks);
  let promises = [];
  const synced = await bookmarkStorage.getByIds(
    bookmarks.map((item) => parseInt(item.id, 10)),
  );
  if (synced.length === bookmarks.length) return;
  for (const bookmark of bookmarks) {
    if (!synced.find((item) => parseInt(item.id, 10) === parseInt(bookmark.id, 10))) {
      promises.push(fetchBookmark(bookmark));
    }
  }
  try {
    if (promises.length !== 0) {
      const response = await Promise.all(promises);
      console.warn('promisse', response);
      await bookmarkStorage.createMultiple(response);
    }
  } catch (e) {
    console.error(e);
  } finally {
    promises = [];
  }
}

async function fetchBookmark(bookmark) {
  const folder = folders.find((item) => item.id === bookmark.parentId);
  let entity = {
    id: parseInt(bookmark.id, 10),
    folder,
    folderName: folder.title,
    title: tagHelper.getTitle(bookmark.title),
    description: null,
    favicon: null,
    image: null,
    domain: null,
    type: null,
    keywords: [],
    url: bookmark.url,
    tags: tagHelper.getTags(bookmark.title),
    favorite: 0,
    error: 0,
    dateAdded: bookmark.dateAdded,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  try {
    const page = await fetchHelper.getData(bookmark.url, 5000);
    const { document } = parseHTML(page.text);
    const pageInfo = new Parser(bookmark.url, document).getFullPageInfo();
    entity = { ...entity, ...pageInfo };
    return entity;
  } catch (e) {
    entity.error = e?.code ?? 0;
    console.warn(e);
    return entity;
  }
}

export default syncBookmarks;
