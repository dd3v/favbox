import BookmarkStorage from '@/storage/bookmark';
import initStorage from '@/storage/idb/idb';
import Parser from '@/helpers/parser';
import fetchHelper from '@/helpers/fetch';
import tagHelper from '@/helpers/tags';
import bookmarkHelper from '@/helpers/bookmarks';
import syncBookmarks from './sync';
import ping from './ping';

const saved = '/icons/icon32_saved.png';
const notSaved = '/icons/icon32.png';

(async () => {
  await initStorage();
  const bookmarkStorage = new BookmarkStorage();
  const folders = await bookmarkHelper.getFolders();

  chrome.runtime.onInstalled.addListener(async () => {
    chrome.storage.session.clear();
  });

  // https://developer.chrome.com/docs/extensions/reference/tabs/#event-onUpdated
  chrome.tabs.onUpdated.addListener(async (tabId, info) => {
    if (info.status === 'loading') {
      const tab = await chrome.tabs.get(parseInt(tabId, 10));
      const bookmarkSearchResults = await chrome.bookmarks.search({
        url: tab.url,
      });
      chrome.action.setIcon({
        tabId,
        path: bookmarkSearchResults.length === 0 ? notSaved : saved,
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
    if (bookmark.url === undefined) {
      chrome.runtime.sendMessage({ action: 'refresh' });
      return;
    }
    try {
      let response = {};
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tabs.length === 0) {
        console.log('No tabs. Fetching data.. 🌎');
        response = await fetchHelper.requestBookmark(bookmark, 7000);
      } else {
        const tab = tabs[0];
        console.warn(tab);
        const content = await chrome.tabs.sendMessage(tab.id, { action: 'getHTML' });
        response = {
          html: content?.html,
          bookmark,
          error: 0,
          contentType: null,
        };
      }
      console.warn(response);
      const entity = await (new Parser(response)).getFavboxBookmark();
      if (entity.image === null && tabs.length) {
        try {
          console.warn('📸 No image, take a screenshot', tabs[0]);
          const screenshot = await chrome.tabs.captureVisibleTab(tabs[0].windowId, { format: 'png' });
          entity.image = screenshot;
        } catch (e) {
          console.error('📸', e);
        }
      }
      console.warn('Entity', entity);
      await bookmarkStorage.create(entity);
      console.log('🎉 Bookmark has been created..');
      chrome.runtime.sendMessage({ action: 'refresh' });
    } catch (e) {
      console.error('🎉', e, id, bookmark);
    }
    try {
      await updateExtensionIcon(bookmark.url, false);
    } catch (e) {
      console.error(e);
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
      chrome.runtime.sendMessage({ action: 'refresh' });
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
      chrome.runtime.sendMessage({ action: 'refresh' });
    } catch (e) {
      console.error('🗂', e, id, moveInfo);
    }
  });

  // https://developer.chrome.com/docs/extensions/reference/bookmarks/#event-onRemoved
  chrome.bookmarks.onRemoved.addListener(async (id, removeInfo) => {
    try {
      const bookmark = await bookmarkStorage.getById(id);
      console.warn(bookmark);
      if (bookmark) {
        const bookmarkSearchResults = await chrome.bookmarks.search({
          url: bookmark.url,
        });
        console.table('Tabs with icon', bookmarkSearchResults);
        if (bookmarkSearchResults.length === 0) {
          await updateExtensionIcon(bookmark.url, true);
        }
      }
    } catch (e) {
      console.error(e);
    }
    try {
      console.log('🗑️ Bookmark has been removed..', id, removeInfo);
      await bookmarkStorage.remove(id);
      chrome.runtime.sendMessage({ action: 'refresh' });
    } catch (e) {
      console.error('🗑️', e, id, removeInfo);
    }
  });

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

  ping();
  syncBookmarks();
})();
