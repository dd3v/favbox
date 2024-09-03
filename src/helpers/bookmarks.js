const bookmarkHelper = {
  /**
  * Counts the total number of bookmarks (excluding folders).
  *
  * @returns {Promise<number>}
  */
  total: async () => {
    const items = await chrome.bookmarks.getTree();
    let count = 0;
    function countBookmarks(bookmarks) {
      bookmarks.forEach((bookmark) => {
        if (bookmark.url) {
          count += 1;
        }
        if (bookmark.children) {
          countBookmarks(bookmark.children);
        }
      });
    }
    countBookmarks(items);
    return count;
  },

  /**
  * Retrieves a bookmark or folder by its ID from the Chrome bookmarks.
  *
  * @param {string|number} id - The ID of the bookmark or folder.
  * @returns {Promise<chrome.bookmarks.BookmarkTreeNode | undefined>}
  */
  async getById(id) {
    const [item] = await chrome.bookmarks.get(String(id));
    return item;
  },
  /**
  * Retrieves the tree of folder names for a given bookmark ID, starting from the bookmark's folder up to the root.
  *
  * @param {string|number} id - The ID of the bookmark.
  * @returns {Promise<string[]>}
  */
  async getFoldersTreeByBookmark(id) {
    const folders = [];
    async function getParent(pid) {
      const [bookmarkItem] = await chrome.bookmarks.get(pid);
      if (bookmarkItem && !bookmarkItem.url && bookmarkItem.title) {
        folders.push(bookmarkItem.title);
      }
      if (bookmarkItem && bookmarkItem.parentId) {
        await getParent(bookmarkItem.parentId);
      }
    }
    await getParent(String(id));
    return folders.reverse();
  },
  /**
  * Retrieves all folders from the bookmarks.
  *
  * @returns {Promise<Object[]>}
  */
  async getFolders() {
    const tree = await chrome.bookmarks.getTree();
    const folders = [];
    function getFolders(bookmarks) {
      for (const bookmark of bookmarks) {
        if (bookmark.children) {
          if (bookmark.title !== '') {
            folders.push({
              id: bookmark.id,
              index: bookmark.index,
              parentId: bookmark.parentId,
              dateAdded: bookmark.dateAdded,
              title: bookmark.title,
            });
          }
          getFolders(bookmark.children);
        }
      }
    }
    getFolders(tree);
    return folders;
  },
  /**
  * Retrieves the titles of all folders in the bookmarks tree as a flat array.
  *
  * @returns {Promise<string[]>}
  */
  async getFoldersFlatten() {
    const folders = await this.getFolders();
    return folders.map((item) => item.title);
  },
};
export default bookmarkHelper;
