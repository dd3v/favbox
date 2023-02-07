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
  console.warn(pageInfo);
  if (Object.keys(pageInfo).length === 0) {
    console.log('Cache is empty. Fetching data.. 🌎');
    try {
      const page = await new PageRequest(bookmark.url).getData();
      const { document } = parseHTML(page.text);
      pageInfo = new Parser(bookmark.url, document).getFullPageInfo();
    } catch (e) {
      console.warn(e);
    }
  } else {
    pageInfo = pageInfo[storageIndex];
  }
  try {
    const folder = await getFolderById(bookmark.parentId);
    console.warn(folder);
    const entity = {
      id: parseInt(bookmark.id, 10),
      folderId: parseInt(folder.id, 10),
      folderName: folder.title,
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
    await bookmarkStorage.updateFolders(id, changeInfo.title);
    chrome.runtime.sendMessage({ type: 'swDbUpdated' });
  } catch (e) {
    console.error('🔄', e, id, changeInfo);
  }
});

chrome.bookmarks.onMoved.addListener(async (id, moveInfo) => {
  try {
    console.log('🗂 Bookmark has been moved..', id, moveInfo);
    const folder = await getFolderById(moveInfo.parentId);
    console.warn(folder);
    await bookmarkStorage.update(id, {
      folderId: parseInt(folder.id, 10),
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

async function* traverseTreeRecursively(bookmarks) {
  for (const bookmark of bookmarks) {
    if (Object.hasOwn(bookmark, 'url')) {
      yield bookmark;
    } else {
      // eslint-disable-next-line no-await-in-loop
      yield* traverseTreeRecursively(await chrome.bookmarks.getChildren(String(bookmark.id)));
    }
  }
}

const fetchBookmark = async (bookmark) => {
  const folder = folders.find((item) => item.id === bookmark.parentId);
  const entity = {
    id: parseInt(bookmark.id, 10),
    folderId: parseInt(folder.id, 10),
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
    entity.type = pageInfo.type;
    entity.keywords = pageInfo.keywords;
    return entity;
  } catch (e) {
    console.warn(e);
    entity.error = 1;
    return entity;
  }
};

const sync = async (bookmarks) => {
  console.warn('syncing bookmarks..', bookmarks);
  let promises = [];
  const synced = await bookmarkStorage.getByIds(bookmarks.map((item) => parseInt(item.id, 10)));
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
      chrome.runtime.sendMessage({ type: 'swDbUpdated' });
    }
  } catch (e) {
    console.warn(e);
  } finally {
    promises = [];
  }
};

let batch = [];
let total = 0;
const root = await chrome.bookmarks.getChildren('0');
for await (const bookmark of traverseTreeRecursively(root)) {
  total += 1;
  batch.push(bookmark);
  if (batch.length % 50 === 0) {
    sync(batch);
    batch = [];
  }
}
if (batch.length !== 0) sync(batch);
console.log(`⭐️ Total bookmarks ${total}`);
