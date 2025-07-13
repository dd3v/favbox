import BookmarkStorage from '@/storage/bookmark';
import AttributeStorage from '@/storage/attribute';
import MetadataParser from '@/parser/metadata';
import fetchHelper from '@/helpers/fetch';
import tagHelper from '@/helpers/tags';
import bookmarkHelper from '@/helpers/bookmark';
import sync from './sync';
import ping from './ping';

const bookmarkStorage = new BookmarkStorage();
const attributeStorage = new AttributeStorage();

// https://developer.chrome.com/docs/extensions/develop/migrate/to-service-workers
const waitUntil = async (promise) => {
  const keepAlive = setInterval(browser.runtime.getPlatformInfo, 25 * 1000);
  try {
    await promise;
  } finally {
    clearInterval(keepAlive);
  }
};

browser.runtime.onInstalled.addListener(async () => {
  browser.contextMenus.create({ id: 'openPopup', title: 'Bookmark this page', contexts: ['all'] });
  await browser.alarms.create('healthcheck', { periodInMinutes: 0.5 });
  await browser.storage.session.set({ nativeImport: false });
  waitUntil(sync());
});

browser.runtime.onStartup.addListener(async () => {
  console.warn('Wake up..');
  await browser.storage.session.set({ nativeImport: false });
  const alarm = await browser.alarms.get('healthcheck');
  if (!alarm) {
    await browser.alarms.create('healthcheck', { periodInMinutes: 0.5 });
  }
  waitUntil(sync());
});

browser.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'healthcheck') {
    console.log('health check');
    await browser.storage.local.set({ lastHealthCheck: Date.now() });
  }
});

browser.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === 'openPopup') {
    browser.action.openPopup();
  }
});

// https:// developer.browser.com/docs/extensions/reference/bookmarks/#event-onCreated
browser.bookmarks.onCreated.addListener(async (id, bookmark) => {
  const { nativeImport } = await browser.storage.session.get('nativeImport');
  if (nativeImport === true) {
    return;
  }
  console.time(`bookmark-created-${id}`);
  console.warn('🎉 Handle bookmark create..', id, bookmark);
  if (bookmark.url === undefined) {
    console.warn('bad bookmark data', bookmark);
    return;
  }
  let response = null;
  let activeTab = null;

  // fetch HTML from active tab (content script)
  [activeTab] = await browser.tabs.query({ active: true });
  try {
    console.warn('activeTab', activeTab);
    console.warn('requesting html from tab', activeTab);
    const content = await browser.tabs.sendMessage(activeTab.id, { action: 'getHTML' });
    response = { html: content?.html, error: 0 };
    console.warn('response from tab', response);
  } catch (e) {
    console.error('No tabs. It is weird. Fetching data from internet.. 🌎', e);
    response = await fetchHelper.fetch(bookmark.url, 15000);
  }

  try {
    if (response === null) {
      throw new Error('No page data: response is null');
    }
    const foldersMap = await bookmarkHelper.buildFoldersMap();
    const entity = await (new MetadataParser(bookmark, response, tagHelper, foldersMap)).getFavboxBookmark();
    if (entity.image === null && activeTab) {
      try {
        console.warn('📸 No image, take a screenshot', activeTab);
        const screenshot = await browser.tabs.captureVisibleTab(activeTab.windowId, { format: 'jpeg', quality: 10 });
        entity.image = screenshot;
      } catch (e) {
        console.error('📸', e);
      }
    }
    console.log('🔖 Entity', entity);
    await bookmarkStorage.create(entity);
    await attributeStorage.create(entity);
    refreshUserInterface();
    console.log('🎉 Bookmark has been created..');
  } catch (e) {
    console.error('🎉', e, id, bookmark);
  }
  console.timeEnd(`bookmark-created-${id}`);
});

