import Bookmark from '@/storage/bookmark';
import initStorage from '@/storage/idb/idb';
import makeHash from '@/helpers/hash';
import Parser from '@/libs/parser';
import PageRequest from '@/libs/pageRequest';
import { parseHTML } from 'linkedom';
import tagHelper from '@/helpers/tags';
import { findFolderByParentId } from '@/helpers/folders';

// https://bugs.chromium.org/p/chromium/issues/detail?id=1185241
// https://stackoverflow.com/questions/53024819/chrome-extension-sendresponse-not-waiting-for-async-function/53024910#53024910
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'createBookmark') {
    (async () => {
      const bookmark = await chrome.bookmarks.create(
        {
          parentId: message.data.parentId,
          title: message.data.title,
          url: message.data.url,
        },
      );
      sendResponse({ success: true, bookmark });
    })();
  }
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
  const storageIndex = makeHash(bookmark.url);
  let pageInfo = await chrome.storage.session.get(`${storageIndex}sdf`);
  if (Object.keys(pageInfo).length === 0) {
    console.log('Cache is empty. Fetching data.. 🌎');
    try {
      const page = await new PageRequest(bookmark.url).getData();
      const { document } = parseHTML(page.text);
      pageInfo = (new Parser(bookmark.url, document)).getFullPageInfo();
    } catch (e) {
      console.warn(e);
    }
  }
  const folder = findFolderByParentId(bookmark.parentId);
  console.warn(folder);
  const entity = {
    browserBookmarkId: parseInt(bookmark.id, 10),
    parentId: parseInt(bookmark.parentId, 10),
    title: tagHelper.getTitle(bookmark.title),
    url: bookmark.url,
    description: pageInfo.description ?? null,
    favicon: pageInfo.favicon ?? null,
    image: pageInfo.image ?? null,
    domain: pageInfo.domain ?? null,
    tags: tagHelper.getTags(bookmark.title),
    folder: '',
    favorite: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await initStorage();
  new Bookmark().create(entity);
});

// https://developer.chrome.com/docs/extensions/reference/bookmarks/#event-onRemoved
chrome.bookmarks.onRemoved.addListener((id, removeInfo) => {
  console.warn('remove bookmark');
  console.warn(id);
  console.warn(removeInfo);
});

// import Parser from '@/libs/parser';
// import PageRequest from '@/libs/pageRequest';
// import { parseHTML } from 'linkedom';

// // https://developer.chrome.com/docs/extensions/reference/bookmarks/#event-onChanged
// chrome.bookmarks.onChanged.addListener((id, changeInfo) => {
//   console.warn(id);
//   console.warn(changeInfo);
//   console.warn('bookmark updated');
// });

// // https://developer.chrome.com/docs/extensions/reference/bookmarks/#event-onMoved
// chrome.bookmarks.onMoved.addListener((id, moveInfo) => {
//   console.warn(id);
//   console.warn(moveInfo);
//   console.warn('moved bookmark');
// });

// // https://developer.chrome.com/docs/extensions/reference/bookmarks/#event-onImportEnded
// chrome.bookmarks.onImportEnded.addListener(() => {});

// chrome.runtime.onMessage.addListener(() => {
//   console.log('new event');
//   return true;
// });

// const page = await new PageRequest(tab.url).getData();
// const {
//   // note, these are *not* globals
//   document,
//   // other exports ..
// } = parseHTML(page.text);
// console.warn(document);
// const parser = new Parser(document);

// const preview = {
//   title: parser.getTitle(),
//   image: parser.getImage(),
//   domain: parser.getDomain(),
//   description: parser.getDescription(),
// };
// chrome.runtime.sendMessage({ data: preview });
// chrome.storage.local.set({ tabId: preview }, () => {
//   console.warn('SAVED TO CACHE');
// });
