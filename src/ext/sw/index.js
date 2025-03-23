import BookmarkStorage from '@/storage/bookmark';
import initStorage from '@/storage/idb/idb';
import MetadataParser from '@/parser/metadata';
import fetchHelper from '@/helpers/fetch';
import tagHelper from '@/helpers/tags';
import bookmarkHelper from '@/helpers/bookmark';
import sync from './sync';
// import ping from './ping';

const bookmarkStorage = new BookmarkStorage();

// https://developer.chrome.com/docs/extensions/develop/migrate/to-service-workers
const waitUntil = async (promise) => {
  const keepAlive = setInterval(browser.runtime.getPlatformInfo, 25 * 1000);
  try {
    await promise;
  } finally {
    clearInterval(keepAlive);
  }
};

const captureScreenshotByUrl = async (bookmark) => {
  const tab = await browser.tabs.create({ url: bookmark.url, active: true });
  await new Promise((resolve) => {
    browser.tabs.onUpdated.addListener(function listener(tabId, info) {
      if (tabId === tab.id && info.status === 'complete') {
        browser.tabs.onUpdated.removeListener(listener);
        resolve();
      }
    });
  });
  const dataUrl = await browser.tabs.captureVisibleTab(tab.windowId, { format: 'jpeg', quality: 10 });
  await browser.tabs.remove(tab.id);
  await bookmarkStorage.updateImageById(bookmark.id, dataUrl);
  return dataUrl;
};

browser.runtime.onInstalled.addListener(async () => {
  browser.contextMenus.create({ id: 'openPopup', title: 'Bookmark this page', contexts: ['all'] });
  await browser.alarms.create('healthcheck', { periodInMinutes: 0.5 });
  waitUntil(sync());
});

browser.runtime.onStartup.addListener(async () => {
  await initStorage();
  console.warn('Wake up..');
  const alarm = await browser.alarms.get('healthcheck');
  if (!alarm) {
    await browser.alarms.create('healthcheck', { periodInMinutes: 0.5 });
  }
  waitUntil(sync());
});

browser.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'healthcheck') {
    console.log('health check');
  }
});

browser.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === 'openPopup') {
    browser.action.openPopup();
  }
});

// https:// developer.browser.com/docs/extensions/reference/bookmarks/#event-onCreated
browser.bookmarks.onCreated.addListener(async (id, bookmark) => {
  console.warn('🎉 Handle bookmark create..', id, bookmark);
  if (bookmark.url === undefined) {
    console.warn('bad bookmark data', bookmark);
    return;
  }
  let response = null;
  const [activeTab] = await browser.tabs.query({ active: true });
  try {
    console.warn('activeTab', activeTab);
    console.warn('requesting html from tab', activeTab);
    const content = await browser.tabs.sendMessage(activeTab.id, { action: 'getHTML' });
    response = { html: content?.html, error: 0 };
    console.warn('response from tab', response);
  } catch (e) {
    console.log('No tabs. It is weird. Fetching data from internet.. 🌎');
    response = await fetchHelper.fetch(bookmark.url, 15000);
  }
  try {
    if (response === null) {
      throw new Error('No page data: response is null');
    }
    const entity = await (new MetadataParser(bookmark, response)).getFavboxBookmark();
    if (entity.image === null && activeTab) {
      try {
        console.warn('📸 No image, take a screenshot', activeTab);
        const screenshot = await browser.tabs.captureVisibleTab(activeTab.windowId, { format: 'jpeg', quality: 10 });
        entity.image = screenshot;
      } catch (e) {
        console.error('📸', e);
      }
    }
    console.warn('Entity', entity);
    const r = await bookmarkStorage.create(entity);
    console.log('🎉 Bookmark has been created..', r);
    refreshUserInterface();
  } catch (e) {
    console.error('🎉', e, id, bookmark);
  }
});

// https://developer.browser.com/docs/extensions/reference/bookmarks/#event-onChanged
browser.bookmarks.onChanged.addListener(async (id, changeInfo) => {
  try {
    console.log('🔄 Bookmark has been updated..', id, changeInfo);
    const [bookmark] = await browser.bookmarks.get(id);

    const folderTree = await bookmarkHelper.getFoldersTreeByBookmark(id);
    if (!bookmark.url) {
      console.warn('changeInfo', changeInfo, bookmark);
      await bookmarkStorage.updateFolders(bookmark, folderTree);
    } else {
      const toUpdate = {
        title: tagHelper.getTitle(changeInfo.title),
        tags: tagHelper.getTags(changeInfo.title),
        url: bookmark.url,
        updatedAt: new Date().toISOString(),
      };
      await bookmarkStorage.update(id, toUpdate);
      console.log('🔀', bookmark, toUpdate, toUpdate.tags);
      await bookmarkStorage.refreshTags();
    }
  } catch (e) {
    console.error('🔄', e, id, changeInfo);
  }
  try {
    // browser.runtime.sendMessage({ action: 'refresh' });
  } catch (e) {
    console.error('Refresh app UI on change', e);
  }
});

// https://developer.browser.com/docs/extensions/reference/bookmarks/#event-onMoved
browser.bookmarks.onMoved.addListener(async (id, moveInfo) => {
  try {
    const [folder] = await browser.bookmarks.get(moveInfo.parentId);
    console.log('🗂 Bookmark has been moved..', id, moveInfo, folder);
    await bookmarkStorage.update(id, {
      folderName: folder.title,
      folder,
      folderId: folder.id,
      updatedAt: new Date().toISOString(),
    });
  } catch (e) {
    console.error('🗂', e, id, moveInfo);
  }
  refreshUserInterface();
});

// https://developer.browser.com/docs/extensions/reference/bookmarks/#event-onRemoved
browser.bookmarks.onRemoved.addListener(async (id, removeInfo) => {
  console.log('🗑️ Handle remove bookmark..', id, removeInfo);
  if (removeInfo.node.children !== undefined) {
    try {
      const items = bookmarkHelper.getAllBookmarksFromNode(removeInfo.node);
      const bookmarksToRemove = items.map((bookmark) => bookmark.id);
      if (bookmarksToRemove.length) {
        const total = await bookmarkStorage.removeByIds(bookmarksToRemove);
        console.log('🗑️ Folder has been removed..', total, id, removeInfo);
      }
      refreshUserInterface();
    } catch (e) {
      console.error('🗑️ Remove err', e);
    }
    return;
  }
  try {
    const bookmark = await bookmarkStorage.getById(id);
    if (!bookmark) {
      throw new Error(`Bookmark with ID ${id} not found in storage.`);
    }
    await bookmarkStorage.remove(id);
    refreshUserInterface();
    console.log('🗑️ Bookmark has been removed..', id, removeInfo);
  } catch (e) {
    console.error('🗑️', e);
  }
});

// https://bugs.chromium.org/p/chromium/issues/detail?id=1185241
// https://stackoverflow.com/questions/53024819/chrome-extension-sendresponse-not-waiting-for-async-function/53024910#53024910
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    switch (message.action) {
      case 'screenshot':
        try {
          console.warn('handle take a screenshot..');
          const image = await captureScreenshotByUrl(message.bookmark);
          sendResponse({ image, error: null });
        } catch (e) {
          sendResponse({ image: null, error: e.message });
        }
        break;
      default:
        console.warn('Unknown message type:', message);
        break;
    }
  })();
  return true;
});

function refreshUserInterface() {
  try {
    browser.runtime.sendMessage({ action: 'refresh' });
  } catch (e) {
    console.error('Refresh UI listener not available', e);
  }
}
// ping();
