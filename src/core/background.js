import Bookmark from '@/storage/bookmark';
import initStorage from '@/storage/idb/idb';

// https://bugs.chromium.org/p/chromium/issues/detail?id=1185241
// https://stackoverflow.com/questions/53024819/chrome-extension-sendresponse-not-waiting-for-async-function/53024910#53024910
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'createBookmark') {
    (async () => {
      const bookmark = await chrome.bookmarks.create(
        {
          parentId: message.data.folder,
          title: message.data.title,
          url: message.data.url,
        },
      );
      await initStorage();
      const bookmarkStorage = new Bookmark();
      await bookmarkStorage.create({ title: 'sdfsdf', bookmark });
      sendResponse({ success: true, bookmark });
      return true;
    })();
  }
  return true;
});

// import Parser from '@/libs/parser';
// import PageRequest from '@/libs/pageRequest';
// import { parseHTML } from 'linkedom';

// https://developer.chrome.com/docs/extensions/reference/bookmarks/#event-onCreated
// chrome.bookmarks.onCreated.addListener((id, bookmark) => {
//   console.warn(id);
//   console.warn(bookmark);
//   console.warn('bookmark created');
// });
// // https://developer.chrome.com/docs/extensions/reference/bookmarks/#event-onChanged
// chrome.bookmarks.onChanged.addListener((id, changeInfo) => {
//   console.warn(id);
//   console.warn(changeInfo);
//   console.warn('bookmark updated');
// });

// // https://developer.chrome.com/docs/extensions/reference/bookmarks/#event-onRemoved
// chrome.bookmarks.onRemoved.addListener((id, removeInfo) => {
//   console.warn('remove bookmark');
//   console.warn(id);
//   console.warn(removeInfo);
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
