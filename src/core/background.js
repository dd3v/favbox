import BookmarkStorage from '@/storage/bookmark';
import initStorage from '@/storage/idb/idb';
import makeHash from '@/helpers/hash';
import Parser from '@/libs/parser';
import PageRequest from '@/libs/pageRequest';
import { parseHTML } from 'linkedom';
import tagHelper from '@/helpers/tags';
import { getFolderById, getBookmarkFolders } from '@/helpers/folders';

await initStorage();
const bookmarkStorage = new BookmarkStorage();
const folders = await getBookmarkFolders();

// https://bugs.chromium.org/p/chromium/issues/detail?id=1185241
// https://stackoverflow.com/questions/53024819/chrome-extension-sendresponse-not-waiting-for-async-function/53024910#53024910
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'cache') {
    (async () => {
      const storageIndex = makeHash(message.data.url);
      await chrome.storage.session.set({ [storageIndex]: message.data });
      sendResponse({ success: true, storageIndex });
    })();
  }
  return true;
});

// https:// developer.chrome.com/docs/extensions/reference/bookmarks/#event-onCreated
chrome.bookmarks.onCreated.addListener(async (id, bookmark) => {
  console.log('🎉 Bookmark has been created..');
  const storageIndex = makeHash(bookmark.url);
  let pageInfo = await chrome.storage.session.get(storageIndex);
  if (Object.keys(pageInfo).length === 0) {
    console.log('Cache is empty. Fetching data.. 🌎');
    try {
      const page = await new PageRequest(bookmark.url).getData();
      const { document } = parseHTML(page.text);
      pageInfo = new Parser(bookmark.url, document).getFullPageInfo();
    } catch (e) {
      console.warn(e);
    }
  }
  try {
    const folder = await getFolderById(bookmark.parentId);
    const entity = {
      id: parseInt(bookmark.id, 10),
      folder,
      folderName: folder.title,
      title: tagHelper.getTitle(bookmark.title),
      url: bookmark.url,
      description: pageInfo.description ?? null,
      favicon: pageInfo.favicon ?? null,
      image: pageInfo.image ?? null,
      domain: pageInfo.domain ?? null,
      tags: tagHelper.getTags(bookmark.title),
      favorite: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await bookmarkStorage.create(entity);
    chrome.runtime.sendMessage({ type: 'swDbUpdated' });
  } catch (e) {
    console.error('🎉', e, id, bookmark);
  }
});

chrome.bookmarks.onChanged.addListener(async (id, changeInfo) => {
  try {
    console.log('🔄 Bookmark has been updated..', id, changeInfo);
    await bookmarkStorage.update(id, {
      title: tagHelper.getTitle(changeInfo.title),
      tags: tagHelper.getTags(changeInfo.title),
      url: changeInfo.url,
      updatedAt: new Date().toISOString(),
    });
    chrome.runtime.sendMessage({ type: 'swDbUpdated' });
  } catch (e) {
    console.error('🔄', e, id, changeInfo);
  }
});

chrome.bookmarks.onMoved.addListener(async (id, moveInfo) => {
  try {
    console.log('🗂 Bookmark has been moved..', id, moveInfo);
    const folder = await getFolderById(moveInfo.parentId);
    await bookmarkStorage.update(id, {
      folder,
      folderName: folder.title,
      updatedAt: new Date().toISOString(),
    });
    chrome.runtime.sendMessage({ type: 'swDbUpdated' });
  } catch (e) {
    console.error('🗂', e, id, moveInfo);
  }
});

// https://developer.chrome.com/docs/extensions/reference/bookmarks/#event-onRemoved
chrome.bookmarks.onRemoved.addListener(async (id, removeInfo) => {
  try {
    console.log('🗑️ Bookmark has been removed..', id, removeInfo);
    await bookmarkStorage.remove(id);
    chrome.runtime.sendMessage({ type: 'swDbUpdated' });
  } catch (e) {
    console.error('🗑️', e, id, removeInfo);
  }
});

chrome.bookmarks.getTree(async (bookmarkNodes) => {
  console.warn('check bookmarks..');
  if (await chrome.storage.session.get('import') === true) {
    console.log('already done..');
    return;
  }
  console.time('execution time');
  let count = 0;
  let queue = [bookmarkNodes[0]];
  let promises = [];
  let browserBookmarks = [];
  // eslint-disable-next-line no-unreachable-loop
  while (queue.length > 0) {
    const node = queue.shift();
    if (node.children) {
      queue = queue.concat(node.children);
    }
    if (node.url) {
      browserBookmarks.push(node);
      count += 1;
      if (count % 20 === 0 || count === queue.length) {
        // eslint-disable-next-line no-await-in-loop
        const syncedBookmarks = await bookmarkStorage.getByIds(
          browserBookmarks.map((item) => parseInt(item.id, 10)),
        );
        const bookmarksMap = syncedBookmarks.reduce((acc, bookmark) => {
          acc[bookmark.id] = bookmark;
          return acc;
        }, {});
        console.warn(syncedBookmarks);
        // eslint-disable-next-line no-loop-func
        browserBookmarks.forEach((browserBookmark) => {
          if (!bookmarksMap[browserBookmark.id]) {
            promises.push(
              (async (bookmark) => {
                const folder = folders.find((item) => item.id === bookmark.parentId);
                const entity = {
                  id: parseInt(bookmark.id, 10),
                  folder,
                  folderName: folder.title,
                  title: tagHelper.getTitle(bookmark.title),
                  description: null,
                  favicon: null,
                  image: null,
                  domain: null,
                  url: bookmark.url,
                  tags: tagHelper.getTags(bookmark.title),
                  favorite: 0,
                  error: 0,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                };
                try {
                  const page = await new PageRequest(bookmark.url).getData();
                  const { document } = parseHTML(page.text);
                  const pageInfo = new Parser(bookmark.url, document).getFullPageInfo();
                  entity.description = pageInfo.description;
                  entity.favicon = pageInfo.favicon;
                  entity.image = pageInfo.image;
                  entity.domain = pageInfo.domain;
                  return entity;
                } catch (e) {
                  console.warn(e);
                  entity.error = 1;
                  return entity;
                }
              })(browserBookmark),
            );
          }
        });
        // eslint-disable-next-line no-await-in-loop
        const response = await Promise.all(promises);
        // eslint-disable-next-line no-await-in-loop
        await bookmarkStorage.createMultiple(response);
        browserBookmarks = [];
        promises = [];
      }
    }
  }
  await chrome.storage.session.set({ import: true });
  console.timeEnd('execution time');
  console.warn('total', count);
});
