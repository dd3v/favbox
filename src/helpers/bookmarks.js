const bookmarkHelper = {
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
  async getFoldersFlatten() {
    const folders = await this.getFolders();
    return folders.map((item) => item.title);
  },
};
export default bookmarkHelper;
