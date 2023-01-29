import Bookmark from '@/storage/bookmark';
import initStorage from '@/storage/idb/idb';
import makeHash from '@/helpers/hash';
import Parser from '@/libs/parser';
import PageRequest from '@/libs/pageRequest';
import { parseHTML } from 'linkedom';
import tagHelper from '@/helpers/tags';
import { getFolderById } from '@/helpers/folders';

try {
  await initStorage();
} catch (e) {
  console.error('Storate error', e);
}
const bookmarkStorage = new Bookmark();

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
  let pageInfo = await chrome.storage.session.get(`${storageIndex}sdf`);
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
  console.warn(entity);
  await bookmarkStorage.create(entity);
});

chrome.bookmarks.onChanged.addListener(async (id, changeInfo) => {
  console.log('🔄 Bookmark has been updated..', id, changeInfo);
  await bookmarkStorage.update(id, {
    title: tagHelper.getTitle(changeInfo.title),
    tags: tagHelper.getTags(changeInfo.title),
    url: changeInfo.url,
    updatedAt: new Date().toISOString(),
  });
});

chrome.bookmarks.onMoved.addListener(async (id, moveInfo) => {
  console.log('🗂 Bookmark has been moved..', id, moveInfo);
  const folder = await getFolderById(moveInfo.parentId);
  await bookmarkStorage.update(id, { folder, folderName: folder.title, updatedAt: new Date().toISOString() });
});

// https://developer.chrome.com/docs/extensions/reference/bookmarks/#event-onRemoved
chrome.bookmarks.onRemoved.addListener(async (id, removeInfo) => {
  console.log('🗑️ Bookmark has been removed..', id, removeInfo);
  await bookmarkStorage.remove(id);
});

console.warn('start foreach all bookmarks');
