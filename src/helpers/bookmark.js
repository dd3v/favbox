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
 * Retrieves the tree of all folders.
 *
 * @async
 * @returns {Promise<Object[]>}
 */
  buildFolderUITree: async () => {
    const tree = await browser.bookmarks.getTree();
    const buildFolders = (nodes) => nodes
      .filter((node) => node.children && !node.url)
      .map((node) => {
        const children = buildFolders(node.children);
        return children.length > 0
          ? { id: node.id, label: node.title, children }
          : { id: node.id, label: node.title };
      });

    return buildFolders(tree[0].children);
  },

  /**
  * Retrieves all bookmarks from the browser.
  *
  * @async
  * @returns {AsyncGenerator<Object>}
 */
  async* iterateBookmarks() {
    const bookmarksTree = await browser.bookmarks.getTree();

    function* processNode(node) {
      if (node.url) {
        yield node;
      }
      if (node.children && node.children.length > 0) {
        for (const child of node.children) {
          yield* processNode(child);
        }
      }
    }

    for (const rootNode of bookmarksTree) {
      yield* processNode(rootNode);
    }
  },

  /**
  * Builds a cache of folder IDs to folder names from the browser bookmarks tree.
  * Recursively traverses the entire bookmarks tree and maps each node's ID to its title.
  *
  * @async
  * @function buildFolderCache
  * @returns {Promise<Map<string, string>>} A Map where keys are node IDs and values are node titles.
 */
  buildFoldersMap: async () => {
    const foldersMap = new Map();
    const traverseTree = (nodes) => {
      for (const node of nodes) {
        if (node.children) {
          foldersMap.set(node.id.toString(), node.title);
          traverseTree(node.children);
        }
      }
    };
    const tree = await browser.bookmarks.getTree();
    traverseTree(tree);
    return foldersMap;
  },
};

export default bookmarkHelper;
