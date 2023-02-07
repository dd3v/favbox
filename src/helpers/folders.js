const getList = (bookmarks) => {
  const folders = [];
  for (const bookmark of bookmarks) {
    if (bookmark.children) {
      folders.push({
        id: bookmark.id,
        index: bookmark.index,
        parentId: bookmark.parentId,
        dateAdded: bookmark.dateAdded,
        title: bookmark.title,
      });
      folders.push(...getList(bookmark.children));
    }
  }
  return folders;
};

const getBookmarkFolders = async () => {
  const tree = await chrome.bookmarks.getTree();
  return getList(tree).filter((folder) => folder.title !== '');
};

const getFolderById = async (id) => {
  const folders = await getBookmarkFolders();
  return folders.find((item) => parseInt(item.id, 10) === parseInt(id, 10));
};

const getFolderList = async () => {
  const folders = await getBookmarkFolders();
  return folders.map((item) => item.title);
};

export { getFolderList, getBookmarkFolders, getFolderById };
