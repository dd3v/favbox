import { parseHTML } from 'linkedom';
import BookmarkStorage from '@/storage/bookmark';
import initStorage from '@/storage/idb/idb';
import makeHash from '@/helpers/hash';
import Parser from '@/libs/parser';
import PageRequest from '@/libs/pageRequest';
import tagHelper from '@/helpers/tags';
import bookmarkHelper from '@/helpers/bookmarks';

const saved = '/icons/icon32_saved.png';
const notSaved = '/icons/icon32.png';

(async () => {
  let installed = true;
  const dbCreated = await initStorage();
  if (dbCreated === true) {
    console.warn('Database created..');
    installed = true;
  }
  const bookmarkStorage = new BookmarkStorage();
  const folders = await bookmarkHelper.getFolders();

  // https://developer.chrome.com/docs/extensions/reference/tabs/#event-onUpdated
  chrome.tabs.onUpdated.addListener(async (tabId, info) => {
    if (info.status === 'loading') {
      const tab = await chrome.tabs.get(parseInt(tabId, 10));
      const bookmarkSearchResults = await chrome.bookmarks.search({
        url: tab.url,
      });
      chrome.action.setIcon({
        tabId,
        path:
          bookmarkSearchResults.length === 0
            ? notSaved
            : saved,
      });
    }
  });

  // https://bugs.chromium.org/p/chromium/issues/detail?id=1185241
  // https://stackoverflow.com/questions/53024819/chrome-extension-sendresponse-not-waiting-for-async-function/53024910#53024910
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getBookmark') {
      (async () => {
        sendResponse({ success: true });
      })();
    }
    return true;
  });

  // https:// developer.chrome.com/docs/extensions/reference/bookmarks/#event-onCreated
  chrome.bookmarks.onCreated.addListener(async (id, bookmark) => {
    console.log('🎉 Bookmark has been created..');
    try {
      updateExtensionIcon(bookmark.url, false);
    } catch (e) {
      console.error(e);
    }
    const storageIndex = makeHash(bookmark.url);
    let pageInfo = await chrome.storage.session.get(storageIndex);
    console.warn(pageInfo);
    if (Object.keys(pageInfo).length === 0) {
      console.log('Cache is empty. Fetching data.. 🌎');
      try {
        const page = await new PageRequest(bookmark.url).getData();
        const { document } = parseHTML(page.text);
        pageInfo = new Parser(bookmark.url, document).getFullPageInfo();
      } catch (e) {
        console.error(e);
      }
    } else {
      pageInfo = pageInfo[storageIndex];
    }
    try {
      const folder = folders.find(
        (item) => parseInt(item.id, 10) === parseInt(bookmark.parentId, 10),
      );
      const entity = {
        id: parseInt(bookmark.id, 10),
        folderName: folder.title,
        folder,
        title: tagHelper.getTitle(bookmark.title),
        url: bookmark.url,
        description: pageInfo.description ?? null,
        favicon: pageInfo.favicon ?? null,
        image: pageInfo.image ?? null,
        domain: pageInfo.domain ?? null,
        tags: tagHelper.getTags(bookmark.title),
        type: pageInfo.type,
        keywords: pageInfo.keywords,
        favorite: 0,
        error: 0,
        dateAdded: bookmark.dateAdded,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await bookmarkStorage.create(entity);
      chrome.runtime.sendMessage({ type: 'swDbUpdated', data: { installed } });
    } catch (e) {
      console.error('🎉', e, id, bookmark);
    }
  });

  // https://developer.chrome.com/docs/extensions/reference/bookmarks/#event-onChanged
  chrome.bookmarks.onChanged.addListener(async (id, changeInfo) => {
    try {
      console.log('🔄 Bookmark has been updated..', id, changeInfo);
      await bookmarkStorage.update(id, {
        title: tagHelper.getTitle(changeInfo.title),
        tags: tagHelper.getTags(changeInfo.title),
        url: changeInfo.url,
        updatedAt: new Date().toISOString(),
      });
      await bookmarkStorage.updateFolders(id, changeInfo.title);
      chrome.runtime.sendMessage({ type: 'swDbUpdated', data: { installed } });
    } catch (e) {
      console.error('🔄', e, id, changeInfo);
    }
  });

  // https://developer.chrome.com/docs/extensions/reference/bookmarks/#event-onMoved
  chrome.bookmarks.onMoved.addListener(async (id, moveInfo) => {
    try {
      console.log('🗂 Bookmark has been moved..', id, moveInfo);
      const folder = folders.find((item) => item.id === moveInfo.parentId);
      console.warn(folder);
      await bookmarkStorage.update(id, {
        folderName: folder.title,
        folder,
        updatedAt: new Date().toISOString(),
      });
      chrome.runtime.sendMessage({ type: 'swDbUpdated', data: { installed } });
    } catch (e) {
      console.error('🗂', e, id, moveInfo);
    }
  });

  // https://developer.chrome.com/docs/extensions/reference/bookmarks/#event-onRemoved
  chrome.bookmarks.onRemoved.addListener(async (id, removeInfo) => {
    try {
      const bookmark = await bookmarkStorage.getById(id);
      if (bookmark) {
        const bookmarkSearchResults = await chrome.bookmarks.search({
          url: bookmark.url,
        });
        if (bookmarkSearchResults.length === 0) {
          updateExtensionIcon(bookmark.url, true);
        }
      }
    } catch (e) {
      console.error(e);
    }
    try {
      console.log('🗑️ Bookmark has been removed..', id, removeInfo);
      await bookmarkStorage.remove(id);
      chrome.runtime.sendMessage({ type: 'swDbUpdated', data: { installed } });
    } catch (e) {
      console.error('🗑️', e, id, removeInfo);
    }
  });

  const storage = await chrome.storage.session.get('import');
  if (storage?.import !== true) {
    console.time('Execution time');
    const total = await bookmarkHelper.total();
    console.log('⭐️ Total bookmarks', total);
    let batch = [];
    let processed = 0;
    const root = await chrome.bookmarks.getChildren('0');
    for await (const bookmark of traverseTreeRecursively(root)) {
      processed += 1;
      batch.push(bookmark);
      if (batch.length % 10 === 0 || processed === total) {
        try {
          await sync(batch);
          batch = [];
          const progress = Math.round((processed / total) * 100);
          chrome.runtime.sendMessage({
            type: 'swDbUpdated',
            data: { progress, installed },
          });
        } catch (e) {
          console.error(e);
        }
      }
    }
    await chrome.storage.session.set({ import: true });
    console.timeEnd('Execution time');
  } else {
    console.warn('🕒 Sync in current session already finished..');
  }

  // service worker funcitions
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

  async function updateExtensionIcon(url, defaultIcon = true) {
    const urlWithoutAnchor = url.replace(/#.*$/, '');
    console.warn('Update icon by', url, urlWithoutAnchor);
    const tabs = await chrome.tabs.query({ url: urlWithoutAnchor });
    console.warn('Tabs to update', tabs);
    for (const tab of tabs) {
      chrome.action.setIcon({
        tabId: tab.id,
        path: defaultIcon ? notSaved : saved,
      });
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
      if (
        !synced.find(
          (item) => parseInt(item.id, 10) === parseInt(bookmark.id, 10),
        )
      ) {
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
      const page = await new PageRequest(bookmark.url).getData();
      const { document } = parseHTML(page.text);
      const pageInfo = new Parser(bookmark.url, document).getFullPageInfo();
      entity = { ...entity, ...pageInfo };
      return entity;
    } catch (e) {
      console.error(e);
      entity.error = 1;
      return entity;
    }
  }
})();