// https://developer.chrome.com/docs/extensions/reference/bookmarks/#event-onChanged
browser.bookmarks.onChanged.addListener(async (id, changeInfo) => {
  console.time(`bookmark-changed-${id}`);
  try {
    const [bookmark] = await browser.bookmarks.get(id);
    // folder
    if (!bookmark.url) {
      console.warn('changeInfo', changeInfo, bookmark);
      console.warn('Folder', bookmark);
      await bookmarkStorage.updateFolderNameByFolderId(bookmark.id, bookmark.title);
      console.log('🔄 Folder has been updated..', id, changeInfo);
    }
    // bookmark
    if (bookmark.url) {
      await bookmarkStorage.update(id, {
        title: tagHelper.getTitle(changeInfo.title),
        tags: tagHelper.getTags(changeInfo.title),
        url: bookmark.url,
        updatedAt: new Date().toISOString(),
      });
      console.log('🔄 Bookmark has been updated..', id, changeInfo);
    }
  } catch (e) {
    console.error('🔄', e, id, changeInfo);
  }
  try {
    await attributeStorage.refreshTags();
    await attributeStorage.refreshFolders();
    refreshUserInterface();
  } catch (e) {
    console.error('🔄 Error updating attributes', e);
  }
  console.timeEnd(`bookmark-changed-${id}`);
});

// https://developer.chrome.com/docs/extensions/reference/bookmarks/#event-onMoved
browser.bookmarks.onMoved.addListener(async (id, moveInfo) => {
  console.time(`bookmark-moved-${id}`);
  try {
    const [folder] = await browser.bookmarks.get(moveInfo.parentId);
    console.log('🗂 Bookmark has been moved..', id, moveInfo, folder);
    await bookmarkStorage.update(id, {
      folderName: folder.title,
      folder,
      folderId: folder.id,
      updatedAt: new Date().toISOString(),
    });
    await attributeStorage.refreshFolders();
    refreshUserInterface();
  } catch (e) {
    console.error('🗂', e, id, moveInfo);
  }
  console.timeEnd(`bookmark-moved-${id}`);
});

// https://developer.chrome.com/docs/extensions/reference/bookmarks/#event-onRemoved
browser.bookmarks.onRemoved.addListener(async (id, removeInfo) => {
  console.time(`bookmark-removed-${id}`);
  console.log('🗑️ Handle remove bookmark..', id, removeInfo);
  // folder has been deleted..
  if (removeInfo.node.children !== undefined) {
    try {
      const items = bookmarkHelper.getAllBookmarksFromNode(removeInfo.node);
      const bookmarksToRemove = items.map((bookmark) => bookmark.id);
      if (bookmarksToRemove.length) {
        const total = await bookmarkStorage.removeByIds(bookmarksToRemove);
        await attributeStorage.refresh();
        console.log('🗑️ Folder has been removed..', total, id, removeInfo);
      }
      refreshUserInterface();
    } catch (e) {
      console.error('🗑️ Remove err', e);
    }
    return;
  }
  // single bookmark has been deleted..
  try {
    const bookmark = await bookmarkStorage.getById(id);
    if (!bookmark) {
      throw new Error(`Bookmark with ID ${id} not found in storage.`);
    }
    await bookmarkStorage.removeById(id);
    await attributeStorage.remove(bookmark);
    refreshUserInterface();
    console.log('🗑️ Bookmark has been removed..', id, removeInfo);
  } catch (e) {
    console.error('🗑️', e);
  }
  console.timeEnd(`bookmark-removed-${id}`);
});

// https://developer.chrome.com/docs/extensions/reference/api/bookmarks#event-onImportBegan
browser.bookmarks.onImportBegan.addListener(async () => {
  console.log('📄 Import bookmarks started');
  await browser.storage.session.set({ nativeImport: true });
  await browser.storage.session.set({ status: false });
});

// https://developer.chrome.com/docs/extensions/reference/api/bookmarks#event-onImportEnded
browser.bookmarks.onImportEnded.addListener(async () => {
  console.log('📄 Import bookmarks ended');
  await browser.storage.session.set({ nativeImport: false });
  waitUntil(sync());
});

function refreshUserInterface() {
  try {
    browser.runtime.sendMessage({ action: 'refresh' });
  } catch (e) {
    console.error('Refresh UI listener not available', e);
  }
}
ping();
