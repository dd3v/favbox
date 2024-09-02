import BookmarkStorage from '@/storage/bookmark';
import initStorage from '@/storage/idb/idb';
import Parser from '@/helpers/parser';
import fetchHelper from '@/helpers/fetch';
import tagHelper from '@/helpers/tags';
import bookmarkHelper from '@/helpers/bookmarks';
import importBookmarks from './import';
import ping from './ping';

const saved = '/icons/icon32_saved.png';
const notSaved = '/icons/icon32.png';

(async () => {
  await initStorage();
  const bookmarkStorage = new BookmarkStorage();
  const folders = await bookmarkHelper.getFolders();

  chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.session.clear();
  });

  // https://developer.chrome.com/docs/extensions/reference/tabs/#event-onUpdated
  chrome.tabs.onUpdated.addListener(async (tabId, info) => {
    if (info.status === 'loading') {
      const tab = await chrome.tabs.get(parseInt(tabId, 10));
      const bookmarkSearchResults = await chrome.bookmarks.search({
        url: tab.url,
      });
      chrome.action.setIcon({ tabId, path: bookmarkSearchResults.length === 0 ? notSaved : saved });
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
    if (bookmark.url === undefined) {
      console.warn('bad bookmark data', bookmark);
      return;
    }
    try {
      let response = {};
      const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (activeTab === undefined) {
        console.log('No tabs. It is weird. Fetching data from internet.. 🌎');
        response = await fetchHelper.fetch(bookmark.url, 7000);
      } else {
        console.warn('requesting html from tab', activeTab);
        const content = await chrome.tabs.sendMessage(activeTab.id, { action: 'getHTML' });
        response = { html: content?.html, error: 0 };
        console.warn('response from tab', response);
      }
      const entity = await (new Parser(bookmark, response)).getFavboxBookmark();
      if (entity.image === null && activeTab) {
        try {
          console.warn('📸 No image, take a screenshot', activeTab);
          const screenshot = await chrome.tabs.captureVisibleTab(activeTab.windowId, { format: 'png' });
          entity.image = screenshot;
        } catch (e) {
          console.error('📸', e);
        }
      }
      console.warn('Entity', entity);
      await bookmarkStorage.create(entity);
      console.log('🎉 Bookmark has been created..');
    } catch (e) {
      console.error('🎉', e, id, bookmark);
    }
    try {
      chrome.runtime.sendMessage({ action: 'refresh' });
    } catch (e) {
      console.error('Refresh app UI on create', e);
    }
    try {
      await tryToUpdateExtensionIcon(bookmark.url, saved);
    } catch (e) {
      console.error('Refresh ext icon on creation event', e);
    }
  });

  // https://developer.chrome.com/docs/extensions/reference/bookmarks/#event-onChanged
  chrome.bookmarks.onChanged.addListener(async (id, changeInfo) => {
    try {
      console.log('🔄 Bookmark has been updated..', id, changeInfo);
      const folder = folders.find(
        (item) => parseInt(item.id, 10) === parseInt(id, 10),
      );
      await bookmarkStorage.update(id, {
        title: tagHelper.getTitle(changeInfo.title),
        tags: tagHelper.getTags(changeInfo.title),
        url: changeInfo.url,
        updatedAt: new Date().toISOString(),
      });
      if (folder !== undefined) {
        await bookmarkStorage.updateFolders(folder.title, changeInfo.title);
      }
    } catch (e) {
      console.error('🔄', e, id, changeInfo);
    }
    try {
      chrome.runtime.sendMessage({ action: 'refresh' });
    } catch (e) {
      console.error('Refresh app UI on change', e);
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
    } catch (e) {
      console.error('🗂', e, id, moveInfo);
    }
    try {
      chrome.runtime.sendMessage({ action: 'refresh' });
    } catch (e) {
      console.error('Refresh app UI on move', e);
    }
  });

  // https://developer.chrome.com/docs/extensions/reference/bookmarks/#event-onRemoved
  chrome.bookmarks.onRemoved.addListener(async (id, removeInfo) => {
    try {
      const bookmark = await bookmarkStorage.getById(id);
      console.warn(bookmark);
      if (bookmark) {
        const bookmarkSearchResults = await chrome.bookmarks.search({ url: bookmark.url });
        console.table('Tabs with icon', bookmarkSearchResults);
        if (bookmarkSearchResults.length === 0) {
          await tryToUpdateExtensionIcon(bookmark.url, notSaved);
        }
      }
    } catch (e) {
      console.error(e);
    }
    try {
      await bookmarkStorage.remove(id);
      console.log('🗑️ Bookmark has been removed..', id, removeInfo);
    } catch (e) {
      console.error('🗑️', e, id, removeInfo);
    }
    try {
      chrome.runtime.sendMessage({ action: 'refresh' });
    } catch (e) {
      console.error('Refresh app UI on remove', e);
    }
  });

  async function tryToUpdateExtensionIcon(url, path) {
    const urlWithoutAnchor = url.replace(/#.*$/, '');
    const tabs = await chrome.tabs.query({ url: urlWithoutAnchor });
    console.warn('Update icon by', url, urlWithoutAnchor);
    console.warn('Tabs to update', tabs);
    for (const tab of tabs) {
      chrome.action.setIcon({ tabId: tab.id, path });
    }
  }

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    (async () => {
      if (request.type === 'search') {
        const bookmarks = await bookmarkStorage.search({
          tags: [],
          folders: [],
          domains: [],
          sort: 'desc',
          term: request.data.term,
          error: 0,
        });
        console.warn(bookmarks);
        const responseData = {
          bookmarks,
        };
        sendResponse(responseData);
      }
    })();
    return true;
  });

  ping();
  importBookmarks();
})();
