const createBookmark = (bookmark) => {
  console.warn(bookmark);
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'createBookmark') {
    createBookmark(request.bookmark);
    sendResponse({ result: 'success' });
  }
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
