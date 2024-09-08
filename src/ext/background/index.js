import BookmarkStorage from '@/storage/bookmark';
import initStorage from '@/storage/idb/idb';
import MetadataParser from '@/parser/metadata';
import fetchHelper from '@/helpers/fetch';
import tagHelper from '@/helpers/tags';
import bookmarkHelper from '@/helpers/bookmark';
import importBookmarks from './import';
import ping from './ping';

const ICON_SAVED = '/icons/icon32_saved.png';
const ICON_NOT_SAVED = '/icons/icon32.png';

(async () => {
  await initStorage();
  const bookmarkStorage = new BookmarkStorage();

  chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.session.clear();
  });

  // https://developer.chrome.com/docs/extensions/reference/tabs/#event-onUpdated
  chrome.tabs.onUpdated.addListener(async (tabId, info) => {
    if (info.status === 'loading') {
      try {
        const tab = await chrome.tabs.get(parseInt(tabId, 10));
        const result = await chrome.bookmarks.search({ url: tab.url });
        if (result.length) {
          setIconForOpenTab(tab.url, ICON_SAVED);
        }
      } catch (error) {
        console.error('Error getting tab or updating icon:', error);
      }
    }
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
      const entity = await (new MetadataParser(bookmark, response)).getFavboxBookmark();
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
    await setIconForOpenTab(bookmark.url, ICON_SAVED);
    refreshUserInterface();
  });

  // https://developer.chrome.com/docs/extensions/reference/bookmarks/#event-onChanged
  chrome.bookmarks.onChanged.addListener(async (id, changeInfo) => {
    try {
      console.log('🔄 Bookmark has been updated..', id, changeInfo);
      const [bookmark] = await chrome.bookmarks.get(id);
      const folderTree = await bookmarkHelper.getFoldersTreeByBookmark(id);
      if (!bookmark.url) {
        console.warn('changeInfo', changeInfo, bookmark);
        await bookmarkStorage.updateFolders(bookmark, folderTree);
      } else {
        await bookmarkStorage.update(id, {
          title: tagHelper.getTitle(changeInfo.title),
          tags: tagHelper.getTags(changeInfo.title),
          url: changeInfo.url,
          updatedAt: new Date().toISOString(),
        });
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
      const [folder] = await chrome.bookmarks.get(moveInfo.parentId);
      await bookmarkStorage.update(id, {
        folderName: folder.title,
        folder,
        folderId: parseInt(folder.id, 10),
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.error('🗂', e, id, moveInfo);
    }
    refreshUserInterface();
  });

  // https://developer.chrome.com/docs/extensions/reference/bookmarks/#event-onRemoved
  chrome.bookmarks.onRemoved.addListener(async (id, removeInfo) => {
    if (removeInfo.node.children !== undefined) {
      try {
        const items = bookmarkHelper.getAllBookmarksFromNode(removeInfo.node);
        const bookmarksToRemove = items.map((bookmark) => bookmark.id);
        const tabsToUpdate = items.map((bookmark) => bookmark.url);
        if (bookmarksToRemove.length) {
          const total = await bookmarkStorage.removeByIds(bookmarksToRemove);
          console.log('🗑️Folder has been removed..', total, id, removeInfo);
        }
        refreshUserInterface();
        console.warn(tabsToUpdate);
        const tabPromises = tabsToUpdate.map((url) => setIconForOpenTab(url, ICON_NOT_SAVED));
        await Promise.all(tabPromises);
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
      await setIconForOpenTab(bookmark.url, ICON_NOT_SAVED);
      console.log('🗑️ Bookmark has been removed..', id, removeInfo);
    } catch (e) {
      console.error('🗑️', e);
    }
  });

  // https://bugs.chromium.org/p/chromium/issues/detail?id=1185241
  // https://stackoverflow.com/questions/53024819/chrome-extension-sendresponse-not-waiting-for-async-function/53024910#53024910
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    (async () => {
      switch (message.action) {
        case 'getBookmark':
          sendResponse({ success: true });
          break;
        case 'search':
          console.warn('handle search..');
          sendResponse({ bookmarks: [] });
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
      chrome.runtime.sendMessage({ action: 'refresh' });
    } catch (e) {
      console.error('Refresh UI listener not available', e);
    }
  }

  async function setIconForOpenTab(url, path) {
    const urlWithoutAnchor = url.replace(/#.*$/, '');
    const tabs = await chrome.tabs.query({ url: urlWithoutAnchor });
    console.warn('Update icon by', url, urlWithoutAnchor);
    for (const tab of tabs) {
      chrome.action.setIcon({ tabId: tab.id, path });
    }
  }

  ping();
  importBookmarks();
})();
