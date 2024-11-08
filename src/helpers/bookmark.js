const bookmarkHelper = {
  /**
  * Counts the total number of bookmarks (excluding folders).
  *
  * @returns {Promise<number>}
  */
  total: async () => {
    const items = await browser.bookmarks.getTree();
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
  * Recursively collects all bookmarks and their URLs from the given node.
  *
  * @param {Object} node - The bookmark node to start with. This can be a folder or a bookmark.
  *
  * @returns {Array<Object>} An array of bookmark objects, each containing:
  * - `id` {number} - The unique identifier of the bookmark.
  * - `url` {string} - The URL of the bookmark. This is `undefined` if the node is a folder.
  */
  getAllBookmarksFromNode(node) {
    let items = [];
    if (node.url) {
      items.push({ id: node.id, url: node.url });
    }
    if (node.children) {
      for (const child of node.children) {
        items = items.concat(this.getAllBookmarksFromNode(child));
      }
    }
    return items;
  },
  /**
  * Retrieves the tree of folder names and IDs for a given bookmark ID.
  *
  * @param {string|number} id - The ID of the bookmark.
  * @returns {Promise<{ ids: string[], titles: string[] }>}
  */
  getFoldersTreeByBookmark: async (id) => {
    const ids = [];
    const titles = [];
    async function getParent(pid) {
      const [bookmarkItem] = await browser.bookmarks.get(pid);
      if (bookmarkItem && !bookmarkItem.url && bookmarkItem.title) {
        ids.push(bookmarkItem.id);
        titles.push(bookmarkItem.title);
      }
      if (bookmarkItem && bookmarkItem.parentId) {
        await getParent(bookmarkItem.parentId);
      }
    }
    await getParent(String(id));
    ids.reverse();
    titles.reverse();
    return { ids, titles };
  },
  /**
  * Retrieves all folders from the bookmarks.
  *
  * @returns {Promise<Object[]>}
  */
  getFolders: async () => {
    const tree = await browser.bookmarks.getTree();
    const folders = [];
    function getFolders(bookmarks, depth = 0) {
      for (const bookmark of bookmarks) {
        if (bookmark.children) {
          if (bookmark.title !== '') {
            folders.push({
              id: bookmark.id,
              index: bookmark.index,
              parentId: bookmark.parentId,
              dateAdded: bookmark.dateAdded,
              title: bookmark.title,
              depth,
            });
          }
          getFolders(bookmark.children, depth + 1);
        }
      }
    }
    getFolders(tree);
    return folders;
  },

  /**
  * Retrieves the tree of all folders.
  *
  * @returns {Promise<Object[]>}
  */
  getFoldersTree: async () => {
    const tree = await browser.bookmarks.getTree();
    const map = new Map();
    const folders = [];

    const buildMap = (bookmarks) => {
      for (const { id, parentId, title, children, url } of bookmarks) {
        if (title && !url) {
          const node = { id, parentId, title, children: [] };
          map.set(id, node);
          if (parentId === '0') {
            folders.push(node);
          }
        }
        if (children) {
          buildMap(children);
        }
      }
    };
    buildMap(tree);
    for (const item of map.values()) {
      if (item.parentId !== '0' && map.has(item.parentId)) {
        map.get(item.parentId).children.push(item);
      }
    }
    return folders;
  },

  /**
  * Retrieves all bookmarks from the browser and flattens the hierarchical structure into array.
  *
  * @returns {Promise<Array>}
  */
  getBookmarksFlatten: async () => {
    const bookmarksTree = await browser.bookmarks.getTree();
    const flatBookmarks = [];
    function processNode(node) {
      if (node.url) {
        flatBookmarks.push(node);
      }
      if (node.children && node.children.length > 0) {
        node.children.forEach(processNode);
      }
    }
    bookmarksTree.forEach(processNode);
    return flatBookmarks;
  },
};
export default bookmarkHelper;
