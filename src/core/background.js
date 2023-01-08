import Bookmark from '@/storage/bookmark';
import initStorage from '@/storage/idb/idb';
import makeHash from '@/libs/hash';

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
  console.warn('Handle native bookmark on created...');
  const storageIndex = makeHash(bookmark.url);
  const pageInfo = await chrome.storage.session.get(storageIndex);
  if (Object.keys(pageInfo).length === 0 && pageInfo.constructor === Object) {
    console.log('Data is an empty object');
  }
  console.warn(bookmark);
  const idbBookmark = pageInfo;
  idbBookmark.browserBookmarkId = parseInt(bookmark.id, 10);
  idbBookmark.parentId = parseInt(bookmark.parentId, 10);
  idbBookmark.createdAt = new Date().toISOString();
  idbBookmark.updatedAt = new Date().toISOString();
  console.warn(idbBookmark);
  await initStorage();
  new Bookmark().create(idbBookmark);
  // const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  console.log(id, bookmark);
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
